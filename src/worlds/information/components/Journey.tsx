import { journeyLede, milestones } from '../data/journey';
import { delay } from '../motion';
import styles from './Journey.module.css';
import { Sparkle } from './celestial';
import Plate from './Plate';
import Section from './Section';
import shared from './Section.module.css';

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// Decorative star map (not a real constellation).
const STARS: [number, number][] = [[20, 140], [70, 90], [128, 112], [176, 50], [230, 78], [262, 24], [292, 120]];

export default function Journey() {
  const hasPlaceholders = milestones.some((m) => m.placeholder);

  return (
    <Section
      id="journey"
      number="02"
      kicker="Chronicle"
      title={
        <>
          My <em>Journey</em>
        </>
      }
      lede={hasPlaceholders ? 'Milestones below are placeholders until the creator supplies verified entries.' : <em>{journeyLede}</em>}
    >
      <svg className={styles.constellation} viewBox="0 0 312 160" aria-hidden="true" data-reveal="draw" style={delay(400)}>
        <polyline points={STARS.map((s) => s.join(',')).join(' ')} pathLength="1" />
        {STARS.map(([x, y], i) =>
          i % 3 === 0 ? <Sparkle key={i} x={x} y={y} r={11} i={i / 3} /> : <circle key={i} cx={x} cy={y} r={1.6} />,
        )}
      </svg>

      <div className={styles.timeline} data-scroll>
        <span className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} />
        </span>

        <ol className={styles.list}>
          {milestones.map((m, i) => (
            <li
              key={m.id}
              className={styles.item}
              data-side={i % 2 ? 'right' : 'left'}
              data-reveal="milestone"
              data-placeholder={m.placeholder ? '' : undefined}
              data-current={m.current ? '' : undefined}
              aria-current={m.current ? 'step' : undefined}
            >
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.connector} aria-hidden="true" />
              <div className={styles.text}>
                <p className={styles.meta}>
                  <span className={styles.period}>{m.period}</span>
                  {m.placeholder && <span className={shared.badge}>Placeholder</span>}
                  {m.current && <span className={shared.badge}>Now</span>}
                </p>
                <h3 className={styles.itemTitle}>{m.title}</h3>
                <div className={styles.desc} lang={m.lang}>
                  {m.description.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
                {m.note && <p className={styles.note}>{m.note}</p>}
              </div>
              <div className={styles.visual}>
                {m.image ? (
                  <div className={styles.media}>
                    <Plate photo={m.image} index={i + 2} />
                  </div>
                ) : (
                  <span className={styles.numeral} aria-hidden="true">
                    {NUMERALS[i] ?? i + 1}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <span className={styles.terminal} aria-hidden="true" data-reveal="vline" />
      </div>
    </Section>
  );
}
