import { BiomarkerCard } from './BiomarkerCard';
import type { EnrichedResult } from '../types/enrichedResult';

interface BiomarkerCardGridProps {
  results: EnrichedResult[];
  onSelectResult: (result: EnrichedResult) => void;
}

export function BiomarkerCardGrid({ results, onSelectResult }: BiomarkerCardGridProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No biomarkers match your current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
