import { useCopy } from '@shared/i18n';
import { SHELL_COPY } from '../copy';
import BackToPortal from './BackToPortal';
import usePageFocus from './usePageFocus';
import styles from '../App.module.css';

export default function NotFound() {
  const t = useCopy(SHELL_COPY);
  const mainRef = usePageFocus(t.notFoundTitle);

  return (
    <main className={styles.main} ref={mainRef} tabIndex={-1} aria-labelledby="not-found-title">
      <BackToPortal />
      <h1 id="not-found-title">404 — {t.notFoundTitle}</h1>
      <p>{t.notFoundBody}</p>
    </main>
  );
}
