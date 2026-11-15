import { useCopy } from '@shared/i18n';
import { COPY } from '../data/locale';
import type { Project } from '../types';
import Icon from './Icon';
import styles from '../Production.module.css';

/** Play Game always; the source link only where asked for (the page footer, not the hero). */
export default function ProjectActions({ project, source = false }: { project: Project; source?: boolean }) {
  const t = useCopy(COPY);
  return <div className={styles.actions}>
    {project.links.demo && <a className={styles.primaryButton} data-project-action="play" href={project.links.demo} target="_blank" rel="noopener noreferrer">{t.play} <Icon name="arrow" /><span className={styles.srOnly}> {t.newTab}</span></a>}
    {source && project.links.repository && <a className={styles.secondaryButton} data-project-action="source" href={project.links.repository} target="_blank" rel="noopener noreferrer"><Icon name="source" />{t.source}<span className={styles.srOnly}> {t.newTab}</span></a>}
  </div>;
}
