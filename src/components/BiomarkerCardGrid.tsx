import { BiomarkerCard } from './BiomarkerCard';
import type { EnrichedResult } from '../types/enrichedResult';

interface BiomarkerCardGridProps {
  results: EnrichedResult[];
  onSelectResult: (result: EnrichedResult) => void;
}

export function BiomarkerCardGrid({ results, onSelectResult }: BiomarkerCardGridProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No biomarkers match your current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {results.map((result) => (
        <BiomarkerCard
          key={result.id}
          result={result}
          onClick={() => onSelectResult(result)}
        />
      ))}
    </div>
  );
}
