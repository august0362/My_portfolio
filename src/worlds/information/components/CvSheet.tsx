import { useRef } from 'react';
import { cv, SHOW_GRADES } from '../data/cv';
import { delay } from '../motion';
import { useTiltVars } from '../sensor';
import styles from './CvSheet.module.css';

/** The public CV as a sheet of paper that leans with the tilt sensor. Built from data, no file link. */
export default function CvSheet({ reduced }: { reduced: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTiltVars(stageRef, !reduced);
  const { education } = cv;

  return (
    <div ref={stageRef} className={styles.stage} data-reveal="up" style={delay(120)}>
      <article className={styles.sheet} aria-labelledby="cv-name" lang="en">
        <span className={styles.glare} aria-hidden="true" />

        <header className={styles.head}>
          <p className={styles.kicker}>Curriculum Vitae</p>
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
              <h4 className={styles.heading}>Profile Summary</h4>
              <p className={styles.summary}>{cv.summary}</p>
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>Selected Projects</h4>
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
              <h4 className={styles.heading}>Academic Recognition</h4>
              {cv.recognition.map((r) => (
                <p key={r.title} className={styles.award}>
                  <strong>{r.title}</strong> <span>· {r.detail}</span>
                </p>
              ))}
            </section>
          </div>

          <aside className={styles.side}>
            <section className={styles.block}>
              <h4 className={styles.heading}>Contact</h4>
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
              <h4 className={styles.heading}>Education</h4>
              <p className={styles.school}>{education.institution}</p>
              <p className={styles.muted}>{education.university}</p>
              <p className={styles.muted}>
                {education.program} <span aria-hidden="true">|</span> {education.expected}
              </p>
              {SHOW_GRADES && (
                <p className={styles.gpa}>
                  <span>Cumulative GPA</span>
                  <strong>{education.gpa}</strong>
                </p>
              )}
            </section>

            <section className={styles.block}>
              <h4 className={styles.heading}>Technical Skills</h4>
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
              <h4 className={styles.heading}>Selected Coursework</h4>
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
              <h4 className={styles.heading}>Languages</h4>
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
