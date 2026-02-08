import type { Status } from '../types/result';
import type { EnrichedResult } from '../types/enrichedResult';

export type Severity = 'normal' | 'mild' | 'severe';

interface StatusStyle {
  dot: string;
  text: string;
  bg: string;
  label: string;
}

/** How far the value is from the reference range midpoint, normalized by half-span. */
export function getDeviation(r: EnrichedResult): number {
  const { low, high } = r.biomarker.referenceRange;
  const mid = (low + high) / 2;
  const halfSpan = (high - low) / 2;
  if (halfSpan === 0) return r.value === mid ? 0 : 2;
  return Math.abs(r.value - mid) / halfSpan;
}

/** Severity based on how far from range — not just in/out. */
export function getSeverity(r: EnrichedResult): Severity {
  if (r.status === 'normal') return 'normal';
  const deviation = getDeviation(r);
  // > 1.5x half-span from midpoint = severe (meaningfully outside range)
  return deviation > 1.8 ? 'severe' : 'mild';
}

const SEVERITY_STYLES: Record<Severity, StatusStyle> = {
  normal: { dot: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Normal' },
  mild:   { dot: 'bg-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50',   label: 'Slightly off' },
  severe: { dot: 'bg-red-400',     text: 'text-red-600',     bg: 'bg-red-50',     label: 'Out of range' },
};

/** Get display label for a status+severity. */
export function getStatusLabel(status: Status, severity: Severity): string {
  if (severity === 'normal') return 'Normal';
  if (severity === 'mild') return status === 'high' ? 'Slightly high' : 'Slightly low';
  return status === 'high' ? 'High' : 'Low';
}

export function getSeverityStyle(severity: Severity): StatusStyle {
  return SEVERITY_STYLES[severity];
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
