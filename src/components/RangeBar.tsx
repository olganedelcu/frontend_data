import type { ReferenceRange } from '../types/biomarker';

interface RangeBarProps {
  value: number;
  referenceRange: ReferenceRange;
  unit: string;
}

export function RangeBar({ value, referenceRange, unit }: RangeBarProps) {
  const { low, high } = referenceRange;

  // Define display range with padding for out-of-range values
  const rangeSpan = high - low;
  const padding = rangeSpan * 0.5;
  const displayMin = Math.min(low - padding, value - rangeSpan * 0.1);
  const displayMax = Math.max(high + padding, value + rangeSpan * 0.1);
  const displayRange = displayMax - displayMin;

  // Calculate zone boundaries as percentages
  const lowZoneEnd = ((low - displayMin) / displayRange) * 100;
  const highZoneStart = ((high - displayMin) / displayRange) * 100;

  // Calculate marker position (clamped to 0-100%)
  const markerPosition = Math.max(0, Math.min(100, ((value - displayMin) / displayRange) * 100));

  return (
    <div className="w-full">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        {/* Below optimal */}
        <div
          className="bg-amber-300 h-full"
          style={{ width: `${lowZoneEnd}%` }}
        />
        {/* Transition (low → optimal) */}
        <div
          className="bg-amber-200 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.15}%` }}
        />
        {/* Optimal zone */}
        <div
          className="bg-emerald-400 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.7}%` }}
        />
        {/* Transition (optimal → high) */}
        <div
          className="bg-amber-200 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.15}%` }}
        />
        {/* Above optimal */}
        <div
          className="bg-amber-300 h-full flex-1"
        />
      </div>

      {/* Marker */}
      <div className="relative h-4 -mt-1">
        <div
          className="absolute w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow-md transform -translate-x-1/2"
          style={{ left: `${markerPosition}%`, top: '-2px' }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{low} {unit}</span>
        <span>{high} {unit}</span>
      </div>
    </div>
  );
}
