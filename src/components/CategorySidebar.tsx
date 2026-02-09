import { useMemo } from 'react';
import type { EnrichedResult } from '../types/enrichedResult';

interface Props {
  categories: string[];
  data: EnrichedResult[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  Lipids: '💧',
  Metabolic: '⚡',
  Kidney: '🫘',
  Electrolytes: '⚖️',
  Liver: '🟤',
  Inflammation: '🔥',
  Iron: '🩸',
  Vitamins: '☀️',
  Thyroid: '🦋',
  Blood: '❤️',
};

export function CategorySidebar({ categories, data, selectedCategory, onCategoryChange }: Props) {
  const { categoryCounts, totalAttention } = useMemo(() => {
    const counts: Record<string, { total: number; attention: number }> = {};
    let attention = 0;
    for (const r of data) {
      const cat = r.biomarker.category;
      if (!counts[cat]) counts[cat] = { total: 0, attention: 0 };
      counts[cat].total++;
      if (r.status !== 'normal') {
        counts[cat].attention++;
        attention++;
      }
    }
    return { categoryCounts: counts, totalAttention: attention };
  }, [data]);

  return (
    <nav className="w-56 shrink-0">
      <div className="sticky top-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Categories
        </p>

        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="font-medium">All Results</span>
          <span className={`text-xs ${selectedCategory === 'all' ? 'text-gray-300' : 'text-gray-400'}`}>
            {data.length}
          </span>
        </button>

        {totalAttention > 0 && (
          <button
            onClick={() => onCategoryChange('attention')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${
              selectedCategory === 'attention'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="font-medium">Could Be Improved</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              selectedCategory === 'attention'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {totalAttention}
            </span>
          </button>
        )}

        <div className="h-px bg-gray-100 my-3" />

        {categories.map(cat => {
          const counts = categoryCounts[cat] || { total: 0, attention: 0 };
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors mb-0.5 ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{categoryIcons[cat] || '📊'}</span>
                <span className={isActive ? 'font-medium' : ''}>{cat}</span>
              </span>
              <span className="flex items-center gap-1.5">
                {counts.attention > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
                <span className={`text-xs ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                  {counts.total}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
