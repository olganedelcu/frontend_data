import { useState, useCallback, useMemo } from 'react';
import type { EnrichedResult } from '../types/enrichedResult';
import type { Status } from '../types/result';

export type SortField = 'name' | 'value' | 'status' | 'sampledAt';
export type SortDirection = 'asc' | 'desc';

export interface ToolbarProps {
  selectedStatus: Status | 'all';
  onStatusChange: (status: Status | 'all') => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onDirectionToggle: () => void;
  resultCount: number;
}

const statusOrder: Record<Status, number> = { low: 0, normal: 1, high: 2 };

function filterAndSort(
  data: EnrichedResult[],
  category: string,
  status: Status | 'all',
  sortField: SortField,
  sortDirection: SortDirection,
): EnrichedResult[] {
  let filtered = data;

  if (category !== 'all') {
    filtered = filtered.filter(r => r.biomarker.category === category);
  }
  if (status !== 'all') {
    filtered = filtered.filter(r => r.status === status);
  }

  return [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'name') cmp = a.biomarker.name.localeCompare(b.biomarker.name);
    else if (sortField === 'value') cmp = a.value - b.value;
    else if (sortField === 'status') cmp = statusOrder[a.status] - statusOrder[b.status];
    else if (sortField === 'sampledAt') cmp = new Date(a.sampledAt).getTime() - new Date(b.sampledAt).getTime();
    return sortDirection === 'asc' ? cmp : -cmp;
  });
}

export function useResultFilters(data: EnrichedResult[], selectedCategory: string) {
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleToggleDirection = useCallback(() => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const isAttentionMode = selectedCategory === 'attention';
  const sourceData = isAttentionMode ? data.filter(r => r.status !== 'normal') : data;
  const effectiveStatus = isAttentionMode ? 'all' as const : selectedStatus;
  const effectiveCategory = isAttentionMode ? 'all' : selectedCategory;

  const filteredData = useMemo(
    () => filterAndSort(sourceData, effectiveCategory, effectiveStatus, sortField, sortDirection),
    [sourceData, effectiveCategory, effectiveStatus, sortField, sortDirection],
  );

  const toolbarProps: ToolbarProps = {
    selectedStatus: effectiveStatus,
    onStatusChange: setSelectedStatus,
    sortField,
    onSortFieldChange: setSortField,
    sortDirection,
    onDirectionToggle: handleToggleDirection,
    resultCount: filteredData.length,
  };

  return { filteredData, toolbarProps };
}
