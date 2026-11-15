import { Outlet, useLocation } from 'react-router';
import { WORLDS } from '../registry';
import { useSettings } from '@shared/settings';
import SettingsControls from './SettingsControls';
import useCelestialAudio from './useCelestialAudio';
import useSceneTransition from './useSceneTransition';
import transitionStyles from './SceneTransition.module.css';
import styles from '../App.module.css';
import './appearance.css';

export default function AppShell() {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const isHub = pathname === '/';
  // Worlds are full-bleed: each one owns its layout below the floating Back to Hub link.
  const isWorld = WORLDS.some(world => pathname === world.path || pathname.startsWith(`${world.path}/`));
  const audioStatus = useCelestialAudio();
  const { shellRef, sceneRef, waterRef } = useSceneTransition(settings.motion === 'reduced');

  return (
    <div ref={shellRef} className={`${styles.app} ${isHub ? styles.portal : ''} ${isWorld ? styles.world : ''}`} data-motion={settings.motion} data-quality={settings.quality}>
      <div ref={sceneRef} className={transitionStyles.scene}>
        {!isHub && !isWorld && <header><p className={styles.brand}>Celestial Portal</p></header>}
        <Outlet />
      </div>
      <SettingsControls audioStatus={audioStatus} />
      <div ref={waterRef} className={transitionStyles.water} aria-hidden="true" />
    </div>
  );
}
