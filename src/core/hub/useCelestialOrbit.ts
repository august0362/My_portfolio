import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent, RefObject } from 'react';
import { cardPosition, clamp, nearestAngle, WORLD_STEP } from './orbitMath';
import { drawCelestial } from './celestialCanvas';
import type { CelestialView } from './celestialCanvas';

interface Options {
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cardsRef: RefObject<(HTMLLIElement | null)[]>;
  animated: boolean;
  paused: boolean;
  quality: 'full' | 'lite' | 'static';
  appearance: 'dark' | 'light';
  palette: 'moonlit' | 'rosewater' | 'tidal';
  onSelect: (index: number) => void;
}

export default function useCelestialOrbit({ stageRef, canvasRef, cardsRef, animated, paused, quality, appearance, palette, onSelect }: Options) {
  const state = useRef({ angle: 0, target: null as number | null, velocity: 0, speed: 0, hovered: null as number | null, focused: null as number | null, dragging: false, pointer: -1, start: 0, last: 0, lastTime: 0, moved: false, suppressUntil: 0, px: 0, py: 0, tx: 0, ty: 0, time: 0, selected: 0 });
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

    function paint(now: number) {
      frame = 0;
      if (!view || document.hidden || !visible) return;
      const dt = Math.min((now - (previous || now)) / 1000, 0.05);
      previous = now;
      const active = animated && !pauseRef.current;
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
        let closest = 0, nearest = -1;
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const position = cardPosition(s.angle + index * WORLD_STEP, view.radius, view.vertical);
          const emphasized = index === s.focused || index === s.hovered;
          const bob = active && !emphasized ? Math.sin(s.time * 0.8 + index * 1.5) * 5 : 0;
          card.style.transform = `translate(-50%,-50%) translate3d(${(position.x + s.px * (8 + position.depth * 10)).toFixed(2)}px,${(position.y + bob + s.py * 8).toFixed(2)}px,0) perspective(800px) rotateY(${(emphasized ? 0 : position.yaw).toFixed(2)}deg) rotateX(${(emphasized ? 0 : -3 + position.depth * 4).toFixed(2)}deg) scale(${(position.scale + (emphasized ? 0.04 : 0)).toFixed(3)})`;
          card.style.left = `${view.cx}px`; card.style.top = `${view.cy}px`;
          card.style.zIndex = String(emphasized ? 30 : 3 + Math.round(position.depth * 20));
          card.style.opacity = String(emphasized ? 1 : 0.48 + position.depth * 0.52);
          card.style.setProperty('--blur', `${emphasized ? 0 : position.blur}px`);
          card.style.setProperty('--fragments', String(emphasized ? 0 : position.fragments));
          card.dataset.depth = position.depth > 0.5 ? 'front' : 'rear';
          if (position.depth > nearest) { nearest = position.depth; closest = index; }
        });
        if (closest !== s.selected) { s.selected = closest; onSelect(closest); }
      }
      // The lite tier paints the sky at 30fps; DOM input remains at display cadence.
      if (ctx && (!view.lite || now - lastPaint >= 32 || !active)) {
        drawCelestial(ctx, view, s.time, s.angle, s.px, s.py); lastPaint = now;
      }
      if (animated && (active || s.dragging || s.target !== null || Math.abs(s.velocity) > 0.002 || Math.abs(s.speed) > 0.001)) frame = requestAnimationFrame(paint);
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
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; stage!.parentElement!.dataset.running = 'false'; }
      else start();
    }
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; stage.parentElement!.dataset.running = 'false'; }
    });
    resizeObserver.observe(stage); intersection.observe(stage);
    document.addEventListener('visibilitychange', visibility);
    wake.current = start;
    if (!animated) cardsRef.current.forEach((card) => card?.removeAttribute('style'));
    resize();
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility); wake.current = () => {};
      s.dragging = false; s.hovered = null; s.focused = null; s.velocity = 0; s.target = null; s.speed = 0;
    };
  }, [animated, quality, appearance, palette, canvasRef, cardsRef, stageRef, onSelect]);

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
    s.pointer = event.pointerId; s.start = event.clientX; s.last = event.clientX; s.lastTime = event.timeStamp;
    s.moved = false; s.dragging = true; s.velocity = 0; s.target = null;
    wake.current();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!animated) return;
    const s = state.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === 'mouse') { s.tx = (event.clientX - bounds.left) / bounds.width * 2 - 1; s.ty = (event.clientY - bounds.top) / bounds.height * 2 - 1; }
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
    onPointerLeave: () => { state.current.tx = 0; state.current.ty = 0; },
    onClickCapture: (event: MouseEvent<HTMLDivElement>) => { if (event.detail > 0 && performance.now() < state.current.suppressUntil) { event.preventDefault(); event.stopPropagation(); } },
  };
}
