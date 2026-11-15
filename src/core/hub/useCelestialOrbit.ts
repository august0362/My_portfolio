import { useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent, RefObject } from 'react';
import { cardPosition, clamp, nearestAngle, WORLD_STEP } from './orbitMath';
import { drawCelestial, drawLivingLight } from './celestialCanvas';
import type { CelestialView } from './celestialCanvas';
import { advanceLightField, createLightField, releaseRay } from './celestialMotion';

interface Options {
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cardsRef: RefObject<(HTMLLIElement | null)[]>;
  raysRef: RefObject<(HTMLButtonElement | null)[]>;
  animated: boolean;
  paused: boolean;
  quality: 'full' | 'lite' | 'static';
  appearance: 'dark' | 'light';
  palette: 'moonlit' | 'rosewater' | 'tidal';
  onSelect: (index: number) => void;
}

export default function useCelestialOrbit({ stageRef, canvasRef, cardsRef, raysRef, animated, paused, quality, appearance, palette, onSelect }: Options) {
  const state = useRef({ angle: 0, target: null as number | null, velocity: 0, speed: 0, hovered: null as number | null, focused: null as number | null, dragging: false, pointer: -1, start: 0, last: 0, lastTime: 0, moved: false, suppressUntil: 0, px: 0, py: 0, tx: 0, ty: 0, time: 0, selected: 0 });
  const light = useRef(createLightField());
  const interaction = useRef({ ray: -1, clock: 0, emphasis: [0, 0, 0, 0, 0], hoverX: 0, hoverY: 0 });
  const pauseRef = useRef(paused);
  const wake = useRef<() => void>(() => {});

  useEffect(() => { pauseRef.current = paused; wake.current(); }, [paused]);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    let view: CelestialView;
    let frame = 0, previous = 0, lastPaint = 0, visible = true;
    const s = state.current;
    const field = light.current, input = interaction.current;

    function paint(now: number) {
      frame = 0;
      if (!view || document.hidden || !visible) return;
      const dt = Math.min((now - (previous || now)) / 1000, 0.05);
      previous = now;
      const active = animated && !pauseRef.current;
      input.clock += dt;
      const settling = s.target !== null || Math.abs(s.velocity) > 0.002;
      stage!.parentElement!.dataset.running = String(active);
      if (active) s.time += dt;
      if (animated) {
        const ease = 1 - Math.exp(-dt * 7);
        const desiredSpeed = active && s.hovered === null && s.focused === null && !s.dragging && !settling ? 0.095 : 0;
        s.speed += (desiredSpeed - s.speed) * ease;
        if (!s.dragging) {
          if (s.target !== null) {
            s.angle += (s.target - s.angle) * (1 - Math.exp(-dt * 5));
            if (Math.abs(s.target - s.angle) < 0.001) { s.angle = s.target; s.target = null; }
          } else {
            s.angle += s.speed * dt + s.velocity * dt;
            s.velocity *= Math.exp(-dt * 4);
          }
        }
        s.px += (s.tx - s.px) * ease; s.py += (s.ty - s.py) * ease;
        input.hoverX += (s.tx - input.hoverX) * ease; input.hoverY += (s.ty - input.hoverY) * ease;
        let closest = 0, nearest = -1;
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const position = cardPosition(s.angle + index * WORLD_STEP, view.radius, view.vertical);
          const emphasized = index === s.focused || index === s.hovered;
          input.emphasis[index] += ((emphasized ? 1 : 0) - input.emphasis[index]) * (1 - Math.exp(-dt * 10));
          const emphasis = input.emphasis[index];
          const bob = Math.sin(s.time * 0.8 + index * 1.5) * 5 * (1 - emphasis);
          card.style.transform = `translate(-50%,-50%) translate3d(${(position.x + s.px * (8 + position.depth * 10)).toFixed(2)}px,${(position.y + bob + s.py * 8 - emphasis * 7).toFixed(2)}px,0) perspective(800px) rotateY(${(position.yaw * (1 - emphasis) + input.hoverX * emphasis * 4).toFixed(2)}deg) rotateX(${((-3 + position.depth * 4) * (1 - emphasis) - input.hoverY * emphasis * 3).toFixed(2)}deg) scale(${(position.scale + emphasis * 0.04).toFixed(3)})`;
          card.style.left = `${view.cx}px`; card.style.top = `${view.cy}px`;
          card.style.zIndex = String(emphasized ? 30 : 3 + Math.round(position.depth * 20));
          card.style.opacity = String(0.48 + position.depth * 0.52 + emphasis * (1 - position.depth) * 0.52);
          card.style.setProperty('--blur', `${position.blur * (1 - emphasis)}px`);
          card.style.setProperty('--fragments', String(position.fragments * (1 - emphasis)));
          card.style.setProperty('--hover', emphasis.toFixed(3));
          card.style.setProperty('--shine-x', `${50 + input.hoverX * 28}%`);
          card.style.setProperty('--shine-y', `${30 + input.hoverY * 18}%`);
          card.dataset.depth = position.depth > 0.5 ? 'front' : 'rear';
          if (position.depth > nearest) { nearest = position.depth; closest = index; }
        });
        if (closest !== s.selected) { s.selected = closest; onSelect(closest); }
        advanceLightField(field, input.clock, dt, view.width, view.height, s.time);
        field.rays.forEach((ray, index) => {
          const button = raysRef.current[index];
          if (!button) return;
          button.style.transform = `translate3d(${ray.x - 22}px,${ray.y - 22}px,0)`;
          button.dataset.held = String(ray.held);
          button.dataset.mode = ray.held ? 'held' : input.clock - ray.releasedAt < 2.6 ? 'drifting' : Math.hypot(ray.offsetX, ray.offsetY) > 2 ? 'returning' : 'orbit';
        });
      }
      // The lite tier paints the sky at 30fps; DOM input remains at display cadence.
      if (ctx && (!view.lite || now - lastPaint >= 32 || !active)) {
        drawCelestial(ctx, view, s.time, s.angle, s.px, s.py, animated ? field : undefined); lastPaint = now;
        if (animated) drawLivingLight(ctx, view, field, input.clock, s.time);
      }
      const easing = input.emphasis.some((value, index) => Math.abs(value - (index === s.hovered || index === s.focused ? 1 : 0)) > 0.001);
      const returning = field.rays.some(ray => ray.held || Math.hypot(ray.offsetX, ray.offsetY) > 0.1);
      const parallax = Math.abs(s.px - s.tx) + Math.abs(s.py - s.ty) > 0.001;
      if (animated && (active || s.dragging || s.target !== null || Math.abs(s.velocity) > 0.002 || Math.abs(s.speed) > 0.001 || easing || returning || parallax || field.ripples.length > 0 || Math.abs(field.pointer.strength - (field.pointer.active ? 1 : 0)) > 0.001)) frame = requestAnimationFrame(paint);
    }
    function start() {
      if (!frame && !document.hidden && visible) { previous = 0; frame = requestAnimationFrame(paint); }
    }
    function resize() {
      const width = stage!.clientWidth, height = stage!.clientHeight;
      const lite = quality !== 'full';
      const dpr = Math.min(devicePixelRatio || 1, lite ? 1 : 1.5);
      const colors = getComputedStyle(stage!);
      view = { width, height, cx: width * (width >= 1000 ? 0.58 : 0.5), cy: height * (width < 600 ? 0.56 : 0.53), radius: Math.min(width * (width < 600 ? 0.31 : 0.32), 470), vertical: Math.min(height * 0.16, width < 600 ? 83 : 145), lite, light: appearance === 'light', colors: { line: colors.getPropertyValue('--portal-line-rgb'), star: colors.getPropertyValue('--portal-star-rgb'), gold: colors.getPropertyValue('--portal-gold-rgb') } };
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ctx) drawCelestial(ctx, view, s.time, s.angle, s.px, s.py);
      start();
    }
    function cancelInput() {
      const pointer = s.pointer;
      field.pointer.active = false;
      if (input.ray >= 0) releaseRay(field.rays[input.ray], input.clock, true);
      input.ray = -1; s.dragging = false; s.pointer = -1; s.hovered = null;
      stage!.dataset.dragging = 'false';
      if (pointer >= 0 && stage!.hasPointerCapture(pointer)) stage!.releasePointerCapture(pointer);
    }
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; stage!.parentElement!.dataset.running = 'false'; cancelInput(); }
      else start();
    }
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; stage.parentElement!.dataset.running = 'false'; cancelInput(); }
    });
    resizeObserver.observe(stage); intersection.observe(stage);
    document.addEventListener('visibilitychange', visibility);
    wake.current = start;
    if (!animated) cardsRef.current.forEach((card) => card?.removeAttribute('style'));
    resize();
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility); wake.current = () => {};
      cancelInput();
      s.focused = null; s.velocity = 0; s.target = null; s.speed = 0;
    };
  }, [animated, quality, appearance, palette, canvasRef, cardsRef, raysRef, stageRef, onSelect]);

  const focus = (index: number | null) => {
    const s = state.current; s.focused = index;
    if (animated && index !== null) { s.target = nearestAngle(s.angle, -index * WORLD_STEP); s.velocity = 0; }
    wake.current();
  };
  const hover = (index: number | null) => { state.current.hovered = index; wake.current(); };
  const step = (direction: number) => {
    const s = state.current;
    s.target = Math.round((s.target ?? s.angle) / WORLD_STEP) * WORLD_STEP - direction * WORLD_STEP;
    s.velocity = 0; wake.current();
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!animated || !event.isPrimary || event.button !== 0) return;
    const s = state.current;
    const bounds = event.currentTarget.getBoundingClientRect(), field = light.current, input = interaction.current;
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    field.pointer.x = x; field.pointer.y = y; field.pointer.active = true;
    field.ripples.push({ x, y, time: input.clock }); field.ripples = field.ripples.slice(-5);
    s.pointer = event.pointerId; s.start = event.clientX; s.last = event.clientX; s.lastTime = event.timeStamp;
    const rayButton = (event.target as Element).closest<HTMLButtonElement>('[data-ray]');
    if (rayButton) {
      input.ray = Number(rayButton.dataset.ray);
      const ray = field.rays[input.ray]; ray.held = true; ray.flareUntil = input.clock + 1.5;
      ray.x = x; ray.y = y;
      s.dragging = false; s.moved = false;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = 'true';
      wake.current(); return;
    }
    s.moved = false; s.dragging = true; s.velocity = 0; s.target = null;
    wake.current();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!animated) return;
    const s = state.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    const field = light.current, input = interaction.current;
    field.pointer.x = event.clientX - bounds.left; field.pointer.y = event.clientY - bounds.top; field.pointer.active = true;
    field.pointer.trail.push({ x: field.pointer.x, y: field.pointer.y, time: input.clock }); field.pointer.trail = field.pointer.trail.slice(-18);
    if (event.pointerType === 'mouse') { s.tx = (event.clientX - bounds.left) / bounds.width * 2 - 1; s.ty = (event.clientY - bounds.top) / bounds.height * 2 - 1; }
    if (input.ray >= 0 && s.pointer === event.pointerId) {
      const ray = field.rays[input.ray]; ray.x = field.pointer.x; ray.y = field.pointer.y;
      if (Math.abs(event.clientX - s.start) > 4) s.moved = true;
      wake.current(); return;
    }
    wake.current();
    if (!s.dragging || s.pointer !== event.pointerId) return;
    if (Math.abs(event.clientX - s.start) > 7) {
      if (!s.moved) { event.currentTarget.setPointerCapture(event.pointerId); s.focused = null; }
      s.moved = true; s.hovered = null;
      const delta = (event.clientX - s.last) * 0.007;
      s.angle += delta;
      s.velocity = clamp(delta / Math.max(0.008, (event.timeStamp - s.lastTime) / 1000), -2.5, 2.5);
      event.currentTarget.dataset.dragging = 'true';
    }
    s.last = event.clientX; s.lastTime = event.timeStamp;
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const s = state.current;
    if (s.pointer !== event.pointerId) return;
    const input = interaction.current;
    if (input.ray >= 0) { releaseRay(light.current.rays[input.ray], input.clock, cancelled); input.ray = -1; }
    if (event.pointerType !== 'mouse') light.current.pointer.active = false;
    if (s.moved) s.suppressUntil = performance.now() + 250;
    s.dragging = false; s.pointer = -1;
    if (cancelled || event.timeStamp - s.lastTime > 100) s.velocity = 0;
    event.currentTarget.dataset.dragging = 'false';
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    wake.current();
  };
  return {
    focus, hover, step, onPointerDown, onPointerMove,
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => finish(event, false),
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finish(event, true),
    onPointerLeave: () => { state.current.tx = 0; state.current.ty = 0; light.current.pointer.active = false; wake.current(); },
    onRayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const ray = light.current.rays[index], input = interaction.current;
      const directions: Record<string, [number, number]> = { ArrowLeft: [-28, 0], ArrowRight: [28, 0], ArrowUp: [0, -28], ArrowDown: [0, 28] };
      if (directions[event.key]) {
        event.preventDefault(); const [x, y] = directions[event.key];
        ray.offsetX += x; ray.offsetY += y; releaseRay(ray, input.clock);
      } else if (event.key === 'Home' || event.key === 'Escape') { event.preventDefault(); releaseRay(ray, input.clock, true); }
      else return;
      wake.current();
    },
    onRayClick: (event: MouseEvent<HTMLButtonElement>, index: number) => {
      if (performance.now() < state.current.suppressUntil) return;
      const ray = light.current.rays[index];
      if (event.detail === 0) { ray.offsetX += 32; ray.offsetY -= 24; }
      releaseRay(ray, interaction.current.clock); wake.current();
    },
    onClickCapture: (event: MouseEvent<HTMLDivElement>) => { if (event.detail > 0 && performance.now() < state.current.suppressUntil) { event.preventDefault(); event.stopPropagation(); } },
  };
}
