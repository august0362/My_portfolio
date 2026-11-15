import { Outlet } from 'react-router';
import { useSettings } from '@shared/settings';
import SettingsControls from './SettingsControls';
import styles from '../App.module.css';

export default function AppShell() {
  const { settings } = useSettings();

  return (
    <div className={styles.app} data-motion={settings.motion} data-quality={settings.quality}>
      <header><p className={styles.brand}>Möbius Universe</p></header>
      <Outlet />
      <SettingsControls />
    </div>
  );
}
