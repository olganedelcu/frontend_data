import { useMemo } from 'react';
import type { EnrichedResult } from '../types/enrichedResult';
import type { SortField, SortDirection } from '../components/Toolbar';
import type { Status } from '../types/result';

interface FilterOptions {
  data: EnrichedResult[];
  category: string;
  status: Status | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
}

const statusOrder = { low: 0, normal: 1, high: 2 };

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
      let comparisonResult = 0;

      if (sortField === 'name') {
        comparisonResult = a.biomarker.name.localeCompare(b.biomarker.name);
      } else if (sortField === 'value') {
        comparisonResult = a.value - b.value;
      } else if (sortField === 'status') {
        comparisonResult = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortField === 'sampledAt') {
        comparisonResult = new Date(a.sampledAt).getTime() - new Date(b.sampledAt).getTime();
      }

      return sortDirection === 'asc' ? comparisonResult : -comparisonResult;
    });
  }, [data, category, status, sortField, sortDirection]);
}
