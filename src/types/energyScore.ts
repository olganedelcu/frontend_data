export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export type GradeLabel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

export interface EnergyScoreResult {
  score: number;
  grade: Grade;
  label: GradeLabel;
}
