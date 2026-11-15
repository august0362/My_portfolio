import type { Project } from '../types';
import Icon from './Icon';
import styles from '../Production.module.css';

export default function ProjectActions({ project, sourceLabel = 'GitHub' }: { project: Project; sourceLabel?: string }) {
  return <div className={styles.actions}>
    {project.links.demo && <a className={styles.primaryButton} href={project.links.demo} target="_blank" rel="noopener noreferrer">Play Game <Icon name="arrow" /><span className={styles.srOnly}> (opens in a new tab)</span></a>}
    {project.links.repository && <a className={styles.secondaryButton} href={project.links.repository} target="_blank" rel="noopener noreferrer"><Icon name="source" />{sourceLabel}<span className={styles.srOnly}> (opens in a new tab)</span></a>}
  </div>;
}
