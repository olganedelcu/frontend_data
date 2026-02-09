import type { ResultDisplay } from '../utils/status';

interface Props {
  display: ResultDisplay;
}

export function SeverityIndicator({ display }: Props) {
  const { icon, style } = display;

  if (icon === 'dot') {
    return <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />;
  }

  const rotation = icon === 'arrow-up' ? 'rotate-180' : '';

  return (
    <span className={`w-4 h-4 rounded-full shrink-0 ${style.bg} inline-flex items-center justify-center`}>
      <svg className={`w-2.5 h-2.5 ${style.text} ${rotation}`} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M5 2v6M2.5 5.5 5 8l2.5-2.5" />
      </svg>
    </span>
  );
}
