import type { EnrichedResult } from '../types/enrichedResult';
import type { EnergyScoreResult } from '../utils/energyScore';
import { EnergyScoreGauge } from './EnergyScoreGauge';
import { getResultDisplay } from '../utils/status';
import { getCoachingTip } from '../utils/coachingTips';
import { SeverityIndicator } from './SeverityIndicator';

interface Props {
  energyScore: EnergyScoreResult;
  stats: { inRange: number; improvable: number };
  priorityItems: EnrichedResult[];
  onSelectResult: (result: EnrichedResult) => void;
  onViewAll: () => void;
}

export function HeroSection({ energyScore, stats, priorityItems, onSelectResult, onViewAll }: Props) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-8 mb-8">
        <div className="flex items-start gap-10">
          <EnergyScoreGauge energyScore={energyScore} />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{energyScore.label}</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Your results give you a snapshot of where you stand. Most values are close to optimal, and even small changes can make a difference.
            </p>

            <div className="flex gap-3 mt-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg text-sm text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {stats.inRange} in optimal range
              </span>
              {stats.improvable > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-sm text-amber-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {stats.improvable} could be improved
                </span>
              )}
            </div>

            {priorityItems.length > 0 && (
              <div className="flex items-center gap-4 mt-5">
                <a href="#priority" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                  See where to start
                </a>
                <button onClick={onViewAll} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  See all results
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-5 leading-relaxed">
              Your results are a guide, not a diagnosis. They're designed to help you and your health advisor focus on what matters most.
            </p>
          </div>
        </div>
      </div>

      {priorityItems.length > 0 && (
        <div id="priority" className="mb-8 scroll-mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Your top opportunities</h3>
          <div className="space-y-2">
            {priorityItems.map(r => {
              const display = getResultDisplay(r);
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectResult(r)}
                  className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SeverityIndicator display={display} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.biomarker.name}</p>
                      <p className="text-xs text-gray-400">
                        {r.value} {r.biomarker.standardUnit}
                        <span className="mx-1">·</span>
                        optimal {r.biomarker.referenceRange.low}–{r.biomarker.referenceRange.high}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{getCoachingTip(r)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ml-4 ${display.style.text}`}>{display.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
