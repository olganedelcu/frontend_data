import type { ReferenceRange } from '../types/biomarker';

interface RangeBarProps {
  value: number;
  referenceRange: ReferenceRange;
  unit: string;
}

export function RangeBar({ value, referenceRange, unit }: RangeBarProps) {
  const { low, high } = referenceRange;

  // define display range with padding for out-of-range values
  const rangeSpan = high - low;
  const padding = rangeSpan * 0.5;
  const displayMin = Math.min(low - padding, value - rangeSpan * 0.1);
  const displayMax = Math.max(high + padding, value + rangeSpan * 0.1);
  const displayRange = displayMax - displayMin;

  // calculate zone boundaries as percentages
  const lowZoneEnd = ((low - displayMin) / displayRange) * 100;
  const highZoneStart = ((high - displayMin) / displayRange) * 100;

  // calculate marker position (clamped to 0-100%)
  const markerPosition = Math.max(0, Math.min(100, ((value - displayMin) / displayRange) * 100));

  return (
    <div className="w-full">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        {/* below optimal */}
        <div
          className="bg-amber-300 h-full"
          style={{ width: `${lowZoneEnd}%` }}
        />
        {/* transition (low → optimal) */}
        <div
          className="bg-amber-200 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.15}%` }}
        />
        {/* pptimal zone */}
        <div
          className="bg-emerald-400 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.7}%` }}
        />
        {/* transition (optimal → high) */}
        <div
          className="bg-amber-200 h-full"
          style={{ width: `${(highZoneStart - lowZoneEnd) * 0.15}%` }}
        />
        {/* above optimal */}
        <div
          className="bg-amber-300 h-full flex-1"
        />
      </div>

      {/* marker */}
      <div className="relative h-4 -mt-1">
        <div
          className="absolute w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow-md transform -translate-x-1/2"
          style={{ left: `${markerPosition}%`, top: '-2px' }}
        />
      </div>

      {/* scale labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{low} {unit}</span>
        <span>{high} {unit}</span>
      </div>
    </div>
  );
}
