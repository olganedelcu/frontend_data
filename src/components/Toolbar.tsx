import type { ToolbarProps, SortField } from '../hooks/useResultFilters';

const STATUS_LABELS: Record<string, string> = {
  all: 'All',
  normal: 'In range',
  low: 'Below optimal',
  high: 'Above optimal',
};

const STATUS_OPTIONS = ['all', 'normal', 'low', 'high'] as const;

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'value', label: 'Value' },
  { value: 'status', label: 'Status' },
  { value: 'sampledAt', label: 'Date' },
];

export function Toolbar({ selectedStatus, onStatusChange, sortField, onSortFieldChange, sortDirection, onDirectionToggle, resultCount }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-gray-400">
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedStatus === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-2">
          <select
            value={sortField}
            onChange={e => onSortFieldChange(e.target.value as SortField)}
            className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={onDirectionToggle}
            className="p-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
