import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import type { Mood, Scheme } from '../theme';
import styles from './Ambient.module.css';
import { sparklePath } from './celestial';

/** Per-mood particle character. dx/dy are drift ranges in px. */
const MOTES: Record<Mood, { count: number; size: [number, number]; dx: [number, number]; dy: [number, number]; seed: number }> = {
  dawn: { count: 22, size: [2, 6], dx: [-20, 20], dy: [-90, -40], seed: 11 },
  night: { count: 46, size: [1, 3], dx: [-6, 6], dy: [-10, 10], seed: 23 },
  shore: { count: 30, size: [2, 5], dx: [30, 70], dy: [-14, 14], seed: 37 },
  breath: { count: 20, size: [2, 4], dx: [-24, 24], dy: [30, 70], seed: 41 },
  dusk: { count: 34, size: [1, 3], dx: [-10, 10], dy: [-30, -10], seed: 53 },
};

/** Four-point sparkles scattered over every section. */
const SPARKS = 6;
const SPARK = sparklePath(0, 0, 1);

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (r: () => number, [min, max]: [number, number]) => min + r() * (max - min);

/** Periodic wave path: period 600 over 2400 wide, so translating -50% loops seamlessly. */
function wavePath(y: number, amp: number, phase: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 2400; x += 40) {
    d += ` L${x} ${(y + Math.sin((x / 600) * Math.PI * 2 + phase) * amp).toFixed(1)}`;
  }
  return d;
}

interface Props {
  mood: Mood;
  tone: Scheme['tone'];
  waves?: boolean;
}

/** Decorative background: drifting light fields, particles and optional waves. CSS-only animation. */
export default function Ambient({ mood, tone, waves = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = MOTES[mood];

  const motes = useMemo(() => {
    const r = rng(cfg.seed);
    return Array.from({ length: cfg.count }, () => ({
      '--x': `${(r() * 100).toFixed(2)}%`,
      '--y': `${(r() * 100).toFixed(2)}%`,
      '--s': `${between(r, cfg.size).toFixed(1)}px`,
      '--o': (0.35 + r() * 0.6).toFixed(2),
      '--dx': `${between(r, cfg.dx).toFixed(0)}px`,
      '--dy': `${between(r, cfg.dy).toFixed(0)}px`,
      '--t1': `${(3 + r() * 5).toFixed(1)}s`,
      '--t2': `${(9 + r() * 12).toFixed(1)}s`,
      '--delay': `${(-r() * 12).toFixed(1)}s`,
    }) as CSSProperties);
  }, [cfg]);

  const sparks = useMemo(() => {
    const r = rng(cfg.seed * 7);
    return Array.from({ length: SPARKS }, () => ({
      '--x': `${(4 + r() * 92).toFixed(2)}%`,
      '--y': `${(8 + r() * 84).toFixed(2)}%`,
      '--s': `${(9 + r() * 13).toFixed(1)}px`,
      '--t1': `${(4 + r() * 4).toFixed(1)}s`,
      '--delay': `${(-r() * 8).toFixed(1)}s`,
    }) as CSSProperties);
  }, [cfg]);

  // Pause all ambient animation while offscreen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.dataset.active = '';
      else delete el.dataset.active;
    }, { rootMargin: '15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.ambient} data-mood={mood} data-tone={tone} aria-hidden="true">
      <span className={`${styles.field} ${styles.fieldA}`} />
      <span className={`${styles.field} ${styles.fieldB}`} />
      <span className={`${styles.field} ${styles.fieldC}`} />
      {waves && (
        <svg className={styles.waves} viewBox="0 0 2400 300" preserveAspectRatio="none">
          <path d={wavePath(90, 18, 0)} />
          <path d={wavePath(160, 26, 1.7)} />
          <path d={wavePath(230, 14, 3.4)} />
        </svg>
      )}
      <div className={styles.motes}>
        {motes.map((style, i) => (
          <span key={i} className={styles.mote} style={style} />
        ))}
        {sparks.map((style, i) => (
          <svg key={i} className={styles.spark} viewBox="-1 -1 2 2" style={style}>
            <path d={SPARK} />
          </svg>
        ))}
      </div>
    </div>
  );
}
