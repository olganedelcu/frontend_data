import type { EnrichedResult } from '../types/enrichedResult';
import { getResultDisplay } from '../utils/status';
import { RangeBar } from './RangeBar';
import { NoteEditor } from './NoteEditor';
import { getInterpretation } from '../utils/interpretation';
import { formatDate } from '../utils/format';

interface Props {
  results: EnrichedResult[];
  onClose: () => void;
  note: string;
  onSaveNote: (resultsId: string, note: string) => void;
}

export function DetailsDrawer({ results, onClose, note, onSaveNote }: Props) {
  if (results.length === 0) return null;
  const { biomarker } = results[0];
  const { name, category, standardUnit, referenceRange } = biomarker;

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
          <p className="text-xs text-gray-400">Your results</p>
          {results.map(r => {
            const display = getResultDisplay(r);
            return (
              <div key={r.id} className="bg-gray-50 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{formatDate(r.sampledAt)}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {r.value}
                      <span className="text-base font-normal text-gray-400 ml-1">{standardUnit}</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${display.style.bg} ${display.style.text}`}>
                    {display.label}
                  </span>
                </div>
                <RangeBar value={r.value} referenceRange={referenceRange} unit={standardUnit} />
              </div>
            );
          })}

          <div>
            <p className="text-xs text-gray-400 mb-2">What this means</p>
            <p className="text-sm text-gray-600 leading-relaxed">{getInterpretation(results[0])}</p>
          </div>

          <NoteEditor key={results[0].id} resultId={results[0].id} initialValue={note} onSave={onSaveNote} />
        </div>
      </div>
    </>
  );
}
