import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import type { WorldDefinition } from '@shared/contract';
import { useLanguage } from '@shared/i18n';
import { SHELL_COPY, WORLD_NAMES } from '../copy';
import BackToPortal from './BackToPortal';
import WorldErrorBoundary from './WorldErrorBoundary';
import usePageFocus from './usePageFocus';
import styles from '../App.module.css';

export default function WorldFrame({ world, children }: PropsWithChildren<{ world: WorldDefinition }>) {
  const language = useLanguage();
  const name = WORLD_NAMES[world.id][language];
  const mainRef = usePageFocus(name);
  const location = useLocation();

  return (
    <main className={styles.main} ref={mainRef} tabIndex={-1} aria-label={name}>
      <BackToPortal />
      <WorldErrorBoundary key={location.key}>
        <Suspense fallback={<p role="status">{SHELL_COPY.loading[language]} {name}…</p>}>
          {children}
        </Suspense>
      </WorldErrorBoundary>
    </main>
  );
}
