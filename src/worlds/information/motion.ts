import { useEffect, type CSSProperties, type DependencyList, type RefObject } from 'react';
import { useSettings } from '@shared/settings';

/** True when motion should be static. Core settings own this (P-13: always full, the system setting is ignored). */
export function useReducedMotion(): boolean {
  return useSettings().settings.motion === 'reduced';
}

/** Marks `[data-reveal]` descendants with `data-revealed` once they enter the viewport. CSS does the rest. */
export function useReveal(ref: RefObject<HTMLElement | null>, deps: DependencyList = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => (el.dataset.revealed = ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = '';
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // Deps are caller-controlled (e.g. re-observe after an album switch).
  }, deps);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Writes scroll progress to `[data-scroll]` descendants as CSS variables:
 * `--p` 0→1 while the element crosses the viewport, `--c` 0→1 while the viewport center passes through it.
 * One passive listener, rAF-throttled, only on scroll/resize.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
        el.style.setProperty('--p', clamp01((vh - r.top) / (vh + r.height)).toFixed(4));
        el.style.setProperty('--c', clamp01((vh * 0.55 - r.top) / Math.max(r.height, 1)).toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      for (const el of els) {
        el.style.removeProperty('--p');
        el.style.removeProperty('--c');
      }
    };
  }, [ref, enabled]);
}

/** Inline style helper for staggered reveals. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
