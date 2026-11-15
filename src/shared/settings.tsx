import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

export interface Settings {
  motion: 'full' | 'reduced';
  quality: 'full' | 'lite' | 'static';
  sound: boolean;
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
    sound: false,
  };

  try {
    const saved: Partial<Settings> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return {
      motion: saved?.motion === 'full' || saved?.motion === 'reduced' ? saved.motion : defaults.motion,
      quality: saved?.quality === 'full' || saved?.quality === 'lite' || saved?.quality === 'static'
        ? saved.quality
        : defaults.quality,
      sound: typeof saved?.sound === 'boolean' ? saved.sound : defaults.sound,
    };
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(initialSettings);

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
