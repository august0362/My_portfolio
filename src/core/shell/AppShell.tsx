import { Outlet, useLocation } from 'react-router';
import { useSettings } from '@shared/settings';
import SettingsControls from './SettingsControls';
import useCelestialAudio from './useCelestialAudio';
import styles from '../App.module.css';
import './appearance.css';

export default function AppShell() {
  const { settings } = useSettings();
  const isHub = useLocation().pathname === '/';
  const audioStatus = useCelestialAudio();

  return (
    <div className={`${styles.app} ${isHub ? styles.portal : ''}`} data-motion={settings.motion} data-quality={settings.quality}>
      {!isHub && <header><p className={styles.brand}>Celestial Portal</p></header>}
      <Outlet />
      <SettingsControls audioStatus={audioStatus} />
    </div>
  );
}
