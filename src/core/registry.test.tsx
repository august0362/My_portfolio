import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import { WORLD_IDS } from '@shared/contract';
import { SettingsProvider } from '@shared/settings';
import { WORLDS } from './registry';

test('registers exactly the approved worlds with unique matching routes', () => {
  expect(WORLD_IDS).toEqual(['information', 'production', 'character', 'wanderlight', 'ethereal']);
  const ids = WORLDS.map((world) => world.id);
  expect(ids).toEqual([...WORLD_IDS]);
  expect(new Set(ids).size).toBe(WORLDS.length);
  for (const world of WORLDS) expect(world.path).toBe(`/${world.id}`);
});

test.each(WORLDS)('$id lazy entry resolves to a renderable component', async (world) => {
  const entry = await world.load();
  expect(entry.default).toBeDefined();
  expect(() => renderToStaticMarkup(
    <MemoryRouter initialEntries={[world.path]}>
      <SettingsProvider>{createElement(entry.default)}</SettingsProvider>
    </MemoryRouter>,
  )).not.toThrow();
});
