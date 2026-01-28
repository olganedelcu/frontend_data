import { useState, useCallback } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { Toolbar, type SortField, type SortDirection } from '../components/Toolbar';
import { ResultsTable } from '../components/ResultsTable';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { useFilteredResults } from '../hooks/useFilteredResults';
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

  const handleToggleDirection = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const filteredData = useFilteredResults({
    data,
    category: selectedCategory,
    status: selectedStatus,
    sortField,
    sortDirection,
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

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
          onDirectionToggle={handleToggleDirection}
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
