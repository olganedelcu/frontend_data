import type { EnrichedResult } from '../types/enrichedResult';
import type { EnergyScoreResult, Grade, GradeLabel } from '../types/energyScore';

function getGrade(score: number): { grade: Grade; label: GradeLabel } {
  if (score >= 90) return { grade: 'A', label: 'EXCELLENT' };
  if (score >= 75) return { grade: 'B', label: 'GOOD' };
  if (score >= 60) return { grade: 'C', label: 'FAIR' };
  if (score >= 40) return { grade: 'D', label: 'POOR' };
  return { grade: 'F', label: 'CRITICAL' };
}

export function calculateEnergyScore(results: EnrichedResult[]): EnergyScoreResult {
  if (results.length === 0) {
    return { score: 0, grade: 'F', label: 'CRITICAL' };
  }

  let weightedSum = 0;
  let totalImportance = 0;

  for (const result of results) {
    const statusScore = result.status === 'normal' ? 100 : 0;
    const importance = result.biomarker.importance;
    weightedSum += statusScore * importance;
    totalImportance += importance;
  }

  const score = totalImportance > 0 ? Math.round(weightedSum / totalImportance) : 0;
  const { grade, label } = getGrade(score);

  return { score, grade, label };
}
