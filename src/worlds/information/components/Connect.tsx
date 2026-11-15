import { useCopy } from '@shared/i18n';
import { identity } from '../data/identity';
import { COPY } from '../data/locale';
import { delay } from '../motion';
import styles from './Connect.module.css';
import SwapText from './SwapText';
import { ArcSparkle, CORNER, CrescentMark } from './celestial';
import CvSheet from './CvSheet';
import Section from './Section';
import shared from './Section.module.css';

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

export default function Connect({ reduced }: { reduced: boolean }) {
  const t = useCopy(COPY);
  const { github, facebook, email } = identity.publicContacts;
  const links = [
    { label: 'GitHub', value: strip(github), href: github, external: true },
    { label: 'Facebook', value: strip(facebook), href: facebook, external: true },
    { label: 'Email', value: email, href: `mailto:${email}`, external: false },
  ];

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    document.getElementById('identity-title')?.focus({ preventScroll: true });
  };

  return (
    <Section
      id="connect"
      number="05"
      kicker={t.connectKicker}
      title={
        <>
          {t.connectTitle[0]}<em>{t.connectTitle[1]}</em>
        </>
      }
    >
      <ArcSparkle className={CORNER} />

      <div className={styles.layout}>
        <CvSheet reduced={reduced} />

        <ul className={styles.links}>
          {links.map((l, i) => (
            <li key={l.label} data-reveal="up" style={delay(i * 120)}>
              <a
                className={styles.link}
                data-swap-host
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className={styles.linkLabel}>{l.label}</span>
                <SwapText className={styles.linkValue}>{l.value}</SwapText>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
                {l.external && <span className={shared.srOnly}> {t.newTab}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.footer}>
        <CrescentMark className={styles.mark} />
        <p className={styles.sign}>
          {identity.profile.displayName} <span aria-hidden="true">·</span> {t.sign}
        </p>
        <button type="button" className={styles.top} onClick={toTop}>
          {t.backToTop} <span aria-hidden="true">↑</span>
        </button>
      </footer>
    </Section>
  );
}
