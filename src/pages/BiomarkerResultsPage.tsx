import { useState } from 'react';
import { useBiomarkerData } from '../hooks/useBiomarkerData';
import { useNotes } from '../hooks/useNotes';
import { useDashboard } from '../hooks/useDashboard';
import { useResultFilters } from '../hooks/useResultFilters';
import { HeroSection } from '../components/HeroSection';
import { Toolbar } from '../components/Toolbar';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { BiomarkerCard } from '../components/BiomarkerCard';
import { CategorySidebar } from '../components/CategorySidebar';
import type { EnrichedResult } from '../types/enrichedResult';

export function BiomarkerResultsPage() {
  const { data: rawData, categories, isLoading, error } = useBiomarkerData();
  const { getNote, setNote } = useNotes();
  const { data, energyScore, priorityItems, stats, formattedDate } = useDashboard(rawData);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResult, setSelectedResult] = useState<EnrichedResult | null>(null);
  const { filteredData, toolbarProps } = useResultFilters(data, selectedCategory);

  const allResultsForBiomarker = selectedResult
    ? rawData.filter(r => r.biomarkerId === selectedResult.biomarkerId)
    : [];

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Your Energy Report 🤗</h1>
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
            <HeroSection
              energyScore={energyScore}
              stats={stats}
              priorityItems={selectedCategory === 'all' || selectedCategory === 'attention' ? priorityItems : []}
              onSelectResult={setSelectedResult} // select result 
              onViewAll={() => setSelectedCategory('all')}
            />

            <Toolbar {...toolbarProps} />

            {filteredData.length === 0 ? (
              <p className="text-center py-16 text-gray-400">No biomarkers match your current filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredData.map(r => (
                  <BiomarkerCard key={r.id} result={r} onClick={() => setSelectedResult(r)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <DetailsDrawer
        result={selectedResult}
        allResults={allResultsForBiomarker}
        onClose={() => setSelectedResult(null)}
        note={selectedResult ? getNote(selectedResult.id) : ''}
        onSaveNote={setNote}
      />
    </div>
  );
}
