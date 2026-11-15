import type { WorldDefinition } from '@shared/contract';
import information from '@worlds/information/meta';
import production from '@worlds/production/meta';
import character from '@worlds/character/meta';
import wanderlight from '@worlds/wanderlight/meta';
import ethereal from '@worlds/ethereal/meta';

export const WORLDS: readonly WorldDefinition[] = [
  { ...information, path: '/information', load: () => import('@worlds/information') },
  { ...production, path: '/production', load: () => import('@worlds/production') },
  { ...character, path: '/character', load: () => import('@worlds/character') },
  { ...wanderlight, path: '/wanderlight', load: () => import('@worlds/wanderlight') },
  { ...ethereal, path: '/ethereal', load: () => import('@worlds/ethereal') },
];
