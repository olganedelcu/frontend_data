import type { EnrichedResult } from '../types/enrichedResult';

const messages = {
  low: 'is slightly below the optimal range. This is common and can often be improved with small lifestyle adjustments. Discuss options with your health advisor.',
  normal: 'is within the optimal range — a positive sign for your overall well-being.',
  high: 'is slightly above the optimal range. This may be influenced by diet, activity, or other factors. Your health advisor can help you explore simple next steps.',
};

export function getInterpretation(result: EnrichedResult): string {
  const { status, value, biomarker } = result;
  const { name, standardUnit, referenceRange } = biomarker;

  return `Your ${name} level of ${value} ${standardUnit} ${messages[status]} (Optimal range: ${referenceRange.low}–${referenceRange.high} ${standardUnit})`;
}
