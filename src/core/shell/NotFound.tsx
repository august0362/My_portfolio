import BackToHub from './BackToHub';
import usePageFocus from './usePageFocus';
import styles from '../App.module.css';

export default function NotFound() {
  const mainRef = usePageFocus('Page not found');

  return (
    <main className={styles.main} ref={mainRef} tabIndex={-1} aria-labelledby="not-found-title">
      <BackToHub />
      <h1 id="not-found-title">404 — Page not found</h1>
      <p>This page does not exist. Return to the Hub to choose a world.</p>
    </main>
  );
}
