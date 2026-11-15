import { identity } from './identity';

/** Lead-confirmed professional fields. No proficiency levels by design. */
export const fields = identity.profile.professionalFields;

/**
 * Detailed technologies. Empty until the Lead confirms a list
 * (a candidate list exists in the private CV and must not be copied without approval).
 */
export const technologies: readonly string[] = [];
