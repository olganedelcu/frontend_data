import type { EnrichedResult } from '../types/enrichedResult';

interface BiomarkerCardProps {
  result: EnrichedResult;
  onClick: () => void;
}

const statusConfig = {
  normal: { dot: 'bg-emerald-400', text: 'text-emerald-600', label: 'Normal' },
  high: { dot: 'bg-red-400', text: 'text-red-600', label: 'High' },
  low: { dot: 'bg-blue-400', text: 'text-blue-600', label: 'Low' },
};

export function BiomarkerCard({ result, onClick }: BiomarkerCardProps) {
  const { biomarker, value, status } = result;
  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 group"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-[15px] group-hover:text-gray-700">
          {biomarker.name}
        </h3>
        <div className={`flex items-center gap-1.5 ${config.text}`}>
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-xs font-medium">{config.label}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400">{biomarker.standardUnit}</span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        {biomarker.referenceRange.low}–{biomarker.referenceRange.high} {biomarker.standardUnit}
      </div>
    </button>
  );
}
