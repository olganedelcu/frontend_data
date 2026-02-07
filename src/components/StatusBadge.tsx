import type { Status } from '../types/result';
import { STATUS_CONFIG } from '../utils/status';

export function StatusBadge({ status }: { status: Status }) {
  const { bg, text, label } = STATUS_CONFIG[status];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
