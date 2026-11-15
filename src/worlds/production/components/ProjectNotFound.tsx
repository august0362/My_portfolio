import { Link } from 'react-router';
import { useCopy } from '@shared/i18n';
import { COPY } from '../data/locale';
import useWorldPage from '../hooks/useWorldPage';
import Icon from './Icon';
import styles from '../Production.module.css';

export default function ProjectNotFound() {
  const t = useCopy(COPY);
  const headingRef = useWorldPage(t.notFoundPage);
  return <section className={styles.notFound}><Icon name="compass" /><h1 ref={headingRef} tabIndex={-1}>{t.notFoundTitle}</h1><p>{t.notFoundBody}</p><Link className={styles.primaryButton} to="/production">{t.backToProduction} <Icon name="arrow" /></Link></section>;
}
