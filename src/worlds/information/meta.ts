import type { WorldMeta } from '@shared/contract';

// Static on purpose: the registry loads every meta.ts into the main chunk, so this file must not import
// the theme or data modules. information.test.ts checks these values still match them.
const meta: WorldMeta = {
  id: 'information',
  title: 'Chronicle',
  tagline: 'Building ideas into reality, and imagination into worlds.',
  accent: '#8d91b5',
};

export default meta;
