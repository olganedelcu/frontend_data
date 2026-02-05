import { RangeBar } from './RangeBar';
import type { EnrichedResult } from '../types/enrichedResult';

interface BiomarkerCardProps {
  result: EnrichedResult;
  onClick: () => void;
}

export function BiomarkerCard({ result, onClick }: BiomarkerCardProps) {
  const { biomarker, value, status } = result;
  const isAbnormal = status !== 'normal';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{biomarker.name}</h3>
          <p className="text-sm text-gray-500">{biomarker.category}</p>
        </div>
        {isAbnormal && (
          <div className="flex-shrink-0 ml-2">
            <svg
              className="w-5 h-5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-lg text-gray-500 ml-1">{biomarker.standardUnit}</span>
      </div>

      {/* Range Bar */}
      <RangeBar
        value={value}
        referenceRange={biomarker.referenceRange}
        unit={biomarker.standardUnit}
      />
    </button>
  );
}
