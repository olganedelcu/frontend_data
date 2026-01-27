import { useState, useMemo } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { Toolbar, type SortField, type SortDirection } from '../components/Toolbar';
import { ResultsTable } from '../components/ResultsTable';
import { DetailsDrawer } from '../components/DetailsDrawer';
import type { EnrichedResult } from '../types/enrichedResult';
import type { Status } from '../types/result';

export function BiomarkerResultsPage() {
  const { data, categories, isLoading, error } = useBiomarkerData();
  const { getNote, setNote } = useNotes();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedResult, setSelectedResult] = useState<EnrichedResult | null>(null);

  const toggleDirection = () => setSortDirection(d => d === 'asc' ? 'desc' : 'asc');

  const filteredData = useMemo(() => {
    let result = data;

    if (selectedCategory !== 'all') {
      result = result.filter(r => r.biomarker.category === selectedCategory);
    }
    if (selectedStatus !== 'all') {
      result = result.filter(r => r.status === selectedStatus);
    }

    const statusOrder = { low: 0, normal: 1, high: 2 };

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.biomarker.name.localeCompare(b.biomarker.name);
      if (sortField === 'value') cmp = a.value - b.value;
      if (sortField === 'status') cmp = statusOrder[a.status] - statusOrder[b.status];
      if (sortField === 'sampledAt') cmp = new Date(a.sampledAt).getTime() - new Date(b.sampledAt).getTime();
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, selectedCategory, selectedStatus, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Biomarker Results</h1>
          <p className="text-gray-500 mt-1">View and track your health biomarkers</p>
        </header>

        <Toolbar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDirection={sortDirection}
          onDirectionToggle={toggleDirection}
        />

        <div className="bg-white rounded-xl shadow-sm">
          <ResultsTable results={filteredData} onSelectResult={setSelectedResult} />
        </div>

        <DetailsDrawer
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
          note={selectedResult ? getNote(selectedResult.id) : ''}
          onSaveNote={setNote}
        />
      </div>
    </div>
  );
}
