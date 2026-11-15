import { identity } from '../data/identity';
import { fields, technologies } from '../data/skills';
import { delay } from '../motion';
import { CORNER, CornerBracket } from './celestial';
import shared from './Section.module.css';
import Section from './Section';
import styles from './Skills.module.css';
import SwapText from './SwapText';

export default function Skills() {
  const { interests, goal } = identity.profile;

  return (
    <Section
      id="skills"
      number="04"
      kicker="Fields"
      title={
        <>
          Knowledge <em>&amp; Skills</em>
        </>
      }
    >
      <CornerBracket className={CORNER} />

      <div className={styles.layout}>
        <ol className={styles.fields}>
          {fields.map((name, i) => (
            <li key={name} className={styles.field} data-swap-host data-reveal="up" style={delay(i * 120)}>
              <span className={styles.rule} data-reveal="line" style={delay(i * 120 + 200)} aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <SwapText className={styles.name}>{name}</SwapText>
              <span className={styles.star} aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ol>

        <aside className={styles.aside}>
          <div className={styles.block} data-reveal="up">
            <h3 className={styles.label}>Interests</h3>
            <ul className={styles.interests} lang="vi">
              {interests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className={styles.block} data-reveal="up" style={delay(140)}>
            <h3 className={styles.label}>Direction</h3>
            <p className={styles.goal} lang="vi">
              {goal}
            </p>
          </div>

          <div className={styles.block} data-reveal="up" style={delay(280)}>
            <h3 className={styles.label}>Technologies</h3>
            {technologies.length > 0 ? (
              <ul className={styles.tech}>
                {technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.pending}>
                <span className={shared.badge}>Pending</span>
                <span>Detailed list awaits the creator’s confirmation.</span>
              </p>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
