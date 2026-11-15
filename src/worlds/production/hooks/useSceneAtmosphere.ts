import { useEffect, useRef } from 'react';
import { useSettings } from '@shared/settings';
import { addWaterPulse, createAtmosphere, createAtmosphereColors, drawAtmosphere } from '../effects/atmosphereCanvas';

export default function useSceneAtmosphere() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useSettings();
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const surface = scene.closest<HTMLElement>('[data-scene-interaction]') ?? scene;
    const canvas = canvasRef.current;
    let context: CanvasRenderingContext2D | null = null;
    try { context = canvas?.getContext('2d') ?? null; } catch { /* Static artwork remains available. */ }
    const field = createAtmosphere(settings.quality === 'full' ? 150 : 80);
    const style = getComputedStyle(scene);
    const colors = createAtmosphereColors(style.getPropertyValue('--forge-effects'), style.getPropertyValue('--forge-highlight'), style.getPropertyValue('--forge-scene-accent'));
    let visible = true, active = false, frame = 0, previousTime = 0, disposed = false, elapsed = 0, width = 1, height = 1;
    let x = 0, y = 0, targetX = 0, targetY = 0, lastX = '', lastY = '';
    const write = () => {
      const nextX = x.toFixed(4), nextY = y.toFixed(4);
      if (nextX === lastX && nextY === lastY) return;
      lastX = nextX; lastY = nextY;
      scene.style.setProperty('--sensor-x', nextX); scene.style.setProperty('--sensor-y', nextY);
      surface.style.setProperty('--look-x', nextX); surface.style.setProperty('--look-y', nextY);
    };
    const updateActivity = () => {
      const motion = settings.motion === 'full' && settings.quality !== 'static';
      active = motion && visible && !document.hidden;
      scene.dataset.motion = String(motion); scene.dataset.active = String(active);
      surface.dataset.sceneMotion = String(motion); surface.dataset.sceneActive = String(active);
      if (!active) { cancelAnimationFrame(frame); frame = 0; x = y = targetX = targetY = 0; write(); }
      else schedule();
    };
    const tick = (time: number) => {
      if (!active || disposed) { frame = 0; return; }
      const delta = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000 || 0.016));
      previousTime = time;
      elapsed += delta;
      const smoothing = 1 - Math.exp(-7 * delta);
      x += (targetX - x) * smoothing; y += (targetY - y) * smoothing;
      write();
      if (context) drawAtmosphere(context, field, width, height, elapsed, x, y, colors);
      if (context || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    function schedule() { if (active && !frame && !disposed) { previousTime = performance.now(); frame = requestAnimationFrame(tick); } }
    const resize = () => {
      if (disposed || !canvas) return;
      width = scene.clientWidth; height = scene.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 2200 / Math.max(1, width));
      canvas.width = Math.max(1, Math.round(width * ratio)); canvas.height = Math.max(1, Math.round(height * ratio));
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (context) drawAtmosphere(context, field, width, height, elapsed, x, y, colors);
    };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerType !== 'mouse') return;
      const rect = surface.getBoundingClientRect();
      targetX = event.buttons ? 0 : Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      targetY = event.buttons ? 0 : Math.max(-1, Math.min(1, (event.clientY - Math.max(0, rect.top)) / Math.min(rect.height, innerHeight) * 2 - 1));
      schedule();
    };
    const leave = () => { targetX = targetY = 0; schedule(); };
    const press = (event: PointerEvent) => {
      if (!active || !event.isPrimary || event.button !== 0) return;
      const rect = scene.getBoundingClientRect();
      if (rect.width && rect.height) addWaterPulse(field, (event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, elapsed);
      schedule();
    };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      if (disposed) return;
      visible = entries[0]?.isIntersecting ?? false; updateActivity();
    }, { threshold: 0 }) : undefined;
    observer?.observe(surface);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(scene); resize();
    updateActivity();
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerleave', leave);
    surface.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', updateActivity);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); resizeObserver.disconnect();
      surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave);
      surface.removeEventListener('pointerdown', press);
      window.removeEventListener('blur', leave); document.removeEventListener('visibilitychange', updateActivity);
      delete surface.dataset.sceneMotion; delete surface.dataset.sceneActive;
      surface.style.removeProperty('--look-x'); surface.style.removeProperty('--look-y');
    };
  }, [settings.motion, settings.quality, settings.palette, settings.appearance]);
  return { sceneRef, canvasRef };
}
