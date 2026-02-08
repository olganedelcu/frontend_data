import { useState, useCallback, useMemo } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useLocalStorage';
import { useFilteredResults } from '../hooks/useFilteredResults';
import { calculateEnergyScore, dedupeByLatest } from '../utils/energyScore';
import { getDeviation, getSeverity, getSeverityStyle, getStatusLabel } from '../utils/status';
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

const MAX_PRIORITY_ITEMS = 5;

export function BiomarkerResultsPage() {
  const { data: rawData, categories, isLoading, error } = useBiomarkerData();
  const { getNote, setNote } = useNotes();

  // Default to latest results only
  const data = useMemo(() => dedupeByLatest(rawData), [rawData]);

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

  const energyScore = useMemo(() => calculateEnergyScore(rawData), [rawData]);

  // Priority items: abnormal, ranked by importance * deviation
  const priorityItems = useMemo(() => {
    return data
      .filter(r => r.status !== 'normal')
      .sort((a, b) => {
        const scoreA = a.biomarker.importance * getDeviation(a);
        const scoreB = b.biomarker.importance * getDeviation(b);
        return scoreB - scoreA;
      })
      .slice(0, MAX_PRIORITY_ITEMS);
  }, [data]);

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
            {/* Hero */}
            <div className="bg-white rounded-2xl border border-gray-100 px-8 py-8 mb-8">
              <div className="flex items-start gap-10">
                <EnergyScoreGauge energyScore={energyScore} />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {energyScore.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Most results are only slightly outside the normal range. This view helps you focus on what matters first.
                  </p>

                  {/* Summary chips */}
                  <div className="flex gap-3 mt-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg text-sm text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {stats.inRange} in range
                    </span>
                    {stats.needAttention > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-sm text-amber-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {stats.needAttention} out of range
                      </span>
                    )}
                  </div>

                  {/* CTAs */}
                  {priorityItems.length > 0 && (
                    <div className="flex items-center gap-4 mt-5">
                      <a href="#priority" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                        Review priority items
                      </a>
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        See all results
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                    Results are informational and meant to help guide conversations with your clinician.
                  </p>
                </div>
              </div>
            </div>

            {/* Priority — "Focus here first" */}
            {priorityItems.length > 0 && (
              <div id="priority" className="mb-8 scroll-mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Focus here first</h3>
                <div className="space-y-2">
                  {priorityItems.map(r => {
                    const severity = getSeverity(r);
                    const style = getSeverityStyle(severity);
                    const label = getStatusLabel(r.status, severity);
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedResult(r)}
                        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{r.biomarker.name}</p>
                            <p className="text-xs text-gray-400">
                              {r.value} {r.biomarker.standardUnit}
                              <span className="mx-1">·</span>
                              range {r.biomarker.referenceRange.low}–{r.biomarker.referenceRange.high}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium shrink-0 ml-4 ${style.text}`}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Toolbar + Grid */}
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
