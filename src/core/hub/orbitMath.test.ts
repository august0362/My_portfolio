import { expect, test } from 'vitest';
import { cardPosition, nearestAngle, TAU, WORLD_STEP } from './orbitMath';

test('only the rear hemisphere blurs and fragments; the front stays crisp', () => {
  const front = cardPosition(0, 400, 140);
  const back = cardPosition(Math.PI, 400, 140);
  expect(front).toMatchObject({ x: 0, y: 140, scale: 1, blur: 0, fragments: 0 });
  expect(front.yaw).toBeCloseTo(0);
  expect(back.depth).toBe(0);
  expect(back.blur).toBeGreaterThan(0);
  expect(back.fragments).toBe(1);
  expect(back.scale).toBeLessThan(front.scale);
  expect(cardPosition(Math.PI / 2, 400, 140).yaw).not.toBe(0);
});

test('a full revolution preserves all five positions and front selection takes the shortest turn', () => {
  for (let index = 0; index < 5; index++) {
    const angle = index * WORLD_STEP;
    expect(cardPosition(angle + TAU, 400, 140).x).toBeCloseTo(cardPosition(angle, 400, 140).x);
    const target = nearestAngle(18 * TAU + 0.1, -angle);
    expect(Math.abs(target - (18 * TAU + 0.1))).toBeLessThanOrEqual(Math.PI);
    expect(cardPosition(target + angle, 400, 140).depth).toBeCloseTo(1);
  }
});
