import { Link } from 'react-router';
import useWorldPage from '../hooks/useWorldPage';
import Icon from './Icon';
import styles from '../Production.module.css';

export default function ProjectNotFound() {
  const headingRef = useWorldPage('Project not found');
  return <section className={styles.notFound}><Icon name="compass" /><h1 ref={headingRef} tabIndex={-1}>This project isn’t here.</h1><p>Return to The Forge to explore the available projects.</p><Link className={styles.primaryButton} to="/production">Back to Production <Icon name="arrow" /></Link></section>;
}
