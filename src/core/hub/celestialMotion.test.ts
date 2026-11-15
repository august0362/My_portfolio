import { expect, test } from 'vitest';
import { advanceLightField, createLightField, rayOrbit, releaseRay } from './celestialMotion';

test('a dragged ray wanders, returns to its moving orbit, and bounds its trail', () => {
  const field = createLightField(), ray = field.rays[0];
  advanceLightField(field, 0, 1 / 60, 1000, 800);
  ray.held = true; ray.x = 140; ray.y = 180;
  advanceLightField(field, 0.1, 1 / 60, 1000, 800);
  expect(ray.x).toBe(140);
  releaseRay(ray, 0.1);
  for (let frame = 7; frame < 150; frame++) advanceLightField(field, frame / 60, 1 / 60, 1000, 800);
  expect(Math.abs(ray.offsetX)).toBeGreaterThan(50);
  for (let frame = 150; frame <= 600; frame++) advanceLightField(field, frame / 60, 1 / 60, 1000, 800);
  const orbit = rayOrbit(0, 10, 1000, 800);
  expect(Math.hypot(ray.x - orbit.x, ray.y - orbit.y)).toBeLessThan(0.1);
  expect(ray.trail.length).toBeLessThanOrEqual(22);
});

test('cancelled drags return immediately and expired pointer effects are released', () => {
  const field = createLightField(), ray = field.rays[0];
  ray.held = true; ray.x = -400; ray.y = 2000;
  field.pointer.active = true;
  advanceLightField(field, 0, 1 / 60, 375, 870);
  expect(ray.x).toBe(24); expect(ray.y).toBe(846);
  releaseRay(ray, 0, true);
  field.pointer.active = false;
  field.pointer.trail.push({ x: 10, y: 10, time: 0 }); field.ripples.push({ x: 10, y: 10, time: 0 });
  advanceLightField(field, 3, 0.05, 375, 870);
  expect(field.pointer.trail).toHaveLength(0); expect(field.ripples).toHaveLength(0);
  expect(ray.held).toBe(false);
});
