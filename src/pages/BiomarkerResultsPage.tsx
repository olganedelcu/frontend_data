import { useState, useCallback, useMemo } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { Toolbar, type SortField, type SortDirection } from '../components/Toolbar';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { EnergyScoreGauge } from '../components/EnergyScoreGauge';
import { BiomarkerCardGrid } from '../components/BiomarkerCardGrid';
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

  const filteredData = useFilteredResults({
    data,
    category: selectedCategory,
    status: selectedStatus,
    sortField,
    sortDirection,
  });

  // Calculate energy score from all data (not filtered)
  const energyScore = useMemo(() => calculateEnergyScore(data), [data]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const inRange = data.filter((r) => r.status === 'normal').length;
    const needAttention = data.length - inRange;
    return { inRange, needAttention };
  }, [data]);

  // Format date from the first result's sampledAt
  const formattedDate = useMemo(() => {
    if (data.length === 0) return '';
    const date = new Date(data[0].sampledAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Your Health Overview</h1>
          {formattedDate && (
            <p className="text-gray-500 mt-1">Results from {formattedDate}</p>
          )}
        </header>

        {/* Energy Score Gauge */}
        <div className="flex justify-center mb-8">
          <EnergyScoreGauge energyScore={energyScore} />
        </div>

        {/* Summary Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              <span className="font-semibold">{stats.inRange}</span> In Range
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              <span className="font-semibold">{stats.needAttention}</span> Need Attention
            </span>
          </div>
        </div>

        {/* Toolbar */}
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

        {/* Biomarker Cards Grid */}
        <div className="mt-6">
          <BiomarkerCardGrid
            results={filteredData}
            onSelectResult={setSelectedResult}
          />
        </div>

        {/* Details Drawer */}
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
