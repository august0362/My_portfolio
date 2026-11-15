import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import type { WorldDefinition } from '@shared/contract';
import BackToHub from './BackToHub';
import WorldErrorBoundary from './WorldErrorBoundary';
import usePageFocus from './usePageFocus';
import styles from '../App.module.css';

export default function WorldFrame({ world, children }: PropsWithChildren<{ world: WorldDefinition }>) {
  const mainRef = usePageFocus(world.title);
  const location = useLocation();

  return (
    <main className={styles.main} ref={mainRef} tabIndex={-1} aria-label={world.title}>
      <BackToHub />
      <WorldErrorBoundary key={location.key}>
        <Suspense fallback={<p role="status">Loading {world.title}…</p>}>
          {children}
        </Suspense>
      </WorldErrorBoundary>
    </main>
  );
}
