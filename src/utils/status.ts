import type { Status } from '../types/result';
import type { EnrichedResult } from '../types/enrichedResult';

type Severity = 'normal' | 'mild' | 'severe';

interface StatusStyle {
  dot: string;
  text: string;
  bg: string;
}

/** How far the value is from the reference range midpoint, normalized by half-span. */
export function getDeviation(r: EnrichedResult): number {
  const { low, high } = r.biomarker.referenceRange;
  const mid = (low + high) / 2;
  const halfSpan = (high - low) / 2;
  if (halfSpan === 0) return r.value === mid ? 0 : 2;
  return Math.abs(r.value - mid) / halfSpan;
}

function getSeverity(r: EnrichedResult): Severity {
  if (r.status === 'normal') return 'normal';
  return getDeviation(r) > 1.8 ? 'severe' : 'mild';
}

const SEVERITY_STYLES: Record<Severity, StatusStyle> = {
  normal: { dot: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  mild:   { dot: 'bg-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50' },
  severe: { dot: 'bg-red-400',     text: 'text-red-600',     bg: 'bg-red-50' },
};

function getStatusLabel(status: Status, severity: Severity): string {
  if (severity === 'normal') return 'In range';
  if (severity === 'mild') return status === 'high' ? 'Slightly above optimal' : 'Slightly below optimal';
  return status === 'high' ? 'Above optimal range' : 'Below optimal range';
}

export type IndicatorIcon = 'dot' | 'arrow-up' | 'arrow-down';

export interface ResultDisplay {
  severity: Severity;
  style: StatusStyle;
  label: string;
  icon: IndicatorIcon;
}

/** Single call replaces getSeverity + getSeverityStyle + getStatusLabel. */
export function getResultDisplay(r: EnrichedResult): ResultDisplay {
  const severity = getSeverity(r);
  let icon: IndicatorIcon = 'dot';
  if (severity === 'severe') icon = r.status === 'high' ? 'arrow-up' : 'arrow-down';

  return {
    severity,
    style: SEVERITY_STYLES[severity],
    label: getStatusLabel(r.status, severity),
    icon,
  };
}
