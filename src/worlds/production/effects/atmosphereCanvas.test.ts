import { expect, test } from 'vitest';
import { addWaterPulse, createAtmosphere, pruneWaterPulses, scheduleAmbientRipples } from './atmosphereCanvas';

test('atmospheric points stay in a common normalized space for each quality tier', () => {
  for (const count of [80, 150]) {
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

test('the floor ripples on its own at a calm, bounded pace', () => {
  const field = createAtmosphere();
  let ripples = 0;
  for (let time = 0; time < 60; time += 1 / 60) {
    const before = field.nextRipple;
    scheduleAmbientRipples(field, time);
    if (field.nextRipple !== before) ripples++;
    pruneWaterPulses(field, time);
    expect(field.pulses.length).toBeLessThanOrEqual(6);
  }
  expect(ripples).toBeGreaterThan(10);
  expect(ripples).toBeLessThan(30);
  for (const pulse of field.pulses) {
    expect(pulse.ambient).toBe(true);
    expect(pulse.y).toBeGreaterThanOrEqual(.76);
  }
});

test('embers scale with the quality tier', () => {
  expect(createAtmosphere(150).embers).toHaveLength(30);
  expect(createAtmosphere(80).embers).toHaveLength(16);
});
