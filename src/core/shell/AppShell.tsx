import { Outlet, useLocation } from 'react-router';
import { useSettings } from '@shared/settings';
import SettingsControls from './SettingsControls';
import styles from '../App.module.css';

export default function AppShell() {
  const { settings } = useSettings();
  const isHub = useLocation().pathname === '/';

  return (
    <div className={`${styles.app} ${isHub ? styles.portal : ''}`} data-motion={settings.motion} data-quality={settings.quality}>
      {!isHub && <header><p className={styles.brand}>Celestial Portal</p></header>}
      <Outlet />
      <SettingsControls />
    </div>
  );
}
