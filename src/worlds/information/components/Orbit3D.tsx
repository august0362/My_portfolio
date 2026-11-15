import { useEffect, useRef, type ReactNode } from 'react';
import { delay } from '../motion';
import { readTilt } from '../sensor';
import styles from './Identity.module.css';
import { PERSPECTIVE_PX, project, RINGS, ringPoint, VIEW_TILT } from './orbit';

const SAMPLES = 160;
const TRAIL = 7; // fading points behind each moving point
const TRAIL_STEP = 0.045; // radians between trail points
const PERIODS = [6.5, -9.5]; // seconds per lap; negative runs the other way
const DRAW_MS = 2400;
const DRAW_DELAY_MS = 1100;
const TAU = Math.PI * 2;

// The rings draw themselves in JS; keep the stroke-dash reveal (meant for the sparkles' layer) off them.
const NO_DASH = { strokeDasharray: 'none' } as const;

const easeOut = (v: number) => 1 - (1 - v) ** 3;

/**
 * The portrait between two 3D orbit rings. Each ring is split by depth: the half behind the portrait
 * is drawn in a layer under it, the half in front in a layer over it, so the rings truly wrap the board.
 * The view turns with the shared tilt sensor, exactly like the CSS tilt of the portrait itself.
 */
export default function Orbit3D({ reduced, children, ornaments }: { reduced: boolean; children: ReactNode; ornaments: ReactNode }) {
  const backRef = useRef<SVGSVGElement>(null);
  const frontRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return;
    const layers = [back, front];
    const paths = layers.map((svg) => Array.from(svg.querySelectorAll<SVGPathElement>('[data-ring]')));
    const dots = layers.map((svg) => Array.from(svg.querySelectorAll<SVGCircleElement>('[data-dot]')));

    let unitsPerPx = 300 / Math.max(back.getBoundingClientRect().width, 1);
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) unitsPerPx = 300 / entry.contentRect.width;
    });
    ro.observe(back);

    const start = performance.now();
    let frame = 0;
    let visible = true;

    const render = (now: number) => {
      const t = readTilt();
      const ax = -t.y * VIEW_TILT.x;
      const ay = t.x * VIEW_TILT.y;
      const d = PERSPECTIVE_PX * unitsPerPx;
      const secs = (now - start) / 1000;
      const drawn = reduced ? 1 : easeOut(Math.min(Math.max((now - start - DRAW_DELAY_MS) / DRAW_MS, 0), 1));

      RINGS.forEach((ring, r) => {
        // A slow sway of the crossing angle keeps the rings alive without spinning the whole figure.
        const roll = ring.roll + (reduced ? 0 : Math.sin(secs * 0.21 + r * 2) * 0.05);
        const d0: string[] = [];
        const d1: string[] = [];
        let side = -1;
        const last = Math.round(SAMPLES * drawn);
        for (let i = 0; i <= last; i++) {
          const a = (i / SAMPLES) * TAU + (r ? Math.PI : 0); // the two rings draw in from opposite ends
          const p = ringPoint(ring, a, roll);
          const q = project(p, ax, ay, d);
          const s = p.z >= 0 ? 1 : 0;
          const xy = `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
          if (s !== side) {
            // Start a new run on this side, continuing from the previous point so there is no gap.
            const out = s ? d1 : d0;
            const prev = i > 0 ? project(ringPoint(ring, ((i - 1) / SAMPLES) * TAU + (r ? Math.PI : 0), roll), ax, ay, d) : q;
            out.push(`M${prev.x.toFixed(1)} ${prev.y.toFixed(1)}L${xy}`);
            side = s;
          } else {
            (s ? d1 : d0).push(`L${xy}`);
          }
        }
        paths[0][r]?.setAttribute('d', d0.join(''));
        paths[1][r]?.setAttribute('d', d1.join(''));

        // Moving point with a fading tail, placed in whichever layer its depth calls for.
        const head = reduced ? 0.9 + r * 2.4 : (secs / PERIODS[r]) * TAU;
        const dir = Math.sign(PERIODS[r]);
        for (let k = 0; k <= TRAIL; k++) {
          const a = head - dir * k * TRAIL_STEP;
          const p = ringPoint(ring, a, roll);
          const q = project(p, ax, ay, d);
          const fade = (1 - k / (TRAIL + 1)) ** 1.6;
          const shown = drawn >= 1 && (k === 0 || !reduced);
          const depth = 0.55 + 0.45 * ((p.z / ring.radius + 1) / 2); // dimmer when far behind
          const size = (k === 0 ? 3.4 - r * 0.8 : 2.2 - r * 0.4) * q.s * (1 - k * 0.07);
          for (let layer = 0; layer < 2; layer++) {
            const dot = dots[layer][r * (TRAIL + 1) + k];
            if (!dot) continue;
            const here = shown && (p.z >= 0 ? 1 : 0) === layer;
            dot.setAttribute('cx', q.x.toFixed(1));
            dot.setAttribute('cy', q.y.toFixed(1));
            dot.setAttribute('r', size.toFixed(2));
            dot.style.opacity = here ? (fade * depth).toFixed(3) : '0';
          }
        }
      });
    };

    const loop = (now: number) => {
      render(now);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    // Reduced motion: one static frame, redrawn only when the tilt sensor would move it (it is off then).
    if (reduced) {
      render(performance.now());
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    io.observe(back);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced]);

  const layer = (front: boolean) =>
    RINGS.flatMap((_, r) => [
      <path key={`p${r}`} data-ring className={r ? styles.ringOuter : undefined} style={NO_DASH} />,
      ...Array.from({ length: TRAIL + 1 }, (_, k) => (
        <circle key={`d${r}-${k}`} data-dot className={k ? styles.orbitTrail : styles.orbitDot} r="0" style={{ opacity: 0 }} />
      )),
    ]).concat(front ? [<g key="o">{ornaments}</g>] : []);

  return (
    <>
      <svg ref={backRef} className={`${styles.orbit} ${styles.orbitBack}`} viewBox="0 0 300 400" aria-hidden="true">
        {layer(false)}
      </svg>
      {children}
      <svg
        ref={frontRef}
        className={`${styles.orbit} ${styles.orbitFront}`}
        viewBox="0 0 300 400"
        aria-hidden="true"
        data-reveal="draw"
        style={delay(DRAW_DELAY_MS)}
      >
        {layer(true)}
      </svg>
    </>
  );
}
