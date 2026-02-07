import { useState, useCallback, useMemo } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { useFilteredResults } from '../hooks/useFilteredResults';
import { calculateEnergyScore } from '../utils/energyScore';
import { Toolbar } from '../components/Toolbar';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { EnergyScoreGauge } from '../components/EnergyScoreGauge';
import { BiomarkerCardGrid } from '../components/BiomarkerCardGrid';
import { CategorySidebar } from '../components/CategorySidebar';
import type { SortField, SortDirection } from '../types/toolbar';
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
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const isAttentionMode = selectedCategory === 'attention';

  const filteredData = useFilteredResults({
    data: isAttentionMode ? data.filter(r => r.status !== 'normal') : data,
    category: isAttentionMode ? 'all' : selectedCategory,
    status: isAttentionMode ? 'all' : selectedStatus,
    sortField,
    sortDirection,
  });

  const energyScore = useMemo(() => calculateEnergyScore(data), [data]);

  const stats = useMemo(() => {
    const inRange = data.filter(r => r.status === 'normal').length;
    return { inRange, needAttention: data.length - inRange };
  }, [data]);

  const formattedDate = useMemo(() => {
    if (data.length === 0) return '';
    return new Date(data[0].sampledAt).toLocaleDateString('en-US', {
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
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Health Overview</h1>
            {formattedDate && (
              <p className="text-sm text-gray-400 mt-0.5">{formattedDate}</p>
            )}
          </div>
        </header>

        <div className="flex gap-10">
          <CategorySidebar
            categories={categories}
            data={data}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 mb-8">
              <div className="flex items-center gap-10">
                <EnergyScoreGauge energyScore={energyScore} />
                <div className="text-sm text-gray-500 leading-relaxed">
                  <span className="font-semibold text-emerald-600">{stats.inRange}</span> markers in range
                  {stats.needAttention > 0 && (
                    <>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span className="font-semibold text-amber-600">{stats.needAttention}</span> need attention
                    </>
                  )}
                </div>
              </div>
            </div>

            <Toolbar
              selectedStatus={isAttentionMode ? 'all' : selectedStatus}
              onStatusChange={setSelectedStatus}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDirection={sortDirection}
              onDirectionToggle={handleToggleDirection}
              resultCount={filteredData.length}
            />

            <BiomarkerCardGrid
              results={filteredData}
              onSelectResult={setSelectedResult}
            />
          </main>
        </div>
      </div>

      <DetailsDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
        note={selectedResult ? getNote(selectedResult.id) : ''}
        onSaveNote={setNote}
      />
    </div>
  );
}
