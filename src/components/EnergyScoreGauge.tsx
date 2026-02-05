import type { EnergyScoreResult } from '../types/energyScore';

interface EnergyScoreGaugeProps {
  energyScore: EnergyScoreResult;
}

export function EnergyScoreGauge({ energyScore }: EnergyScoreGaugeProps) {
  const { score, grade, label } = energyScore;

  // SVG dimensions
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Arc calculations (semi-circle from 180° to 0°)
  const circumference = Math.PI * radius;

  // Zone angles (in the semi-circle)
  // Red: 0-39 (39% of arc), Yellow: 40-74 (35% of arc), Green: 75-100 (25% of arc)
  const redArc = circumference * 0.39;
  const yellowArc = circumference * 0.35;
  const greenArc = circumference * 0.26;

  // Score indicator position
  const scoreAngle = Math.PI * (1 - score / 100);
  const indicatorX = center + radius * Math.cos(scoreAngle);
  const indicatorY = center - radius * Math.sin(scoreAngle);

  // Get color based on score
  const getScoreColor = () => {
    if (score >= 75) return '#10B981'; // emerald-500
    if (score >= 40) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc segments */}
        <g transform={`rotate(180, ${center}, ${center})`}>
          {/* Green zone (75-100) - drawn first, starts at the right */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#10B981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${greenArc} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* Yellow zone (40-74) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            strokeDasharray={`${yellowArc} ${circumference}`}
            strokeDashoffset={-greenArc}
            strokeLinecap="butt"
          />
          {/* Red zone (0-39) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#EF4444"
            strokeWidth={strokeWidth}
            strokeDasharray={`${redArc} ${circumference}`}
            strokeDashoffset={-(greenArc + yellowArc)}
            strokeLinecap="round"
          />
        </g>

        {/* Score indicator dot */}
        <circle
          cx={indicatorX}
          cy={indicatorY}
          r={8}
          fill={getScoreColor()}
          stroke="white"
          strokeWidth={3}
        />
      </svg>

      {/* Score number and label */}
      <div className="text-center -mt-16">
        <div className="text-5xl font-bold text-gray-800">{score}</div>
        <div className="text-lg font-medium mt-1" style={{ color: getScoreColor() }}>
          {label} ({grade})
        </div>
      </div>
    </div>
  );
}
