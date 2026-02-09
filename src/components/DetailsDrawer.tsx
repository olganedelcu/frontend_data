import type { EnrichedResult } from '../types/enrichedResult';
import { getResultDisplay } from '../utils/status';
import { RangeBar } from './RangeBar';
import { NoteEditor } from './NoteEditor';
import { getInterpretation } from '../utils/interpretation';
import { formatDate } from '../utils/format';

interface Props {
  result: EnrichedResult | null;
  onClose: () => void;
  note: string;
  onSaveNote: (resultId: string, note: string) => void;
}

export function DetailsDrawer({ result, onClose, note, onSaveNote }: Props) {
  if (!result) return null;

  const { biomarker, value, sampledAt } = result;
  const { name, category, standardUnit, referenceRange } = biomarker;
  const { style, label } = getResultDisplay(result);
  const date = formatDate(sampledAt);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto rounded-l-3xl">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{category}</p>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Close">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Your Result</p>
                <p className="text-3xl font-bold text-gray-900">
                  {value}
                  <span className="text-base font-normal text-gray-400 ml-1">{standardUnit}</span>
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
                {label}
              </span>
            </div>
            <RangeBar value={value} referenceRange={referenceRange} unit={standardUnit} />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Sampled</p>
            <p className="text-sm font-medium text-gray-900">{date}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">What this means</p>
            <p className="text-sm text-gray-600 leading-relaxed">{getInterpretation(result)}</p>
          </div>

          <NoteEditor key={result.id} resultId={result.id} initialValue={note} onSave={onSaveNote} />
        </div>
      </div>
    </>
  );
}
