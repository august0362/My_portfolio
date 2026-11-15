import { Link } from 'react-router';
import { WORLDS } from '../registry';
import usePageFocus from '../shell/usePageFocus';
import styles from '../App.module.css';

export default function HubNav() {
  const mainRef = usePageFocus('Hub');

  return (
    <main className={styles.main} ref={mainRef} tabIndex={-1} aria-labelledby="hub-title">
      <h1 id="hub-title">Möbius Hub</h1>
      <p>Choose a world to explore.</p>
      <nav aria-label="Worlds">
        <ul className={styles.worlds}>
          {WORLDS.map((world) => {
            const prefetch = () => { void world.load().catch(() => { /* Navigation can retry loading. */ }); };
            return (
              <li key={world.id}>
                <Link to={world.path} onMouseEnter={prefetch} onFocus={prefetch}>{world.title}</Link>
                <p>{world.tagline}</p>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
