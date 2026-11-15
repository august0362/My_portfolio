import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useCopy, type Localized } from '@shared/i18n';
import { LANGUAGES, useSettings, type Palette } from '@shared/settings';
import type { AudioStatus } from './useCelestialAudio';
import styles from './SettingsControls.module.css';

/** Swatches: [base, bloom, highlight] per appearance. Values come from the owner's moodboards (P-17). */
const palettes: readonly { id: Palette; name: string; note: Localized; dark: readonly string[]; light: readonly string[] }[] = [
  { id: 'iris', name: 'Iris', note: { en: 'Iris & lavender mist', vi: 'Diên vĩ & sương oải hương' }, dark: ['#1e2042', '#6f6d97', '#bacbfe'], light: ['#f4f3fa', '#c7c6df', '#6f6d97'] },
  { id: 'sakura', name: 'Sakura', note: { en: 'Cherry blossom & rosewood', vi: 'Anh đào & gỗ hồng' }, dark: ['#33202d', '#a77370', '#f4c9da'], light: ['#fdf4f6', '#f4c9da', '#c87377'] },
  { id: 'jade', name: 'Jade', note: { en: 'Jade silk & silver mint', vi: 'Lụa ngọc & bạc hà' }, dark: ['#133528', '#406250', '#bedbd3'], light: ['#f1f7f4', '#bedbd3', '#406250'] },
  { id: 'pearl', name: 'Pearl', note: { en: 'Pearl, nude & lilac sheen', vi: 'Ngọc trai & ánh tím nhạt' }, dark: ['#2a2322', '#8c7466', '#d4c4dc'], light: ['#f8f4f1', '#ddbda5', '#af9292'] },
  { id: 'lagoon', name: 'Lagoon', note: { en: 'Lagoon & melon pink', vi: 'Đầm xanh & hồng dưa' }, dark: ['#143238', '#6bb1ad', '#f0a9b4'], light: ['#f7f6ec', '#a7bcbd', '#e6748e'] },
];

const COPY = {
  trigger: { en: 'Atmosphere', vi: 'Không gian' },
  panel: { en: 'Appearance settings', vi: 'Cài đặt giao diện' },
  eyebrow: { en: 'A space of your own', vi: 'Không gian của riêng bạn' },
  title: { en: 'Your atmosphere', vi: 'Bầu không khí của bạn' },
  close: { en: 'Close appearance settings', vi: 'Đóng cài đặt giao diện' },
  description: { en: 'Find the light that feels like you.', vi: 'Tìm thứ ánh sáng hợp với bạn.' },
  shade: { en: 'Light & shade', vi: 'Sáng & tối' },
  daylight: { en: 'Daylight', vi: 'Ban ngày' },
  midnight: { en: 'Midnight', vi: 'Nửa đêm' },
  lightLabel: { en: 'Light appearance', vi: 'Giao diện sáng' },
  darkLabel: { en: 'Dark appearance', vi: 'Giao diện tối' },
  story: { en: 'Color story', vi: 'Câu chuyện màu' },
  paletteLabel: { en: 'palette', vi: 'bảng màu' },
  language: { en: 'Language', vi: 'Ngôn ngữ' },
  soundOn: { en: 'Sound on', vi: 'Đang phát âm thanh' },
  soundReady: { en: 'Sound ready', vi: 'Âm thanh sẵn sàng' },
  soundOff: { en: 'Audio unavailable', vi: 'Không có âm thanh' },
  detail: { en: 'Maximum detail', vi: 'Chi tiết tối đa' },
} satisfies Record<string, Localized>;

const LANGUAGE_NAMES = { en: 'English', vi: 'Tiếng Việt' } as const;

function Sun({ moon = false }: { moon?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">{moon ? <path d="M20 14A8 8 0 0 1 10 4a8.3 8.3 0 1 0 10 10Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}</svg>;
}

export default function SettingsControls({ audioStatus = 'ready' }: { audioStatus?: AudioStatus }) {
  const { settings, setSettings } = useSettings();
  const t = useCopy(COPY);
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
      <div className={styles.bar}>
        <div className={styles.language} role="group" aria-label={t.language}>
          {LANGUAGES.map(language => <button
            key={language} type="button" lang={language} aria-pressed={settings.language === language} aria-label={LANGUAGE_NAMES[language]}
            onClick={() => setSettings(current => ({ ...current, language }))}
          >{language.toUpperCase()}</button>)}
          <span className={styles.languageThumb} data-language={settings.language} aria-hidden="true" />
        </div>
        <button ref={triggerRef} type="button" className={styles.trigger} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
          <span className={styles.triggerStar} aria-hidden="true">✧</span> <span className={styles.triggerLabel}>{t.trigger}</span> <span className={styles.triggerDot} aria-hidden="true" />
        </button>
      </div>
      <section id={panelId} className={styles.panel} aria-label={t.panel} hidden={!open}>
        <div className={styles.heading}>
          <div><span className={styles.eyebrow}>{t.eyebrow}</span><h2>{t.title}</h2></div>
          <button type="button" className={styles.close} aria-label={t.close} onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>×</button>
        </div>
        <p className={styles.description}>{t.description}</p>
        <fieldset className={styles.section}>
          <legend>{t.shade}</legend>
          <div className={styles.modes}>
            <button type="button" aria-label={t.lightLabel} aria-pressed={settings.appearance === 'light'} onClick={() => setSettings(current => ({ ...current, appearance: 'light' }))}><Sun /><span>{t.daylight}</span></button>
            <button type="button" aria-label={t.darkLabel} aria-pressed={settings.appearance === 'dark'} onClick={() => setSettings(current => ({ ...current, appearance: 'dark' }))}><Sun moon /><span>{t.midnight}</span></button>
          </div>
        </fieldset>
        <fieldset className={styles.section}>
          <legend>{t.story}</legend>
          <div className={styles.palettes}>
            {palettes.map(palette => <button
              key={palette.id} type="button" className={styles.palette}
              aria-label={`${palette.name} ${t.paletteLabel}`} aria-pressed={settings.palette === palette.id}
              style={{ '--swatch-a': palette[settings.appearance][0], '--swatch-b': palette[settings.appearance][1], '--swatch-c': palette[settings.appearance][2] } as CSSProperties}
              onClick={() => setSettings(current => ({ ...current, palette: palette.id }))}
            >
              <span className={styles.paletteArt} aria-hidden="true"><i /><i /><span>✧</span><b>✓</b></span>
              <span className={styles.paletteName}>{palette.name}</span>
              <span className={styles.paletteNote}>{palette.note[settings.language]}</span>
            </button>)}
          </div>
        </fieldset>
        <div className={styles.status}>
          <span className={styles.sound} data-playing={audioStatus === 'playing'}><span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>{audioStatus === 'playing' ? t.soundOn : audioStatus === 'ready' ? t.soundReady : t.soundOff}</span>
          <span className={styles.detail}><span aria-hidden="true">✦</span> {t.detail}</span>
        </div>
      </section>
    </div>
  );
}
