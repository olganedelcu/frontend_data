import { useEffect, useState } from 'react';
import type { EnergyScoreResult } from '../utils/energyScore';

interface Props {
  energyScore: EnergyScoreResult;
}

const COLOR = '#10B981';
const SIZE = 140;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function EnergyScoreGauge({ energyScore }: Props) {
  const { score } = energyScore;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [score]);

  const progress = ((isVisible ? animatedScore : 0) / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={COLOR} strokeWidth={STROKE} opacity={0.12}
          />
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={COLOR} strokeWidth={STROKE}
            strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            className="transition-all duration-100 ease-out"
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <span className="text-3xl font-bold text-gray-800">{animatedScore}</span>
          <span className="text-[10px] text-gray-400 mt-0.5">Energy Index</span>
        </div>
      </div>
    </div>
  );
}
