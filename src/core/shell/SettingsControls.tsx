import { useSettings } from '@shared/settings';
import type { Settings } from '@shared/settings';
import styles from '../App.module.css';

export default function SettingsControls() {
  const { settings, setSettings } = useSettings();

  return (
    <details className={styles.settings}>
      <summary>Settings</summary>
      <fieldset>
        <legend>Experience preferences</legend>
        <div className={styles.setting}>
          <label htmlFor="setting-motion">Motion</label>
          <select
            id="setting-motion"
            value={settings.motion}
            onChange={(event) => setSettings((current) => ({ ...current, motion: event.target.value as Settings['motion'] }))}
          >
            <option value="full">Full</option>
            <option value="reduced">Reduced</option>
          </select>
        </div>
        <div className={styles.setting}>
          <label htmlFor="setting-quality">Quality</label>
          <select
            id="setting-quality"
            value={settings.quality}
            onChange={(event) => setSettings((current) => ({ ...current, quality: event.target.value as Settings['quality'] }))}
          >
            <option value="full">Full</option>
            <option value="lite">Lite</option>
            <option value="static">Static</option>
          </select>
        </div>
        <label>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(event) => setSettings((current) => ({ ...current, sound: event.target.checked }))}
          />
          Sound
        </label>
      </fieldset>
    </details>
  );
}
