import type { Status } from '../types/result';

const styles: Record<Status, string> = {
  low: 'bg-blue-100 text-blue-700',
  normal: 'bg-green-100 text-green-700',
  high: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-1 rounded-lg text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
