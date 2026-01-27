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
        <label className="text-sm font-medium text-gray-700">Notes</label>
        {status !== 'idle' && (
          <span className={`text-xs ${status === 'saving' ? 'text-gray-400' : 'text-green-600'}`}>
            {status === 'saving' ? 'Saving...' : 'Saved'}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Add notes..."
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
      />
    </div>
  );
}
