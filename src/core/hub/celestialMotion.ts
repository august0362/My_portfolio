import { clamp, TAU } from './orbitMath';

export const RAY_COUNT = 6;
export interface LightPoint { x: number; y: number; time: number }
export interface LightRay {
  id: number; x: number; y: number; offsetX: number; offsetY: number;
  held: boolean; initialized: boolean; releasedAt: number; flareUntil: number;
  wanderPhase: number;
  trail: LightPoint[];
}
export interface LightField {
  rays: LightRay[];
  pointer: { x: number; y: number; active: boolean; strength: number; trail: LightPoint[] };
  ripples: LightPoint[];
}

export function createLightField(): LightField {
  return {
    rays: Array.from({ length: RAY_COUNT }, (_, id) => ({ id, x: 0, y: 0, offsetX: 0, offsetY: 0, held: false, initialized: false, releasedAt: -100, flareUntil: 0, wanderPhase: id * 2.3, trail: [] })),
    pointer: { x: 0, y: 0, active: false, strength: 0, trail: [] }, ripples: [],
  };
}

export function rayOrbit(id: number, time: number, width: number, height: number) {
  const angle = time * (0.08 + id * 0.008) + id * TAU / RAY_COUNT + 0.4;
  return { x: width * (0.5 + Math.sin(angle) * (0.42 - id % 3 * 0.045)), y: height * (0.51 + Math.cos(angle) * (0.35 - id % 3 * 0.04)) };
}

export function releaseRay(ray: LightRay, time: number, cancelled = false) {
  ray.held = false;
  ray.releasedAt = cancelled ? time - 2.6 : time;
  ray.flareUntil = time + 1.1;
  ray.wanderPhase = Math.random() * TAU;
}

// The free drift lasts 2.6 seconds; exponential return never snaps to the track.
export function advanceLightField(field: LightField, time: number, dt: number, width: number, height: number, orbitTime = time) {
  field.pointer.strength += ((field.pointer.active ? 1 : 0) - field.pointer.strength) * (1 - Math.exp(-dt * 8));
  field.pointer.trail = field.pointer.trail.filter(point => time - point.time < 0.65);
  field.ripples = field.ripples.filter(point => time - point.time < 1.4);
  for (const ray of field.rays) {
    const orbit = rayOrbit(ray.id, orbitTime, width, height);
    if (!ray.initialized) {
      if (!ray.held) { ray.x = orbit.x; ray.y = orbit.y; }
      ray.initialized = true;
    }
    if (ray.held) {
      ray.x = clamp(ray.x, 24, width - 24); ray.y = clamp(ray.y, 24, height - 24);
      ray.offsetX = ray.x - orbit.x; ray.offsetY = ray.y - orbit.y;
    } else {
      const age = time - ray.releasedAt;
      if (age < 2.6) {
        const drift = Math.sin(Math.max(0, age) / 2.6 * Math.PI) * 28 * dt;
        ray.offsetX += Math.sin(time * 1.7 + ray.wanderPhase) * drift;
        ray.offsetY += Math.cos(time * 1.3 + ray.wanderPhase) * drift;
      } else {
        const decay = Math.exp(-dt * 2.3);
        ray.offsetX *= decay; ray.offsetY *= decay;
      }
      ray.x = clamp(orbit.x + ray.offsetX, 24, width - 24);
      ray.y = clamp(orbit.y + ray.offsetY, 24, height - 24);
    }
    const last = ray.trail.at(-1);
    if (!last || time - last.time > 0.035) ray.trail.push({ x: ray.x, y: ray.y, time });
    ray.trail = ray.trail.filter(point => time - point.time < 0.9).slice(-22);
  }
}
