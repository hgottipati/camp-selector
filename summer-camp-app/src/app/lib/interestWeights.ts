import type { MatchScores } from '../data/campgrounds';

export const WEIGHT_KEY_META = [
  { id: 'scenery' as const, label: 'Epic views & scenery' },
  { id: 'water' as const, label: 'Water fun (swim, paddle, boat)' },
  { id: 'peace' as const, label: 'Nature vibe (less “RV resort”)' },
  { id: 'drive' as const, label: 'Shorter drive from Bothell' },
] as const;

export type WeightId = (typeof WEIGHT_KEY_META)[number]['id'];

export type WeightState = Record<WeightId, number>;

export function defaultWeights(): WeightState {
  return {
    scenery: 50,
    water: 50,
    peace: 50,
    drive: 50,
  };
}

/** Weighted average of 1–10 sub-scores; weights are 0–100 per axis. */
export function computeMatchScore(matchScores: MatchScores, weights: WeightState): number {
  let num = 0;
  let den = 0;
  for (const { id } of WEIGHT_KEY_META) {
    const w = weights[id];
    num += w * matchScores[id];
    den += w;
  }
  if (den === 0) return 0;
  return Math.round((num / den) * 10) / 10;
}
