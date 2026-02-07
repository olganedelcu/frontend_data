import { useState, useCallback, useMemo } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { Toolbar, type SortField, type SortDirection } from '../components/Toolbar';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { EnergyScoreGauge } from '../components/EnergyScoreGauge';
import { BiomarkerCardGrid } from '../components/BiomarkerCardGrid';
import { CategorySidebar } from '../components/CategorySidebar';
import { useFilteredResults } from '../hooks/useFilteredResults';
import { calculateEnergyScore } from '../utils/energyScore';
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

  // When "attention" is selected in sidebar, filter to abnormal status
  const effectiveCategory = selectedCategory === 'attention' ? 'all' : selectedCategory;
  const effectiveStatus = selectedCategory === 'attention' ? 'all' : selectedStatus;

  const filteredData = useFilteredResults({
    data: selectedCategory === 'attention' ? data.filter(r => r.status !== 'normal') : data,
    category: effectiveCategory,
    status: effectiveStatus,
    sortField,
    sortDirection,
  });

  const energyScore = useMemo(() => calculateEnergyScore(data), [data]);

  const stats = useMemo(() => {
    const inRange = data.filter((r) => r.status === 'normal').length;
    const needAttention = data.length - inRange;
    return { inRange, needAttention, total: data.length };
  }, [data]);

  const formattedDate = useMemo(() => {
    if (data.length === 0) return '';
    const date = new Date(data[0].sampledAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Health Overview</h1>
            {formattedDate && (
              <p className="text-sm text-gray-400 mt-0.5">{formattedDate}</p>
            )}
          </div>
        </header>

        {/* Desktop layout: sidebar + content */}
        <div className="flex gap-10">
          {/* Left sidebar */}
          <CategorySidebar
            categories={categories}
            data={data}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Score + Summary row */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              <div className="flex items-center gap-12">
                <EnergyScoreGauge energyScore={energyScore} />

                <div className="flex-1">
                  <h2 className="text-sm font-medium text-gray-400 mb-4">Summary</h2>
                  <div className="flex gap-6">
                    <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-emerald-600">{stats.inRange}</p>
                      <p className="text-xs text-emerald-600/70 mt-1">In Range</p>
                    </div>
                    <div className="flex-1 bg-amber-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-amber-600">{stats.needAttention}</p>
                      <p className="text-xs text-amber-600/70 mt-1">Need Attention</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
                      <p className="text-xs text-gray-400 mt-1">Total Markers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <Toolbar
              selectedStatus={selectedCategory === 'attention' ? 'all' : selectedStatus}
              onStatusChange={setSelectedStatus}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDirection={sortDirection}
              onDirectionToggle={handleToggleDirection}
              resultCount={filteredData.length}
            />

            {/* Results grid */}
            <BiomarkerCardGrid
              results={filteredData}
              onSelectResult={setSelectedResult}
            />
          </main>
        </div>
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
        note={selectedResult ? getNote(selectedResult.id) : ''}
        onSaveNote={setNote}
      />
    </div>
  );
}
