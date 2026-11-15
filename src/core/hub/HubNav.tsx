import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useSettings } from '@shared/settings';
import { useCopy } from '@shared/i18n';
import { HUB_COPY, SHELL_COPY, WORLD_LINES, WORLD_NAMES } from '../copy';
import { WORLDS } from '../registry';
import usePageFocus from '../shell/usePageFocus';
import WorldGlyph from './WorldGlyph';
import useCelestialOrbit from './useCelestialOrbit';
import { RAY_COUNT } from './celestialMotion';
import styles from './HubNav.module.css';

export default function HubNav() {
  const { settings } = useSettings();
  const t = useCopy(HUB_COPY);
  const language = settings.language;
  const mainRef = usePageFocus(SHELL_COPY.portal[language]);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);
  const raysRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const animated = settings.motion === 'full' && settings.quality !== 'static';
  const orbit = useCelestialOrbit({ stageRef, canvasRef, cardsRef, raysRef, animated, paused, quality: settings.quality, appearance: settings.appearance, palette: settings.palette, onSelect: setSelected });

  return (
    <main ref={mainRef} tabIndex={-1} className={styles.hub} aria-labelledby="hub-title" data-animated={animated} data-paused={paused}>
      <header className={styles.top}>
        <span className={styles.wordmark}><span aria-hidden="true">✧</span> {t.wordmark}</span>
        <span className={styles.topNote}>{t.topNote}</span>
      </header>
      <div className={styles.intro}>
        <p className={styles.kicker}><span aria-hidden="true" /> {t.kicker}</p>
        <h1 id="hub-title">{t.titleA}<br /><em>{t.titleB}</em></h1>
        <p>{t.intro}</p>
      </div>
      <div
        ref={stageRef}
        className={styles.stage}
        aria-label={t.stage}
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
        <button type="button" className={styles.centerpiece} data-portal-pulse="true" aria-label={t.pulse} title={t.pulseTitle}><span aria-hidden="true">✧</span><i aria-hidden="true" /><i aria-hidden="true" /></button>
        {animated && <div className={styles.rays} role="group" aria-label={t.rays}>
          <span id="ray-help" className={styles.srOnly}>{t.rayHelp}</span>
          {Array.from({ length: RAY_COUNT }, (_, index) => <button
            key={index} type="button" ref={(node) => { raysRef.current[index] = node; }}
            className={styles.ray} data-ray={index} aria-label={`${t.ray} ${index + 1}`} aria-describedby="ray-help"
            onKeyDown={(event) => orbit.onRayKeyDown(event, index)} onClick={(event) => orbit.onRayClick(event, index)}
          ><span aria-hidden="true">✧</span></button>)}
        </div>}
        <nav className={styles.worlds} aria-label={t.worlds}>
          <ul>
            {WORLDS.map((world, index) => {
            const prefetch = () => { void world.load().catch(() => { /* Navigation can retry loading. */ }); };
            return (
              <li key={world.id} ref={(node) => { cardsRef.current[index] = node; }} className={styles.world} data-world={world.id} data-primary={animated && selected === index}>
                <Link
                  to={world.path}
                  data-portal-card="true"
                  draggable={false}
                  className={styles.card}
                  aria-label={`${t.enter} ${WORLD_NAMES[world.id][language]}`}
                  onPointerEnter={(event) => { if (event.pointerType === 'mouse') orbit.hover(index); prefetch(); }}
                  onPointerLeave={() => orbit.hover(null)}
                  onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) orbit.focus(index); prefetch(); }}
                  onBlur={() => orbit.focus(null)}
                >
                  <span className={styles.cardHalo} aria-hidden="true" />
                  <span className={styles.cardStar} aria-hidden="true">✦</span>
                  <WorldGlyph index={index} />
                  <span className={styles.cardTitle}>{WORLD_NAMES[world.id][language]}</span>
                  <span className={styles.cardDescription}>{WORLD_LINES[world.id][language]}</span>
                  <span className={styles.enter}>{t.explore} <span aria-hidden="true">↗</span></span>
                  <span className={styles.pixels} aria-hidden="true">{Array.from({ length: 12 }, (_, pixel) => <i key={pixel} style={{ '--pixel': pixel } as CSSProperties} />)}</span>
                </Link>
              </li>
            );
          })}
          </ul>
        </nav>
      </div>
      <footer className={styles.bottom}>
        <p className={styles.caption}><span aria-hidden="true">✧</span> {t.caption}</p>
        {animated && <div className={styles.controls} aria-label={t.controls}>
          <button type="button" aria-label={t.previous} onClick={() => orbit.step(-1)}>←</button>
          <button type="button" className={styles.pause} aria-label={paused ? t.resume : t.pause} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type="button" aria-label={t.next} onClick={() => orbit.step(1)}>→</button>
        </div>}
        <p className={styles.hint}>{animated ? t.hintAnimated : t.hintStatic}<span>{WORLD_NAMES[WORLDS[selected].id][language]}</span></p>
      </footer>
    </main>
  );
}
