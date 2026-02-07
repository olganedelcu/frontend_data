import { useMemo } from 'react';
import type { EnrichedResult } from '../types/enrichedResult';
import type { SortField, SortDirection } from '../types/toolbar';
import type { Status } from '../types/result';

interface FilterOptions {
  data: EnrichedResult[];
  category: string;
  status: Status | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
}

const statusOrder: Record<Status, number> = { low: 0, normal: 1, high: 2 };

export function useFilteredResults({
  data,
  category,
  status,
  sortField,
  sortDirection,
}: FilterOptions) {
  return useMemo(() => {
    let filtered = data;

    if (category !== 'all') {
      filtered = filtered.filter(r => r.biomarker.category === category);
    }

    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }

    return [...filtered].sort((a, b) => {
      let cmp = 0;

      if (sortField === 'name') {
        cmp = a.biomarker.name.localeCompare(b.biomarker.name);
      } else if (sortField === 'value') {
        cmp = a.value - b.value;
      } else if (sortField === 'status') {
        cmp = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortField === 'sampledAt') {
        cmp = new Date(a.sampledAt).getTime() - new Date(b.sampledAt).getTime();
      }

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, category, status, sortField, sortDirection]);
}
