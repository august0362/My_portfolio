// Two crossed orbit rings around the hero portrait, modelled as real 3D circles and projected to the
// portrait's 300×400 viewBox. Space follows CSS: x right, y down, z toward the viewer, origin at the
// portrait's centre. Each ring is tipped back (`tilt`, about x) and turned (`roll`, about z), so its
// lower half passes in front of the portrait and its upper half behind it.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Ring {
  radius: number;
  /** Tip back about the x axis, radians. */
  tilt: number;
  /** Turn about the view axis, radians. Opposite signs make the rings cross. */
  roll: number;
}

/** Portrait centre in viewBox units; also the CSS perspective origin of the portrait. */
export const CENTER = { x: 150, y: 200 };
/** Half the portrait box, plus the offset outline arch (about 15 units). */
export const BOARD_HALF = { x: 165, y: 215 };

export const RINGS: readonly Ring[] = [
  { radius: 218, tilt: 1.13, roll: 0.42 },
  { radius: 238, tilt: 1.13, roll: -0.42 },
];

/** View rotation per unit of sensor tilt, radians. Shared with the CSS that turns the portrait. */
export const VIEW_TILT = { x: (9 * Math.PI) / 180, y: (12 * Math.PI) / 180 };
export const PERSPECTIVE_PX = 1100;

/** Point at angle `t` on the ring, in portrait space. `z > 0` is in front of the portrait. */
export function ringPoint(ring: Ring, t: number, roll = ring.roll): Vec3 {
  const x0 = ring.radius * Math.cos(t);
  const y0 = ring.radius * Math.sin(t);
  const y1 = y0 * Math.cos(ring.tilt);
  const z = y0 * Math.sin(ring.tilt);
  return {
    x: x0 * Math.cos(roll) - y1 * Math.sin(roll),
    y: x0 * Math.sin(roll) + y1 * Math.cos(roll),
    z,
  };
}

/**
 * Projects a portrait-space point the way CSS renders `perspective(d) rotateX(ax) rotateY(ay)` around
 * the portrait centre, so the rings and the tilting portrait stay in one space. `s` is the depth scale.
 */
export function project(p: Vec3, ax: number, ay: number, d: number) {
  const x1 = p.x * Math.cos(ay) + p.z * Math.sin(ay);
  const z1 = -p.x * Math.sin(ay) + p.z * Math.cos(ay);
  const y2 = p.y * Math.cos(ax) - z1 * Math.sin(ax);
  const z2 = p.y * Math.sin(ax) + z1 * Math.cos(ax);
  const s = d / (d - z2);
  return { x: CENTER.x + x1 * s, y: CENTER.y + y2 * s, s };
}
