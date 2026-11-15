export const TAU = Math.PI * 2;
export const WORLD_STEP = TAU / 5;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function nearestAngle(current: number, target: number) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

export function cardPosition(angle: number, radius: number, vertical: number) {
  const depth = (Math.cos(angle) + 1) / 2;
  return {
    x: Math.sin(angle) * radius,
    y: Math.cos(angle) * vertical,
    depth,
    scale: 0.65 + depth * 0.35,
    yaw: -Math.sin(angle) * 27,
    blur: Math.max(0, 0.48 - depth) * 4,
    fragments: clamp((0.48 - depth) / 0.48, 0, 1),
  };
}
