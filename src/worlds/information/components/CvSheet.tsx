import { useRef } from 'react';
import { useCopy, useLanguage } from '@shared/i18n';
import { SHOW_GRADES } from '../data/cv';
import { COPY, localizedCv } from '../data/locale';
import { delay } from '../motion';
import { useTiltVars } from '../sensor';
import styles from './CvSheet.module.css';

/** The public CV as a sheet of paper that leans with the tilt sensor. Built from data, no file link. */
export default function CvSheet({ reduced }: { reduced: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTiltVars(stageRef, !reduced);
  const language = useLanguage();
  const t = useCopy(COPY);
  const cv = localizedCv(language);
  const { education } = cv;

  return (
    <div ref={stageRef} className={styles.stage} data-reveal="up" style={delay(120)}>
      <article className={styles.sheet} aria-labelledby="cv-name" lang={language}>
        <span className={styles.glare} aria-hidden="true" />

        <header className={styles.head}>
          <p className={styles.kicker}>{t.cvKicker}</p>
          <h3 id="cv-name" className={styles.name}>
            {cv.name}
          </h3>
          <p className={styles.focus}>{cv.focus}</p>
          <p className={styles.meta}>
            <span>{cv.standing}</span>
            <span>{cv.school}</span>
          </p>
        </header>

        <div className={styles.body}>
          <div className={styles.main}>
            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvSummary}</h4>
              <p className={styles.summary}>{cv.summary}</p>
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvProjects}</h4>
              {cv.projects.map((p) => (
                <div key={p.title} className={styles.project}>
                  <h5 className={styles.projectTitle}>{p.title}</h5>
                  <p className={styles.projectRole}>{p.role}</p>
                  <p className={styles.stack}>{p.stack.join(' · ')}</p>
                  <ul className={styles.points}>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvRecognition}</h4>
              {cv.recognition.map((r) => (
                <p key={r.title} className={styles.award}>
                  <strong>{r.title}</strong> <span>· {r.detail}</span>
                </p>
              ))}
            </section>
          </div>

          <aside className={styles.side}>
            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvContact}</h4>
              <dl className={styles.pairs}>
                {cv.contact.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd>
                      {'href' in c ? (
                        <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {c.value}
                        </a>
                      ) : (
                        c.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvEducation}</h4>
              <p className={styles.school}>{education.institution}</p>
              <p className={styles.muted}>{education.university}</p>
              <p className={styles.muted}>
                {education.program} <span aria-hidden="true">|</span> {education.expected}
              </p>
              {SHOW_GRADES && (
                <p className={styles.gpa}>
                  <span>{t.cvGpa}</span>
                  <strong>{education.gpa}</strong>
                </p>
              )}
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvSkills}</h4>
              <dl className={styles.pairs}>
                {cv.skills.map((s) => (
                  <div key={s.group}>
                    <dt>{s.group}</dt>
                    <dd>{s.items.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvCoursework}</h4>
              <ul className={styles.courses}>
                {cv.coursework.map((c) => (
                  <li key={c.course}>
                    <span>{c.course}</span>
                    {SHOW_GRADES && <strong>{c.grade}</strong>}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>{t.cvLanguages}</h4>
              {cv.languages.map((l) => (
                <p key={l} className={styles.muted}>
                  {l}
                </p>
              ))}
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}
