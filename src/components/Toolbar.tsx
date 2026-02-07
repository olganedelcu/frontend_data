import type { Status } from '../types/result';

export type SortField = 'name' | 'value' | 'status' | 'sampledAt';
export type SortDirection = 'asc' | 'desc';

interface Props {
  selectedStatus: Status | 'all';
  onStatusChange: (status: Status | 'all') => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onDirectionToggle: () => void;
  resultCount: number;
}

export function Toolbar({ selectedStatus, onStatusChange, sortField, onSortFieldChange, sortDirection, onDirectionToggle, resultCount }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-gray-400">
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-2">
        {/* Status filter pills */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {(['all', 'normal', 'low', 'high'] as const).map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedStatus === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 ml-2">
          <select
            value={sortField}
            onChange={e => onSortFieldChange(e.target.value as SortField)}
            className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white"
          >
            <option value="name">Name</option>
            <option value="value">Value</option>
            <option value="status">Status</option>
            <option value="sampledAt">Date</option>
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
