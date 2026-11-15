import type { ComponentType } from 'react';

export const WORLD_IDS = ['information', 'production', 'character', 'wanderlight', 'ethereal'] as const;
export type WorldId = (typeof WORLD_IDS)[number];

export interface WorldMeta {
  id: WorldId;
  title: string;
  tagline: string;
  preview?: string;
  accent?: string;
}

export interface WorldDefinition extends WorldMeta {
  path: `/${WorldId}`;
  load: () => Promise<{ default: ComponentType }>;
}
