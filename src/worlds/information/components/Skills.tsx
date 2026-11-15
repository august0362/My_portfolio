import { useCopy, useLanguage } from '@shared/i18n';
import { COPY, localizedProfile } from '../data/locale';
import { technologies } from '../data/skills';
import { delay } from '../motion';
import { CORNER, CornerBracket } from './celestial';
import shared from './Section.module.css';
import Section from './Section';
import styles from './Skills.module.css';
import SwapText from './SwapText';

export default function Skills() {
  const t = useCopy(COPY);
  const { interests, goal, fields } = localizedProfile(useLanguage());

  return (
    <Section
      id="skills"
      number="04"
      kicker={t.skillsKicker}
      title={
        <>
          {t.skillsTitle[0]}<em>{t.skillsTitle[1]}</em>
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
            <h3 className={styles.label}>{t.interests}</h3>
            <ul className={styles.interests}>
              {interests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className={styles.block} data-reveal="up" style={delay(140)}>
            <h3 className={styles.label}>{t.direction}</h3>
            <p className={styles.goal}>
              {goal}
            </p>
          </div>

          <div className={styles.block} data-reveal="up" style={delay(280)}>
            <h3 className={styles.label}>{t.technologies}</h3>
            {technologies.length > 0 ? (
              <ul className={styles.tech}>
                {technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.pending}>
                <span className={shared.badge}>{t.pending}</span>
                <span>{t.technologiesPending}</span>
              </p>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
