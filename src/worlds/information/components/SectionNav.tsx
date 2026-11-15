import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import { useTheme, type SectionId } from '../theme';
import styles from './SectionNav.module.css';

const ITEMS: { id: SectionId; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'journey', label: 'My Journey' },
  { id: 'gallery', label: 'Fragments of Me' },
  { id: 'skills', label: 'Knowledge & Skills' },
  { id: 'connect', label: 'Resume & Connect' },
];

/** In-page section index. Not global navigation; the hub link stays with Core. */
export default function SectionNav({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState<SectionId>('identity');
  const theme = useTheme();

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
    target.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true });
  };

  // Adopt the active section's scheme so the index reads on light and dark sections alike.
  const scheme = theme.schemes[active];
  const tone = { '--nav-bg': scheme.bg, '--nav-ink': scheme.text } as CSSProperties;

  return (
    <nav className={styles.nav} style={tone} aria-label="Chronicle sections">
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
              <span className={styles.label}>{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
