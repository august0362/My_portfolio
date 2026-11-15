import { useRef } from 'react';
import { useSettings } from '@shared/settings';
import Connect from './components/Connect';
import Gallery from './components/Gallery';
import Identity from './components/Identity';
import Journey from './components/Journey';
import SectionNav from './components/SectionNav';
import Skills from './components/Skills';
import styles from './Information.module.css';
import { useReducedMotion, useReveal, useScrollProgress } from './motion';
import { getTheme, rootStyle, ThemeContext } from './theme';
import { PAIRED_THEMES } from './theme.config';

/** World entry: default export, no props (module contract). */
export default function InformationWorld() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The site's Atmosphere panel owns palette and light/dark; this world shows the paired theme (P-16).
  const { palette, appearance } = useSettings().settings;
  const theme = getTheme(PAIRED_THEMES[palette], appearance);
  useReveal(ref);
  useScrollProgress(ref, !reduced);

  return (
    <ThemeContext value={theme}>
      <div
        ref={ref}
        className={styles.root}
        style={rootStyle(theme)}
        data-motion={reduced ? 'reduced' : 'full'}
        data-mode={appearance}
        lang="en"
      >
        <SectionNav reduced={reduced} />
        <Identity reduced={reduced} />
        <Journey />
        <Gallery reduced={reduced} />
        <Skills />
        <Connect reduced={reduced} />
      </div>
    </ThemeContext>
  );
}
