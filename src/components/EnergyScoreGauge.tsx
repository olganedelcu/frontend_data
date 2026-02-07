import { useEffect, useState } from 'react';
import type { EnergyScoreResult } from '../types/energyScore';

interface EnergyScoreGaugeProps {
  energyScore: EnergyScoreResult;
}

export function EnergyScoreGauge({ energyScore }: EnergyScoreGaugeProps) {
  const { score, grade, label } = energyScore;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
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

  // Ring dimensions
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Progress arc
  const displayScore = isVisible ? animatedScore : 0;
  const progress = (displayScore / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 75) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-100 ease-out"
            opacity={0.8}
          />
        </svg>
        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <span className="text-4xl font-bold text-gray-800">{animatedScore}</span>
          <span className="text-xs font-medium text-gray-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <div
        className="text-center mt-3 transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: getColor() }}
        >
          {label}
        </span>
        <span className="text-sm text-gray-300 mx-1.5">·</span>
        <span className="text-sm text-gray-400">Grade {grade}</span>
      </div>
    </div>
  );
}
