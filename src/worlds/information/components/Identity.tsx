import { useRef, type CSSProperties } from 'react';
import { identity } from '../data/identity';
import { delay } from '../motion';
import { useTiltVars } from '../sensor';
import { MOOD, sectionStyle, useTheme } from '../theme';
import Ambient from './Ambient';
import styles from './Identity.module.css';
import { Dot, Sparkle } from './celestial';
import Orbit3D from './Orbit3D';
import shared from './Section.module.css';

/** Wraps the first occurrence of `word` in <em> without altering the text. */
function emphasize(text: string, word: string) {
  const at = text.indexOf(word);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <em>{word}</em>
      {text.slice(at + word.length)}
    </>
  );
}

export default function Identity({ reduced }: { reduced: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  useTiltVars(heroRef, !reduced);

  const { profile } = identity;
  const [lead, ...rest] = profile.bio.paragraphs;

  return (
    <section id="identity" className={styles.identity} style={sectionStyle(theme, 'identity')} data-tone={theme.schemes.identity.tone} aria-labelledby="identity-title">
      <Ambient mood={MOOD.identity} tone={theme.schemes.identity.tone} />

      {/* ---------- Opening hero ---------- */}
      <div ref={heroRef} className={styles.hero} data-scroll>
        <p className={styles.masthead} data-reveal="fade">
          <span>Personal Chronicle</span>
          <span className={styles.mastRule} data-reveal="line" style={delay(300)} />
          <span>01 · Identity</span>
        </p>

        <div className={styles.portraitWrap}>
          <Orbit3D
            reduced={reduced}
            ornaments={
              <>
                <Sparkle x={-58} y={78} r={11} i={0} />
                <Sparkle x={-30} y={118} r={4.5} i={2} />
                <Sparkle x={352} y={-28} r={9} i={1} />
                <Sparkle x={338} y={330} r={10} i={3} />
                <Dot x={318} y={-6} r={2.4} hollow i={2} />
                <Dot x={-40} y={352} r={2} i={4} />
              </>
            }
          >
            <div className={styles.portraitFloat}>
              {/* Turns with the tilt sensor; Orbit3D projects the rings with the same rotation. */}
              <div className={styles.portraitTilt}>
                <span className={styles.arch} aria-hidden="true" />
                <figure className={styles.portrait} data-reveal="mask" style={delay(250)}>
                  <div className={styles.portraitArt} aria-hidden="true">
                    <span className={styles.sun} />
                    <span className={`${styles.cloud} ${styles.cloud1}`} />
                    <span className={`${styles.cloud} ${styles.cloud2}`} />
                    <span className={styles.horizon} />
                  </div>
                  <span className={styles.glare} aria-hidden="true" />
                  <figcaption className={styles.portraitCaption}>
                    <span className={styles.portraitMark} aria-hidden="true">✦</span>
                    <span className={styles.portraitTitle}>Portrait</span>
                    <span className={styles.portraitNote}>Placeholder · to be provided by the creator</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </Orbit3D>
        </div>

        <h1 id="identity-title" className={styles.name} tabIndex={-1} data-reveal="letters">
          <span className={shared.srOnly}>{profile.displayName}</span>
          <span className={styles.nameLine} aria-hidden="true">
            {Array.from(profile.displayName).map((ch, i) => (
              <span key={i} className={styles.char} style={{ '--i': i } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className={styles.headline} data-reveal="up" style={delay(950)}>
          {profile.headline}
        </p>

        <div className={styles.lower}>
          <p className={styles.fullName} data-reveal="up" style={delay(650)}>
            {profile.fullName}
          </p>
          <p className={styles.role} data-reveal="up" style={delay(780)}>
            {profile.role}
          </p>
        </div>

        <span className={styles.scrollCue} aria-hidden="true">
          Scroll
        </span>
      </div>

      {/* ---------- Introduction ---------- */}
      <div className={styles.intro}>
        <aside className={styles.aside}>
          <p className={styles.eyebrow} data-reveal="fade">
            <span className={styles.eyebrowNum}>01</span> About
          </p>
          <dl className={styles.facts}>
            <div data-reveal="up">
              <dt>Education</dt>
              <dd>{profile.education.institution}</dd>
            </div>
            <div data-reveal="up" style={delay(100)}>
              <dt>Major</dt>
              <dd>{profile.education.major}</dd>
            </div>
            <div data-reveal="up" style={delay(200)}>
              <dt>Role</dt>
              <dd>{profile.role}</dd>
            </div>
          </dl>
          <ul className={styles.traits} lang="vi" aria-label="Personality">
            {profile.personality.map((t, i) => (
              <li key={t} data-reveal="up" style={delay(300 + i * 90)}>
                {t}
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.bio} lang="vi">
          <p className={styles.lead} data-reveal="up">
            {emphasize(lead, profile.displayName)}
          </p>
          {rest.map((p, i) => (
            <p key={i} className={styles.para} data-reveal="up" style={delay(i * 110)}>
              {p}
            </p>
          ))}
        </div>

        <span className={styles.thread} aria-hidden="true" data-reveal="vline" />
      </div>
    </section>
  );
}
