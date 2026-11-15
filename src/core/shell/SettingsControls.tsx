import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useSettings } from '@shared/settings';
import type { AudioStatus } from './useCelestialAudio';
import styles from './SettingsControls.module.css';

const palettes = [
  { id: 'moonlit', name: 'Moonlit', note: 'Lavender & gold', colors: ['#403754', '#b9a8da', '#e1c9a1'] },
  { id: 'rosewater', name: 'Rosewater', note: 'Rose & champagne', colors: ['#6a3f5b', '#d6a0ba', '#f0d4ba'] },
  { id: 'tidal', name: 'Tidal', note: 'Sea glass & pearl', colors: ['#2e5360', '#9bc6ca', '#e4d3af'] },
] as const;

function Sun({ moon = false }: { moon?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">{moon ? <path d="M20 14A8 8 0 0 1 10 4a8.3 8.3 0 1 0 10 10Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}</svg>;
}

export default function SettingsControls({ audioStatus = 'ready' }: { audioStatus?: AudioStatus }) {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.atmosphere}>
      <button ref={triggerRef} type="button" className={styles.trigger} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <span className={styles.triggerStar} aria-hidden="true">✧</span> Atmosphere <span className={styles.triggerDot} aria-hidden="true" />
      </button>
      <section id={panelId} className={styles.panel} aria-label="Appearance settings" hidden={!open}>
        <div className={styles.heading}>
          <div><span className={styles.eyebrow}>A space of your own</span><h2>Your atmosphere</h2></div>
          <button type="button" className={styles.close} aria-label="Close appearance settings" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>×</button>
        </div>
        <p className={styles.description}>Find the light that feels like you.</p>
        <fieldset className={styles.section}>
          <legend>Light & shade</legend>
          <div className={styles.modes}>
            <button type="button" aria-label="Light appearance" aria-pressed={settings.appearance === 'light'} onClick={() => setSettings(current => ({ ...current, appearance: 'light' }))}><Sun /><span>Daylight</span></button>
            <button type="button" aria-label="Dark appearance" aria-pressed={settings.appearance === 'dark'} onClick={() => setSettings(current => ({ ...current, appearance: 'dark' }))}><Sun moon /><span>Midnight</span></button>
          </div>
        </fieldset>
        <fieldset className={styles.section}>
          <legend>Color story</legend>
          <div className={styles.palettes}>
            {palettes.map(palette => <button
              key={palette.id} type="button" className={styles.palette}
              aria-label={`${palette.name} palette`} aria-pressed={settings.palette === palette.id}
              style={{ '--swatch-a': palette.colors[0], '--swatch-b': palette.colors[1], '--swatch-c': palette.colors[2] } as CSSProperties}
              onClick={() => setSettings(current => ({ ...current, palette: palette.id }))}
            >
              <span className={styles.paletteArt} aria-hidden="true"><i /><i /><span>✧</span><b>✓</b></span>
              <span className={styles.paletteName}>{palette.name}</span>
              <span className={styles.paletteNote}>{palette.note}</span>
            </button>)}
          </div>
        </fieldset>
        <div className={styles.status}>
          <span className={styles.sound} data-playing={audioStatus === 'playing'}><span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>{audioStatus === 'playing' ? 'Sound on' : audioStatus === 'ready' ? 'Sound ready' : 'Audio unavailable'}</span>
          <span className={styles.detail}><span aria-hidden="true">✦</span> Maximum detail</span>
        </div>
      </section>
    </div>
  );
}
