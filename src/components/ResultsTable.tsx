import type { EnrichedResult } from '../types/enrichedResult';
import { StatusBadge } from './StatusBadge';

interface Props {
  results: EnrichedResult[];
  onSelectResult: (result: EnrichedResult) => void;
}

export function ResultsTable({ results, onSelectResult }: Props) {
  if (!results.length) {
    return <div className="text-center py-12 text-gray-500">No results found.</div>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 text-left text-sm font-medium text-gray-600">
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Value</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Range</th>
          <th className="px-4 py-3">Category</th>
        </tr>
      </thead>
      <tbody>
        {results.map(result => (
          <tr key={result.id} onClick={() => onSelectResult(result)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
            <td className="px-4 py-3 font-medium">{result.biomarker.name}</td>
            <td className="px-4 py-3 text-gray-700">{result.value} {result.biomarker.standardUnit}</td>
            <td className="px-4 py-3"><StatusBadge status={result.status} /></td>
            <td className="px-4 py-3 text-gray-500">{result.biomarker.referenceRange.low}–{result.biomarker.referenceRange.high}</td>
            <td className="px-4 py-3 text-gray-500">{result.biomarker.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
