import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useCopy } from '@shared/i18n';
import { COPY } from '../data/locale';
import { useTheme, type SectionId } from '../theme';
import styles from './SectionNav.module.css';

const ITEMS: { id: SectionId; label: 'navIdentity' | 'navJourney' | 'navGallery' | 'navSkills' | 'navConnect' }[] = [
  { id: 'identity', label: 'navIdentity' },
  { id: 'journey', label: 'navJourney' },
  { id: 'gallery', label: 'navGallery' },
  { id: 'skills', label: 'navSkills' },
  { id: 'connect', label: 'navConnect' },
];

/** In-page section index. Not global navigation; the hub link stays with Core. */
export default function SectionNav({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState<SectionId>('identity');
  const theme = useTheme();
  const t = useCopy(COPY);
  const sweeps = useRef(new Set<number>());

  useEffect(() => () => sweeps.current.forEach((id) => window.clearTimeout(id)), []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { id } of ITEMS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (!reduced) arrive(target);
    target.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true });
  };

  /** Section transition: a band of light sweeps the arriving section and its title settles in. */
  function arrive(target: HTMLElement) {
    target.querySelector(`.${styles.sweep}`)?.remove();
    const sweep = document.createElement('span');
    sweep.className = styles.sweep;
    sweep.setAttribute('aria-hidden', 'true');
    sweep.append(document.createElement('i'));
    target.append(sweep);
    target.dataset.arriving = '';
    const id = window.setTimeout(() => {
      sweep.remove();
      delete target.dataset.arriving;
      sweeps.current.delete(id);
    }, 1700);
    sweeps.current.add(id);
  }

  // Adopt the active section's scheme so the index reads on light and dark sections alike.
  const scheme = theme.schemes[active];
  const tone = { '--nav-bg': scheme.bg, '--nav-ink': scheme.text } as CSSProperties;

  return (
    <nav className={styles.nav} style={tone} aria-label={t.navLabel}>
      <span
        className={styles.orb}
        style={{ '--at': ITEMS.findIndex((item) => item.id === active) } as CSSProperties}
        aria-hidden="true"
      />
      <ol>
        {ITEMS.map(({ id, label }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={active === id ? 'true' : undefined}
              onClick={(e) => go(e, id)}
            >
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.label}>{t[label]}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
