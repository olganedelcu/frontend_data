import type { Status } from '../types/result';

const styles: Record<Status, string> = {
  low: 'bg-blue-50 text-blue-600',
  normal: 'bg-emerald-50 text-emerald-600',
  high: 'bg-red-50 text-red-600',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
