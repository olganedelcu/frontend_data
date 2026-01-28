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
        await new Promise(result => setTimeout(result, 500)); // Simulate delay

        const [biomarkers, results]: [Biomarker[], Result[]] = await Promise.all([
          fetch('/api/biomarkers.json').then(result => result.json()),
          fetch('/api/results.json').then(result => result.json()),
        ]);

        const biomarkerMap = new Map(biomarkers.map(biomarker => [biomarker.id, biomarker]));

        setState({
          data: results
            .map(result => ({ ...result, biomarker: biomarkerMap.get(result.biomarkerId)! }))
            .filter(result => result.biomarker),
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
