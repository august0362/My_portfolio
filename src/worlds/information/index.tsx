import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Connect from './components/Connect';
import Gallery from './components/Gallery';
import Identity from './components/Identity';
import Journey from './components/Journey';
import SectionNav from './components/SectionNav';
import Skills from './components/Skills';
import ThemePicker from './components/ThemePicker';
import styles from './Information.module.css';
import { useReducedMotion, useReveal, useScrollProgress } from './motion';
import { getTheme, rootStyle, ThemeContext, type Mode } from './theme';
import { ACTIVE_THEME, DEFAULT_MODE, SHOW_MODE_TOGGLE, SHOW_THEME_PICKER } from './theme.config';

const STORAGE_KEY = 'chronicle-theme';
const MODE_KEY = 'chronicle-mode';

/** Per-visitor convenience only; the page works the same when storage is unavailable. */
function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function remember(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the choice simply is not remembered.
  }
}

/** Visitor's choice: `?theme=N` link, then their last pick, then ACTIVE_THEME from the config. */
function initialTheme() {
  if (!SHOW_THEME_PICKER || typeof window === 'undefined') return ACTIVE_THEME;
  const fromUrl = Number(new URLSearchParams(window.location.search).get('theme'));
  for (const n of [fromUrl, Number(read(STORAGE_KEY))]) if (getTheme(n).no === n) return n;
  return ACTIVE_THEME;
}

/** The visitor's own light/dark choice; deliberately not prefers-color-scheme. */
function initialMode(): Mode {
  const saved = SHOW_MODE_TOGGLE ? read(MODE_KEY) : null;
  return saved === 'light' || saved === 'dark' ? saved : DEFAULT_MODE;
}

/** World entry: default export, no props (module contract). */
export default function InformationWorld() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [themeNo, setThemeNo] = useState(initialTheme);
  const [mode, setMode] = useState<Mode>(initialMode);
  const theme = getTheme(themeNo, mode);
  useReveal(ref);
  useScrollProgress(ref, !reduced);

  // Cross-fade the whole page between appearances where supported. The browser default (~0.25 s) flips
  // light and dark too abruptly, so both snapshots fade slowly on one curve. Opacities always sum to 1
  // (the UA blends the pair with plus-lighter), so there is no flash or dip midway.
  const transition = (update: () => void) => {
    const apply = () => flushSync(update);
    if (reduced || !document.startViewTransition) return apply();
    const vt = document.startViewTransition(apply);
    vt.ready
      .then(() => {
        const timing = { duration: 800, easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'both' } as const;
        const root = document.documentElement;
        root.animate({ opacity: [1, 0] }, { ...timing, pseudoElement: '::view-transition-old(root)' });
        root.animate({ opacity: [0, 1] }, { ...timing, pseudoElement: '::view-transition-new(root)' });
      })
      .catch(() => {}); // Skipped transitions (e.g. a second click mid-fade) just apply instantly.
  };

  const changeTheme = (no: number) => {
    if (no === themeNo) return;
    const url = new URL(window.location.href);
    url.searchParams.set('theme', String(no));
    window.history.replaceState(window.history.state, '', url);
    remember(STORAGE_KEY, String(no));
    transition(() => setThemeNo(no));
  };

  const changeMode = (next: Mode) => {
    remember(MODE_KEY, next);
    transition(() => setMode(next));
  };

  return (
    <ThemeContext value={theme}>
      <div
        ref={ref}
        className={styles.root}
        style={rootStyle(theme)}
        data-motion={reduced ? 'reduced' : 'full'}
        data-mode={mode}
        lang="en"
      >
        <SectionNav reduced={reduced} />
        <Identity reduced={reduced} />
        <Journey />
        <Gallery reduced={reduced} />
        <Skills />
        <Connect reduced={reduced} />
        {(SHOW_THEME_PICKER || SHOW_MODE_TOGGLE) && (
          <ThemePicker
            current={theme}
            onChange={SHOW_THEME_PICKER ? changeTheme : undefined}
            onModeChange={SHOW_MODE_TOGGLE ? changeMode : undefined}
          />
        )}
      </div>
    </ThemeContext>
  );
}
