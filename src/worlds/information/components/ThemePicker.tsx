import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { allThemes, type Mode, type Theme } from '../theme';
import styles from './ThemePicker.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/** Four evenly spaced palette colors as a pie swatch. */
function swatch(theme: Theme): CSSProperties {
  const p = theme.palette;
  const pick = [0, 1, 2, 3].map((i) => p[Math.round((i * (p.length - 1)) / 3)]);
  return {
    '--swatch': `conic-gradient(from -45deg, ${pick[0]} 0 25%, ${pick[1]} 0 50%, ${pick[2]} 0 75%, ${pick[3]} 0)`,
  } as CSSProperties;
}

function SunMoon({ mode }: { mode: Mode }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {mode === 'dark' ? (
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </>
      )}
    </svg>
  );
}

interface Props {
  current: Theme;
  /** Omitted when SHOW_THEME_PICKER is false. */
  onChange?: (no: number) => void;
  /** Omitted when SHOW_MODE_TOGGLE is false. */
  onModeChange?: (mode: Mode) => void;
}

/** Visitor-facing appearance controls: numbered color themes and the site's light/dark mode. */
export default function ThemePicker({ current, onChange, onModeChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const dark = current.mode === 'dark';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className={styles.picker} data-open={open || undefined}>
      {onChange && (
        <div id={panelId} className={styles.panel} role="group" aria-label="Color themes" hidden={!open}>
          <p className={styles.heading}>
            <span className={styles.kicker}>Theme {pad(current.no)}</span>
            <span className={styles.name}>{current.name}</span>
          </p>

          <ul className={styles.list}>
            {allThemes.map((t) => (
              <li key={t.no}>
                <button
                  type="button"
                  className={styles.option}
                  style={swatch(t)}
                  aria-pressed={t.no === current.no}
                  aria-label={`Theme ${pad(t.no)} · ${t.name}`}
                  title={`${pad(t.no)} · ${t.name}`}
                  onClick={() => onChange(t.no)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.no} aria-hidden="true">{pad(t.no)}</span>
                </button>
              </li>
            ))}
          </ul>

          <ul className={styles.palette} aria-label={`${current.name} palette`}>
            {current.palette.map((c) => (
              <li key={c} className={styles.chip} style={{ '--chip': c } as CSSProperties}>
                <span className={styles.chipColor} aria-hidden="true" />
                <span className={styles.hex}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.bar}>
        {onChange && (
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            style={swatch(current)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`Color theme: ${pad(current.no)} · ${current.name}`}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.toggleLabel} aria-hidden="true">
              {pad(current.no)}
            </span>
          </button>
        )}

        {onModeChange && (
          <button
            type="button"
            className={styles.mode}
            aria-pressed={dark}
            aria-label="Dark mode"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => onModeChange(dark ? 'light' : 'dark')}
          >
            <SunMoon mode={current.mode} />
          </button>
        )}
      </div>
    </div>
  );
}
