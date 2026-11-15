import { Route, Routes } from 'react-router';
import { useSettings } from '@shared/settings';
import Overview from './components/Overview';
import ProjectDetail from './components/ProjectDetail';
import ProjectNotFound from './components/ProjectNotFound';
import styles from './Production.module.css';
import theme from './Theme.module.css';

export default function ProductionWorld() {
  const { settings } = useSettings();
  return (
    <div className={`${styles.world} ${theme.theme}`} data-palette={settings.palette} data-appearance={settings.appearance}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path=":slug" element={<ProjectDetail />} />
        <Route path="*" element={<ProjectNotFound />} />
      </Routes>
    </div>
  );
}
