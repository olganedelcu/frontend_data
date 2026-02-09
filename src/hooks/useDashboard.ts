import { useMemo } from 'react';
import type { EnrichedResult } from '../types/enrichedResult';
import type { EnergyScoreResult } from '../utils/energyScore';
import { calculateEnergyScore, dedupeByLatest } from '../utils/energyScore';
import { getDeviation } from '../utils/status';
import { formatDate } from '../utils/format';

const MAX_PRIORITY_ITEMS = 5;

interface DashboardData {
  data: EnrichedResult[];
  energyScore: EnergyScoreResult;
  priorityItems: EnrichedResult[];
  stats: { inRange: number; improvable: number };
  formattedDate: string;
}

export function useDashboard(rawData: EnrichedResult[]): DashboardData {
  const data = useMemo(() => dedupeByLatest(rawData), [rawData]);

  const energyScore = useMemo(() => calculateEnergyScore(rawData), [rawData]);

  const priorityItems = useMemo(() => {
    return data
      .filter(r => r.status !== 'normal')
      .sort((a, b) => {
        const scoreA = a.biomarker.importance * getDeviation(a);
        const scoreB = b.biomarker.importance * getDeviation(b);
        return scoreB - scoreA;
      })
      .slice(0, MAX_PRIORITY_ITEMS);
  }, [data]);

  const stats = useMemo(() => {
    const inRange = data.filter(r => r.status === 'normal').length;
    return { inRange, improvable: data.length - inRange };
  }, [data]);

  const formattedDate = useMemo(() => {
    if (data.length === 0) return '';
    return formatDate(data[0].sampledAt);
  }, [data]);

  return { data, energyScore, priorityItems, stats, formattedDate };
}
