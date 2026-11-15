import { afterEach, expect, test, vi } from 'vitest';
import useSceneAtmosphere from './useSceneAtmosphere';

const state = vi.hoisted(() => ({
  refs: [] as unknown[],
  effects: [] as (() => void | (() => void))[],
  settings: { motion: 'full', quality: 'full' },
}));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useRef: () => ({ current: state.refs.shift() }),
  useEffect: (effect: () => void | (() => void)) => { state.effects.push(effect); },
}));
vi.mock('@shared/settings', () => ({ useSettings: () => ({ settings: state.settings }) }));

let cleanup: void | (() => void);
afterEach(() => { cleanup?.(); cleanup = undefined; state.effects.length = 0; state.refs.length = 0; vi.unstubAllGlobals(); });

function setup(options: { reduced?: boolean; quality?: string; canvas?: boolean } = {}) {
  const surface = new EventTarget();
  Object.assign(surface, { dataset: {} as Record<string, string>, style: { setProperty: vi.fn(), removeProperty: vi.fn() } });
  const scene = Object.assign(new EventTarget(), {
    dataset: {} as Record<string, string>, clientWidth: 1600, clientHeight: 900,
    style: { setProperty: vi.fn() }, closest: () => surface,
  });
  const gradient = { addColorStop: vi.fn() };
  const context = Object.fromEntries(['clearRect', 'setTransform', 'beginPath', 'arc', 'fill', 'moveTo', 'lineTo', 'stroke', 'ellipse'].map(method => [method, vi.fn()]));
  Object.assign(context, { createRadialGradient: () => gradient, createLinearGradient: () => gradient });
  const canvas = { width: 0, height: 0, getContext: () => options.canvas === false ? null : context };
  const media = Object.assign(new EventTarget(), { matches: options.reduced ?? false });
  const document = Object.assign(new EventTarget(), { hidden: false });
  const window = Object.assign(new EventTarget(), { devicePixelRatio: 3, matchMedia: () => media });
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  const disconnect = vi.fn();
  const observers: ((entries: { isIntersecting: boolean }[]) => void)[] = [];
  vi.stubGlobal('document', document); vi.stubGlobal('window', window); vi.stubGlobal('innerHeight', 900);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; });
  vi.stubGlobal('cancelAnimationFrame', (frame: number) => { frames.delete(frame); });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect = disconnect; });
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) { observers.push(callback); }
    observe() {} disconnect = disconnect;
  });
  state.settings = { motion: 'full', quality: options.quality ?? 'full' };
  state.refs.push(scene, canvas);
  useSceneAtmosphere();
  cleanup = state.effects.pop()?.();
  const tick = () => { const pending = [...frames]; frames.clear(); pending.forEach(([, callback]) => callback(performance.now() + 16)); };
  return { scene, surface: surface as typeof surface & { dataset: Record<string, string> }, canvas, context, frames, tick, media, document, disconnect, observers };
}

test('one bounded animation loop pauses on visibility / intersection and releases resources', () => {
  const env = setup();
  expect(env.canvas.width).toBe(2200);
  expect(env.frames.size).toBe(1);
  env.tick(); expect(env.frames.size).toBe(1);
  expect(env.context.arc).toHaveBeenCalled();
  env.document.hidden = true; env.document.dispatchEvent(new Event('visibilitychange'));
  expect(env.scene.dataset.active).toBe('false'); expect(env.frames.size).toBe(0);
  env.document.hidden = false; env.document.dispatchEvent(new Event('visibilitychange'));
  expect(env.frames.size).toBe(1);
  env.observers[0]([{ isIntersecting: false }]); expect(env.frames.size).toBe(0);
  env.observers[0]([{ isIntersecting: true }]); expect(env.frames.size).toBe(1);
  cleanup?.(); cleanup = undefined;
  expect(env.frames.size).toBe(0); expect(env.disconnect).toHaveBeenCalledTimes(2);
  env.document.dispatchEvent(new Event('visibilitychange'));
  env.observers[0]([{ isIntersecting: true }]);
  expect(env.frames.size).toBe(0);
});

test.each([{ reduced: true }, { quality: 'static' }])('static settings do not schedule ambient animation: %o', options => {
  const env = setup(options);
  expect(env.scene.dataset.motion).toBe('false'); expect(env.frames.size).toBe(0);
  expect(env.surface.dataset.sceneMotion).toBe('false');
});

test('live reduced motion and missing canvas both stop continuous frames', () => {
  const env = setup({ canvas: false });
  env.tick(); expect(env.frames.size).toBe(0);
  env.media.matches = true; env.media.dispatchEvent(new Event('change'));
  expect(env.scene.dataset.active).toBe('false');
  expect(env.frames.size).toBe(0);
});
