import type { EnrichedResult } from '../types/enrichedResult';

const messages = {
  low: 'is below the normal range. Low values may indicate a deficiency. Consider discussing with your healthcare provider.',
  normal: 'is within the normal range. This indicates healthy function.',
  high: 'is above the normal range. Elevated values may warrant further evaluation. Consult with your healthcare provider.',
};

export function getInterpretation(result: EnrichedResult): string {
  const { status, value, biomarker } = result;
  const { name, standardUnit, referenceRange } = biomarker;

  return `Your ${name} level of ${value} ${standardUnit} ${messages[status]} (Reference: ${referenceRange.low}–${referenceRange.high} ${standardUnit})`;
}
