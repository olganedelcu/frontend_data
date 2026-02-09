import { useState, useCallback } from 'react';

const STORAGE_KEY = 'biomarker-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const save = useCallback((updated: Record<string, string>) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const getNote = (id: string) => notes[id] || '';
  const setNote = (id: string, note: string) => save({ ...notes, [id]: note });

  return { getNote, setNote };
}
