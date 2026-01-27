import { useState, useCallback } from 'react';

export function useLocalStorage<Value>(key: string, initialValue: Value) {
  const [storedValue, setStoredValue] = useState<Value>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = useCallback((value: Value | ((prev: Value) => Value)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('biomarker-notes', {});

  const getNote = useCallback((id: string) => notes[id] || '', [notes]);
  const setNote = useCallback((id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }));
  }, [setNotes]);

  return { getNote, setNote };
}
