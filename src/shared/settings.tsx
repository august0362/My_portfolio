import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

/** Site color stories (P-17). Each one has a light and a dark appearance. */
export const PALETTES = ['iris', 'sakura', 'jade', 'pearl', 'dream'] as const;
export type Palette = (typeof PALETTES)[number];

/** Site languages (P-17). */
export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];

export interface Settings {
  motion: 'full' | 'reduced';
  quality: 'full' | 'lite' | 'static';
  sound: boolean;
  appearance: 'dark' | 'light';
  palette: Palette;
  language: Language;
}

interface SettingsContextValue {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

const STORAGE_KEY = 'mobius-settings';
/** Retired palettes map onto their closest current color story. */
const LEGACY_PALETTES: Record<string, Palette> = { moonlit: 'iris', rosewater: 'sakura', tidal: 'jade', lagoon: 'dream' };
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const isPalette = (value: unknown): value is Palette => PALETTES.includes(value as Palette);
const isLanguage = (value: unknown): value is Language => LANGUAGES.includes(value as Language);

function browserLanguage(): Language {
  try {
    return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en';
  } catch {
    return 'en';
  }
}

function initialSettings(): Settings {
  const defaults: Settings = {
    motion: typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ? 'reduced'
      : 'full',
    quality: 'full',
    sound: true,
    appearance: 'dark',
    palette: 'iris',
    language: browserLanguage(),
  };

  try {
    const saved: Partial<Record<keyof Settings, unknown>> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const palette = isPalette(saved?.palette) ? saved.palette : LEGACY_PALETTES[String(saved?.palette)];
    return {
      ...defaults,
      appearance: saved?.appearance === 'light' || saved?.appearance === 'dark' ? saved.appearance : defaults.appearance,
      palette: palette ?? defaults.palette,
      language: isLanguage(saved?.language) ? saved.language : defaults.language,
    };
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(initialSettings);

  useLayoutEffect(() => {
    document.documentElement.dataset.appearance = settings.appearance;
    document.documentElement.dataset.palette = settings.palette;
    const background = getComputedStyle(document.documentElement).getPropertyValue('--portal-bg').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background || '#14152b');
  }, [settings.appearance, settings.palette]);

  useLayoutEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Preferences still work for this session when storage is unavailable.
    }
  }, [settings]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used within SettingsProvider.');
  return value;
}
