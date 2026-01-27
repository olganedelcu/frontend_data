import type { EnrichedResult } from '../types/enrichedResult';
import { StatusBadge } from './StatusBadge';
import { NoteEditor } from './NoteEditor';
import { getInterpretation } from '../utils/interpretation';

interface Props {
  result: EnrichedResult | null;
  onClose: () => void;
  note: string;
  onSaveNote: (resultId: string, note: string) => void;
}

export function DetailsDrawer({ result, onClose, note, onSaveNote }: Props) {
  if (!result) return null;

  const { biomarker, value, status, sampledAt } = result;
  const { name, category, standardUnit, referenceRange } = biomarker;
  const date = new Date(sampledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto rounded-l-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm text-gray-500">{category}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Your Result</p>
            <p className="text-2xl font-semibold">{value} <span className="text-base font-normal text-gray-500">{standardUnit}</span></p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">Reference Range</p>
            <p className="font-medium">{referenceRange.low}–{referenceRange.high} {standardUnit}</p>
          </div>
          <div>
            <p className="text-gray-500">Sampled</p>
            <p className="font-medium">{date}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Interpretation</p>
          <p className="text-gray-700 leading-relaxed">{getInterpretation(result)}</p>
        </div>

        <NoteEditor key={result.id} resultId={result.id} initialValue={note} onSave={onSaveNote} />
      </div>
    </>
  );
}
