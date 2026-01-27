export interface ReferenceRange {
  low: number;
  high: number;
}

export interface Biomarker {
  id: string;
  name: string;
  standardUnit: string;
  referenceRange: ReferenceRange;
  category: string;
  importance: number;
}
