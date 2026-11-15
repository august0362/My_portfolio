import type { CSSProperties, ReactNode } from 'react';
import { delay } from '../motion';
import styles from './Celestial.module.css';

/* Hand-drawn style celestial line art: sparkles, a crescent with an orbit, a ringed planet
   and corner brackets. Original geometry; decorative only (always aria-hidden). */

const f = (n: number) => +n.toFixed(2);

/** Four-point sparkle with concave sides, centered on (cx, cy). */
export function sparklePath(cx: number, cy: number, r: number, waist = 0.12): string {
  const w = r * waist;
  return (
    `M${f(cx)} ${f(cy - r)}` +
    ` Q${f(cx + w)} ${f(cy - w)} ${f(cx + r)} ${f(cy)}` +
    ` Q${f(cx + w)} ${f(cy + w)} ${f(cx)} ${f(cy + r)}` +
    ` Q${f(cx - w)} ${f(cy + w)} ${f(cx - r)} ${f(cy)}` +
    ` Q${f(cx - w)} ${f(cy - w)} ${f(cx)} ${f(cy - r)}Z`
  );
}

/** Point on an ellipse centered on (cx, cy), rotated by `rot` degrees, at angle `deg`. */
function ellipsePoint(cx: number, cy: number, rx: number, ry: number, rot: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  const p = (rot * Math.PI) / 180;
  const x = rx * Math.cos(t);
  const y = ry * Math.sin(t);
  return [f(cx + x * Math.cos(p) - y * Math.sin(p)), f(cy + x * Math.sin(p) + y * Math.cos(p))];
}

/** Outer disc (cx, cy, r) minus an inner disc offset by (ox, oy) with radius r2. */
function crescentPath(cx: number, cy: number, r: number, ox: number, oy: number, r2: number): string {
  const d = Math.hypot(ox, oy);
  const [ux, uy] = [ox / d, oy / d];
  const a = (r * r - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r * r - a * a);
  const [px, py] = [cx + a * ux, cy + a * uy];
  const A = [f(px - h * uy), f(py + h * ux)];
  const B = [f(px + h * uy), f(py - h * ux)];
  const innerLarge = a > d ? 1 : 0;
  return `M${A[0]} ${A[1]} A${r} ${r} 0 1 1 ${B[0]} ${B[1]} A${r2} ${r2} 0 ${innerLarge} 0 ${A[0]} ${A[1]}Z`;
}

/** Elliptical arc from angle `from` down to `to` (degrees; 90 is the front, 270 the back). */
function ellipseArc(cx: number, cy: number, rx: number, ry: number, rot: number, from: number, to: number): string {
  const [x1, y1] = ellipsePoint(cx, cy, rx, ry, rot, from);
  const [x2, y2] = ellipsePoint(cx, cy, rx, ry, rot, to);
  return `M${x1} ${y1} A${rx} ${ry} ${rot} ${from - to > 180 ? 1 : 0} 0 ${x2} ${y2}`;
}

export function Sparkle({ x, y, r, i = 0 }: { x: number; y: number; r: number; i?: number }) {
  return <path className={styles.spark} d={sparklePath(x, y, r)} style={{ '--i': i } as CSSProperties} />;
}

/** Small accent dot or hollow ring that fades in with the sparkles. */
export function Dot({ x, y, r, hollow, i = 0 }: { x: number; y: number; r: number; hollow?: boolean; i?: number }) {
  return (
    <circle
      className={hollow ? styles.ringDot : styles.dot}
      cx={x}
      cy={y}
      r={r}
      style={{ '--i': i } as CSSProperties}
    />
  );
}

interface OrnamentProps {
  viewBox: string;
  className?: string;
  wait?: number;
  children: ReactNode;
}

/** Self-drawing SVG wrapper: strokes draw in, then sparkles pop and twinkle. */
export function Ornament({ viewBox, className, wait = 300, children }: OrnamentProps) {
  return (
    <svg
      className={`${styles.ornament} ${className ?? ''}`}
      viewBox={viewBox}
      aria-hidden="true"
      data-reveal="draw"
      style={delay(wait)}
    >
      {children}
    </svg>
  );
}

/* ---------- Compositions ---------- */

const MOON = crescentPath(120, 82, 44, 19, -13, 39);
const MOON_RING = ellipseArc(120, 86, 104, 22, -12, 186, -16);
const MOON_TRAIL = [194, 201, 208, 215].map((deg) => ellipsePoint(120, 86, 104, 22, -12, deg));

/** Closing mark: crescent moon wrapped by an open orbit, a sparkle in its hollow. */
export function CrescentMark({ className, wait }: { className?: string; wait?: number }) {
  return (
    <Ornament viewBox="0 0 240 150" className={`${styles.mark} ${className ?? ''}`} wait={wait}>
      <path className={styles.moon} d={MOON} pathLength="1" />
      <path d={MOON_RING} pathLength="1" />
      {MOON_TRAIL.map(([x, y], i) => (
        <Dot key={i} x={x} y={y} r={1.3} i={i} />
      ))}
      <Sparkle x={139} y={70} r={17} i={0} />
      <Sparkle x={204} y={38} r={7} i={2} />
      <Sparkle x={186} y={22} r={3.5} i={4} />
      <Dot x={219} y={20} r={2.4} hollow i={3} />
    </Ornament>
  );
}

const PLANET_BACK = ellipseArc(110, 70, 78, 16, -14, 360, 180);
const PLANET_FRONT = ellipseArc(110, 70, 78, 16, -14, 180, 0);

/** Ringed planet: the back half of the ring passes behind the disc. */
export function RingedPlanet({ className, wait }: { className?: string; wait?: number }) {
  return (
    <Ornament viewBox="0 0 230 140" className={className} wait={wait}>
      <path d={PLANET_BACK} pathLength="1" />
      <circle className={styles.planet} cx={110} cy={70} r={30} />
      <path d="M110 40 A30 30 0 1 1 109.99 40" pathLength="1" />
      <path d={PLANET_FRONT} pathLength="1" />
      <Sparkle x={196} y={26} r={12} i={0} />
      <Sparkle x={28} y={118} r={8} i={2} />
      <Dot x={176} y={112} r={2.4} hollow i={1} />
      <Dot x={50} y={30} r={1.6} i={3} />
    </Ornament>
  );
}

/** Corner bracket: a dot, a hairline that turns a rounded corner, and a sparkle at its end. */
export function CornerBracket({ className, wait }: { className?: string; wait?: number }) {
  return (
    <Ornament viewBox="0 0 230 150" className={className} wait={wait}>
      <path d="M40 18 H178 Q194 18 194 34 V124" pathLength="1" />
      <path d="M8 150 Q70 96 150 84" pathLength="1" />
      <Dot x={40} y={18} r={3.2} i={0} />
      <Sparkle x={194} y={134} r={12} i={1} />
      <Sparkle x={158} y={82} r={9} i={2} />
      <Dot x={120} y={52} r={1.6} i={3} />
    </Ornament>
  );
}

/** Sweeping arc that meets a sparkle, with a scatter of small stars. */
export function ArcSparkle({ className, wait }: { className?: string; wait?: number }) {
  return (
    <Ornament viewBox="0 0 230 150" className={className} wait={wait}>
      <path d="M12 140 C60 70 120 40 196 34" pathLength="1" />
      <path d="M150 140 H206 Q218 140 218 128 V96" pathLength="1" />
      <Sparkle x={204} y={34} r={12} i={0} />
      <Sparkle x={218} y={88} r={6} i={2} />
      <Dot x={150} y={140} r={3} i={1} />
      <Sparkle x={92} y={30} r={4} i={3} />
      <Dot x={60} y={58} r={2} hollow i={4} />
    </Ornament>
  );
}

/** Class that pins an ornament to the top-right of a section header. */
export const CORNER = styles.corner;
