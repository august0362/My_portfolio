import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

export interface Settings {
  motion: 'full' | 'reduced';
  quality: 'full' | 'lite' | 'static';
  sound: boolean;
  appearance: 'dark' | 'light';
  palette: 'moonlit' | 'rosewater' | 'tidal';
}

interface SettingsContextValue {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

const STORAGE_KEY = 'mobius-settings';
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function initialSettings(): Settings {
  const defaults: Settings = {
    motion: typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ? 'reduced'
      : 'full',
    quality: 'full',
    sound: true,
    appearance: 'dark',
    palette: 'moonlit',
  };

  try {
    const saved: Partial<Settings> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return {
      ...defaults,
      appearance: saved?.appearance === 'light' || saved?.appearance === 'dark' ? saved.appearance : defaults.appearance,
      palette: saved?.palette === 'moonlit' || saved?.palette === 'rosewater' || saved?.palette === 'tidal' ? saved.palette : defaults.palette,
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background || '#101022');
  }, [settings.appearance, settings.palette]);

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
