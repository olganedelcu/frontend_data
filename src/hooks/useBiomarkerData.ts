import { useState, useEffect } from 'react';
import type { Biomarker } from '../types/biomarker';
import type { Result } from '../types/result';
import type { EnrichedResult } from '../types/enrichedResult';

interface State {
  data: EnrichedResult[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

export function useBiomarkerData(): State {
  const [state, setState] = useState<State>({
    data: [],
    categories: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise(r => setTimeout(r, 500)); // Simulate delay

        const [biomarkers, results]: [Biomarker[], Result[]] = await Promise.all([
          fetch('/api/biomarkers.json').then(r => r.json()),
          fetch('/api/results.json').then(r => r.json()),
        ]);

        const biomarkerMap = new Map(biomarkers.map(b => [b.id, b]));

        setState({
          data: results
            .map(r => ({ ...r, biomarker: biomarkerMap.get(r.biomarkerId)! }))
            .filter(r => r.biomarker),
          categories: [...new Set(biomarkers.map(b => b.category))].sort(),
          isLoading: false,
          error: null,
        });
      } catch {
        setState(s => ({ ...s, isLoading: false, error: 'Failed to load data' }));
      }
    };

    load();
  }, []);

  return state;
}
