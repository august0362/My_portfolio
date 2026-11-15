import type { WorldMeta } from '@shared/contract';

// Static on purpose: the registry loads every meta.ts into the main chunk, so this file must not import
// the theme or data modules. information.test.ts checks these values still match them.
const meta: WorldMeta = {
  id: 'information',
  title: 'Chronicle',
  tagline: 'Building ideas into reality, and imagination into worlds.',
  accent: '#bca5d4',
};

export default meta;
