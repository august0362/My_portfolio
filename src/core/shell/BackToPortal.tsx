import { Link } from 'react-router';
import { useCopy } from '@shared/i18n';
import { SHELL_COPY } from '../copy';
import styles from '../App.module.css';

/** The floating way home to the Celestial Portal (the hub at `/`). */
export default function BackToPortal() {
  const t = useCopy(SHELL_COPY);
  return <nav className={styles.back} aria-label={t.global}><Link to="/"><span className={styles.backStar} aria-hidden="true">✧</span>{t.returnToPortal}</Link></nav>;
}
