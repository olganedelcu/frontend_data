import type { Biomarker } from './biomarker';
import type { Result } from './result';

export interface EnrichedResult extends Result {
  biomarker: Biomarker;
}
