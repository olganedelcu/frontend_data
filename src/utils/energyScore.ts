import type { EnrichedResult } from '../types/enrichedResult';
import { getDeviation } from './status';

export interface EnergyScoreResult {
  score: number;
  label: string;
}

function getLabel(score: number): string {
  if (score >= 85) return 'You\'re doing great';
  if (score >= 70) return 'You\'re on a good track';
  if (score >= 50) return 'A few areas could be improved';
  if (score >= 30) return 'Some results could be improved';
  return 'There are opportunities to improve';
}

/** Keep only the most recent result per biomarker. */
export function dedupeByLatest(results: EnrichedResult[]): EnrichedResult[] {
  const latest = new Map<string, EnrichedResult>();
  for (const r of results) {
    const existing = latest.get(r.biomarkerId);
    if (!existing || r.sampledAt > existing.sampledAt) {
      latest.set(r.biomarkerId, r);
    }
  }
  return [...latest.values()];
}

/**
 * Gradient scoring per result:
 * - Inside range: 80–100 (closer to midpoint = higher)
 * - Outside range: linear falloff from 80 → 0
 */
function scoreResult(r: EnrichedResult): number {
  const deviation = getDeviation(r);
  if (deviation <= 1) return Math.round(100 - deviation * 20);
  const overshoot = deviation - 1;
  return Math.round(Math.max(0, 80 - overshoot * 40));
}

export function calculateEnergyScore(results: EnrichedResult[]): EnergyScoreResult {
  if (results.length === 0) return { score: 0, label: 'No data' };

  const latest = dedupeByLatest(results);
  let weightedSum = 0;
  let totalImportance = 0;

  for (const r of latest) {
    const importance = r.biomarker.importance;
    weightedSum += scoreResult(r) * importance;
    totalImportance += importance;
  }

  const score = totalImportance > 0 ? Math.round(weightedSum / totalImportance) : 0;
  return { score, label: getLabel(score) };
}
