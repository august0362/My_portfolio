import { Link } from 'react-router';
import styles from '../App.module.css';

export default function BackToHub() {
  return <nav className={styles.back} aria-label="Global"><Link to="/">Back to Hub</Link></nav>;
}
