import { useSettings, type Language } from './settings';

/** A value written once per site language (P-17). */
export type Localized<T = string> = Record<Language, T>;

/** The visitor's site language, chosen in the Atmosphere panel. */
export function useLanguage(): Language {
  return useSettings().settings.language;
}

/**
 * Returns the copy for the current language. Pass a dictionary of `Localized` entries:
 * `const t = useCopy(COPY); t.title`.
 */
export function useCopy<T extends Record<string, Localized<unknown>>>(dictionary: T): { [K in keyof T]: T[K][Language] } {
  const language = useLanguage();
  return Object.fromEntries(Object.entries(dictionary).map(([key, value]) => [key, value[language]])) as { [K in keyof T]: T[K][Language] };
}

/** Picks one localized value without a hook (for data mapped inside render). */
export const pick = <T,>(value: Localized<T>, language: Language): T => value[language];
