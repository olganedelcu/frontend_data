import { useState, useCallback } from 'react';

// stores and recoveres values from localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const save = useCallback((newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, save] as const;
}

// manages stored notes by id(like a diccionario)
export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('biomarker-notes', {});

  const getNote = (id: string) => notes[id] || '';
  const setNote = (id: string, note: string) => {
    setNotes({ ...notes, [id]: note });
  };

  return { getNote, setNote };
}
