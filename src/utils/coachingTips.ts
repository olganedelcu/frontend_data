import type { EnrichedResult } from '../types/enrichedResult';

const CATEGORY_TIPS: Record<string, { low: string; high: string }> = {
  Lipids: {
    low: 'Improving this can support healthy cell function and energy.',
    high: 'Optimizing this can support heart and vascular wellness.',
  },
  Metabolic: {
    low: 'This marker plays a role in how your body processes energy.',
    high: 'Improving this can help with energy balance and metabolism.',
  },
  Kidney: {
    low: 'This reflects how well your body filters and balances fluids.',
    high: 'Optimizing this can support kidney function and hydration.',
  },
  Electrolytes: {
    low: 'Electrolyte balance affects energy, muscles, and hydration.',
    high: 'Balancing this can help with energy levels and muscle function.',
  },
  Liver: {
    low: 'This marker reflects how your body processes nutrients.',
    high: 'Improving this can support your body\'s natural detox process.',
  },
  Inflammation: {
    low: 'This marker reflects your body\'s immune and recovery activity.',
    high: 'Lowering inflammation can improve energy and recovery.',
  },
  Iron: {
    low: 'Iron supports oxygen transport and energy production.',
    high: 'Balancing iron levels can support overall vitality.',
  },
  Vitamins: {
    low: 'This vitamin supports immunity, energy, and daily well-being.',
    high: 'Balancing this vitamin can support long-term wellness.',
  },
  Thyroid: {
    low: 'Thyroid function influences metabolism and energy levels.',
    high: 'Optimizing thyroid markers can improve energy and focus.',
  },
  Blood: {
    low: 'This marker affects oxygen delivery and overall energy.',
    high: 'Balancing this can support healthy circulation and vitality.',
  },
};

const FALLBACK = {
  low: 'Improving this marker may support your overall well-being.',
  high: 'Optimizing this marker may support your overall well-being.',
};

export function getCoachingTip(result: EnrichedResult): string {
  const { category } = result.biomarker;
  const direction = result.status === 'high' ? 'high' : 'low';
  const tips = CATEGORY_TIPS[category] || FALLBACK;
  return tips[direction];
}
