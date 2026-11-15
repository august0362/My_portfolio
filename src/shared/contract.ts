// World module contract v1. FROZEN at GATE-1 (Lead approval, 2026-11-15).
// Do not change these types or WORLD_IDS without a Core change request (docs/AGENT_RULES.md §8);
// any approved change must update every affected world in the same integration step.
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
