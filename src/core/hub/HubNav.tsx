import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useSettings } from '@shared/settings';
import { WORLDS } from '../registry';
import usePageFocus from '../shell/usePageFocus';
import WorldGlyph from './WorldGlyph';
import useCelestialOrbit from './useCelestialOrbit';
import styles from './HubNav.module.css';

const descriptions = ['The story behind the person.', 'Ideas brought into being.', 'A collection of other selves.', 'Where the light takes you.', 'Somewhere beyond the tangible.'];

export default function HubNav() {
  const mainRef = usePageFocus('Celestial Portal');
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);
  const { settings } = useSettings();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const animated = settings.motion === 'full' && settings.quality !== 'static';
  const orbit = useCelestialOrbit({ stageRef, canvasRef, cardsRef, animated, paused, quality: settings.quality, onSelect: setSelected });

  return (
    <main ref={mainRef} tabIndex={-1} className={styles.hub} aria-labelledby="hub-title" data-animated={animated} data-paused={paused}>
      <header className={styles.top}>
        <span className={styles.wordmark}><span aria-hidden="true">✧</span> Celestial</span>
        <span className={styles.topNote}>A personal constellation</span>
      </header>
      <div className={styles.intro}>
        <p className={styles.kicker}><span aria-hidden="true" /> A place between worlds</p>
        <h1 id="hub-title">Follow your<br /><em>curiosity.</em></h1>
        <p>Five worlds. A different side of the same universe.</p>
      </div>
      <div
        ref={stageRef}
        className={styles.stage}
        aria-label="Rotating celestial portal"
        onPointerDown={orbit.onPointerDown}
        onPointerMove={orbit.onPointerMove}
        onPointerUp={orbit.onPointerUp}
        onPointerCancel={orbit.onPointerCancel}
        onLostPointerCapture={orbit.onPointerCancel}
        onPointerLeave={orbit.onPointerLeave}
        onClickCapture={orbit.onClickCapture}
      >
        <canvas ref={canvasRef} className={styles.cosmos} aria-hidden="true" />
        <div className={styles.nebula} aria-hidden="true" />
        <div className={styles.centerpiece} aria-hidden="true"><span>✧</span><i /><i /></div>
        <nav className={styles.worlds} aria-label="Worlds">
          <ul>
            {WORLDS.map((world, index) => {
            const prefetch = () => { void world.load().catch(() => { /* Navigation can retry loading. */ }); };
            return (
              <li key={world.id} ref={(node) => { cardsRef.current[index] = node; }} className={styles.world} data-world={world.id}>
                <Link
                  to={world.path}
                  draggable={false}
                  className={styles.card}
                  aria-label={`Enter ${world.title}`}
                  onPointerEnter={(event) => { if (event.pointerType === 'mouse') orbit.hover(index); prefetch(); }}
                  onPointerLeave={() => orbit.hover(null)}
                  onFocus={() => { orbit.focus(index); prefetch(); }}
                  onBlur={() => orbit.focus(null)}
                >
                  <span className={styles.cardHalo} aria-hidden="true" />
                  <span className={styles.cardStar} aria-hidden="true">✦</span>
                  <WorldGlyph index={index} />
                  <span className={styles.cardTitle}>{world.title}</span>
                  <span className={styles.cardDescription}>{descriptions[index]}</span>
                  <span className={styles.enter}>Explore <span aria-hidden="true">↗</span></span>
                  <span className={styles.pixels} aria-hidden="true">{Array.from({ length: 12 }, (_, pixel) => <i key={pixel} style={{ '--pixel': pixel } as CSSProperties} />)}</span>
                </Link>
              </li>
            );
          })}
          </ul>
        </nav>
      </div>
      <footer className={styles.bottom}>
        <p className={styles.caption}><span aria-hidden="true">✧</span> Every world is a new perspective.</p>
        {animated && <div className={styles.controls} aria-label="Orbit controls">
          <button type="button" aria-label="Previous world" onClick={() => orbit.step(-1)}>←</button>
          <button type="button" className={styles.pause} aria-label={paused ? 'Resume orbit' : 'Pause orbit'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type="button" aria-label="Next world" onClick={() => orbit.step(1)}>→</button>
        </div>}
        <p className={styles.hint}>{animated ? 'Drag to orbit · Select to explore' : 'Choose a world to explore'}<span>{WORLDS[selected].title}</span></p>
      </footer>
    </main>
  );
}
