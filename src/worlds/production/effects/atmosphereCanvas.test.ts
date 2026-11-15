import { expect, test } from 'vitest';
import { addWaterPulse, createAtmosphere, pruneWaterPulses } from './atmosphereCanvas';

test('atmospheric points stay in a common normalized space for each quality tier', () => {
  for (const count of [54, 96]) {
    const field = createAtmosphere(count);
    expect(field.motes).toHaveLength(count);
    for (const point of field.motes) {
      expect(point.x).toBeGreaterThanOrEqual(0); expect(point.x).toBeLessThan(1);
      expect(point.y).toBeGreaterThanOrEqual(0); expect(point.y).toBeLessThan(1);
    }
  }
});

test('rapid pointer input cannot grow the water field without bounds', () => {
  const field = createAtmosphere();
  for (let click = 0; click < 40; click++) addWaterPulse(field, -.5, 1.5, click * .01);
  expect(field.pulses).toHaveLength(6);
  expect(field.pulses.every(pulse => pulse.x === 0 && pulse.y === 1)).toBe(true);
  addWaterPulse(field, NaN, .5, 1);
  expect(field.pulses).toHaveLength(6);
  pruneWaterPulses(field, 2.2);
  expect(field.pulses).toHaveLength(0);
});
