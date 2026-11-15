import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { WORLDS } from './registry';
import HubNav from './hub/HubNav';
import AppShell from './shell/AppShell';
import NotFound from './shell/NotFound';
import WorldFrame from './shell/WorldFrame';

// Keep lazy component identities stable across navigation and settings changes.
const worldRoutes = WORLDS.map((world) => ({ world, Entry: lazy(world.load) }));

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HubNav />} />
        {worldRoutes.map(({ world, Entry }) => (
          <Route
            key={world.id}
            path={`${world.path}/*`}
            element={<WorldFrame key={world.id} world={world}><Entry /></WorldFrame>}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
