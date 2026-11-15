import { Route, Routes } from 'react-router';
import Overview from './components/Overview';
import ProjectDetail from './components/ProjectDetail';
import ProjectNotFound from './components/ProjectNotFound';
import styles from './Production.module.css';

export default function ProductionWorld() {
  return (
    <div className={styles.world}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path=":slug" element={<ProjectDetail />} />
        <Route path="*" element={<ProjectNotFound />} />
      </Routes>
    </div>
  );
}
