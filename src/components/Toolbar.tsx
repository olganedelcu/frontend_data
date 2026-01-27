import type { Status } from '../types/result';

export type SortField = 'name' | 'value' | 'status' | 'sampledAt';
export type SortDirection = 'asc' | 'desc';

interface Props {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: Status | 'all';
  onStatusChange: (status: Status | 'all') => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onDirectionToggle: () => void;
}

export function Toolbar({ categories, selectedCategory, onCategoryChange, selectedStatus, onStatusChange, sortField, onSortFieldChange, sortDirection, onDirectionToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Category</label>
        <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
          <option value="all">All</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Status</label>
        <select value={selectedStatus} onChange={e => onStatusChange(e.target.value as Status | 'all')} className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Sort by</label>
        <select value={sortField} onChange={e => onSortFieldChange(e.target.value as SortField)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
          <option value="name">Name</option>
          <option value="value">Value</option>
          <option value="status">Status</option>
          <option value="sampledAt">Date</option>
        </select>
      </div>

      <div className="flex items-end">
        <button onClick={onDirectionToggle} className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
          {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>
    </div>
  );
}
