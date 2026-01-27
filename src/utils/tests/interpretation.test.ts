import type { EnrichedResult } from '../../types/enrichedResult';
import { getInterpretation } from '../interpretation';

const createResult = (status: 'low' | 'normal' | 'high', value: number): EnrichedResult => ({
  id: 'test-1',
  biomarkerId: 'bio-1',
  value,
  sampledAt: '2024-01-01',
  status,
  biomarker: {
    id: 'bio-1',
    name: 'Cholesterol',
    standardUnit: 'mg/dL',
    referenceRange: { low: 100, high: 200 },
    category: 'Lipids',
    importance: 8,
  },
});

describe('getInterpretation()', () => {
  it('returns message for low status', () => {
    const result = createResult('low', 80);
    const interpretation = getInterpretation(result);
    expect(interpretation).toContain('below the normal range');
  });

  it('returns message for normal status', () => {
    const result = createResult('normal', 150);
    const interpretation = getInterpretation(result);
    expect(interpretation).toContain('within the normal range');
  });

  it('returns message for high status', () => {
    const result = createResult('high', 250);
    const interpretation = getInterpretation(result);
    expect(interpretation).toContain('above the normal range');
  });

  it('includes biomarker name and value', () => {
    const result = createResult('normal', 150);
    const interpretation = getInterpretation(result);
    expect(interpretation).toContain('Cholesterol');
    expect(interpretation).toContain('150');
    expect(interpretation).toContain('mg/dL');
  });

  it('includes reference range', () => {
    const result = createResult('normal', 150);
    const interpretation = getInterpretation(result);
    expect(interpretation).toContain('100');
    expect(interpretation).toContain('200');
  });
});
