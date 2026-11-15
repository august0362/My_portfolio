import { useEffect, useRef } from 'react';
import { useSettings } from '@shared/settings';

export default function useSceneAtmosphere() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const surface = scene.closest<HTMLElement>('[data-scene-interaction]') ?? scene;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true, active = false, frame = 0, previousTime = 0, disposed = false;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const write = () => { scene.style.setProperty('--sensor-x', x.toFixed(4)); scene.style.setProperty('--sensor-y', y.toFixed(4)); };
    const updateActivity = () => {
      const motion = settings.motion === 'full' && settings.quality !== 'static' && !media.matches;
      active = motion && visible && !document.hidden;
      scene.dataset.motion = String(motion); scene.dataset.active = String(active);
      if (!active) { cancelAnimationFrame(frame); frame = 0; x = y = targetX = targetY = 0; write(); }
    };
    const tick = (time: number) => {
      if (!active || disposed) { frame = 0; return; }
      const delta = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000 || 0.016));
      previousTime = time;
      const smoothing = 1 - Math.exp(-7 * delta);
      x += (targetX - x) * smoothing; y += (targetY - y) * smoothing;
      write();
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const schedule = () => { if (active && !frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); } };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerType !== 'mouse') return;
      const rect = surface.getBoundingClientRect();
      targetX = event.buttons ? 0 : Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      targetY = event.buttons ? 0 : Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      schedule();
    };
    const leave = () => { targetX = targetY = 0; schedule(); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      if (disposed) return;
      visible = entries[0]?.isIntersecting ?? false; updateActivity();
    }, { threshold: 0 }) : undefined;
    observer?.observe(surface);
    updateActivity();
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', updateActivity);
    media.addEventListener('change', updateActivity);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect();
      surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave); document.removeEventListener('visibilitychange', updateActivity); media.removeEventListener('change', updateActivity);
    };
  }, [settings.motion, settings.quality]);
  return sceneRef;
}
