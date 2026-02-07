import { useState, useRef } from 'react';

interface Props {
  resultId: string;
  initialValue: string;
  onSave: (resultId: string, note: string) => void;
}

export function NoteEditor({ resultId, initialValue, onSave }: Props) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeout = useRef<number>(0);

  const handleChange = (text: string) => {
    setValue(text);
    setStatus('saving');
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      onSave(resultId, text);
      setStatus('saved');
    }, 500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs text-gray-400">Notes</label>
        {status !== 'idle' && (
          <span className={`text-xs ${status === 'saving' ? 'text-gray-300' : 'text-emerald-500'}`}>
            {status === 'saving' ? 'Saving...' : 'Saved'}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Add notes about this result..."
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-300"
      />
    </div>
  );
}
