import type { ReactNode } from 'react';
import { delay } from '../motion';
import { MOOD, sectionStyle, useTheme, type SectionId } from '../theme';
import Ambient from './Ambient';
import styles from './Section.module.css';

interface Props {
  id: Exclude<SectionId, 'identity'>;
  number: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  waves?: boolean;
  className?: string;
  children: ReactNode;
}

/** Section shell: scheme variables, blended seam, ambient layer and editorial header. */
export default function Section({ id, number, kicker, title, lede, waves, className, children }: Props) {
  const theme = useTheme();
  const tone = theme.schemes[id].tone;
  return (
    <section
      id={id}
      className={`${styles.section} ${className ?? ''}`}
      style={sectionStyle(theme, id)}
      data-tone={tone}
      aria-labelledby={`${id}-title`}
    >
      <Ambient mood={MOOD[id]} tone={tone} waves={waves} />
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow} data-reveal="fade">
            <span className={styles.num}>{number}</span>
            <span className={styles.rule} data-reveal="line" style={delay(200)} />
            <span>{kicker}</span>
          </p>
          <h2 id={`${id}-title`} className={styles.title} tabIndex={-1} data-reveal="up" style={delay(120)}>
            {title}
          </h2>
          {lede && (
            <p className={styles.lede} data-reveal="up" style={delay(260)}>
              {lede}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
