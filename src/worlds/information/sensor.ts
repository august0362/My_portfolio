import { useEffect, type RefObject } from 'react';

/**
 * One shared tilt signal, -1…1 on both axes, from the device's motion sensor (phones and tablets) or
 * the pointer position in the viewport (desktop). Smoothed on one rAF loop that sleeps once settled.
 * x > 0: pointer right / device tilted right. y > 0: pointer low / device tilted toward the viewer.
 */
export interface Tilt {
  x: number;
  y: number;
}

const RANGE = 22; // degrees of device tilt that reach ±1
const EASE = 0.075;
const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);

const tilt: Tilt = { x: 0, y: 0 };
const target: Tilt = { x: 0, y: 0 };
const listeners = new Set<(t: Tilt) => void>();
let frame = 0;
let usingDevice = false;
let base: { beta: number; gamma: number } | null = null;

function step() {
  frame = 0;
  tilt.x += (target.x - tilt.x) * EASE;
  tilt.y += (target.y - tilt.y) * EASE;
  const settled = Math.abs(target.x - tilt.x) < 1e-4 && Math.abs(target.y - tilt.y) < 1e-4;
  if (settled) {
    tilt.x = target.x;
    tilt.y = target.y;
  }
  listeners.forEach((fn) => fn(tilt));
  if (!settled) frame = requestAnimationFrame(step);
}

const wake = () => {
  if (!frame && listeners.size) frame = requestAnimationFrame(step);
};

function onPointer(e: PointerEvent) {
  if (usingDevice || e.pointerType !== 'mouse') return;
  target.x = clamp((e.clientX / window.innerWidth) * 2 - 1);
  target.y = clamp((e.clientY / window.innerHeight) * 2 - 1);
  wake();
}

function onLeave() {
  if (usingDevice) return;
  target.x = 0;
  target.y = 0;
  wake();
}

function onOrientation(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return;
  usingDevice = true;
  // Relative to how the device is being held: the neutral pose follows slowly, so only movement counts.
  base ??= { beta: e.beta, gamma: e.gamma };
  base.beta += (e.beta - base.beta) * 0.01;
  base.gamma += (e.gamma - base.gamma) * 0.01;
  target.x = clamp((e.gamma - base.gamma) / RANGE);
  target.y = clamp((e.beta - base.beta) / RANGE);
  wake();
}

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

/** iOS only reports orientation after a permission prompt, which must come from a tap. */
function askOnFirstTap() {
  const Ctor = (window as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
  if (!Ctor?.requestPermission) return () => {};
  const ask = () => {
    window.removeEventListener('touchend', ask);
    Ctor.requestPermission?.().catch(() => {});
  };
  window.addEventListener('touchend', ask, { once: true, passive: true });
  return () => window.removeEventListener('touchend', ask);
}

let stopSources: (() => void) | null = null;

function startSources() {
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('deviceorientation', onOrientation);
  const stopAsking = askOnFirstTap();
  return () => {
    window.removeEventListener('pointermove', onPointer);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('deviceorientation', onOrientation);
    stopAsking();
    cancelAnimationFrame(frame);
    frame = 0;
    usingDevice = false;
    base = null;
    tilt.x = tilt.y = target.x = target.y = 0;
  };
}

/** Calls `fn` with the smoothed tilt whenever it changes. Returns the unsubscribe function. */
export function subscribeTilt(fn: (t: Tilt) => void) {
  listeners.add(fn);
  stopSources ??= startSources();
  fn(tilt);
  return () => {
    listeners.delete(fn);
    if (!listeners.size && stopSources) {
      stopSources();
      stopSources = null;
    }
  };
}

/** Current smoothed tilt, for animation loops that already run every frame. */
export const readTilt = (): Readonly<Tilt> => tilt;

/** Writes the tilt to `--tx`/`--ty` on the element (CSS turns them into rotation or offset). */
export function useTiltVars(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const off = subscribeTilt((t) => {
      el.style.setProperty('--tx', t.x.toFixed(4));
      el.style.setProperty('--ty', t.y.toFixed(4));
    });
    return () => {
      off();
      el.style.removeProperty('--tx');
      el.style.removeProperty('--ty');
    };
  }, [ref, enabled]);
}
