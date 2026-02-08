import type { EnrichedResult } from '../types/enrichedResult';
import { getSeverity, getSeverityStyle, getStatusLabel } from '../utils/status';

export function StatusBadge({ result }: { result: EnrichedResult }) {
  const severity = getSeverity(result);
  const style = getSeverityStyle(severity);
  const label = getStatusLabel(result.status, severity);

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
}
