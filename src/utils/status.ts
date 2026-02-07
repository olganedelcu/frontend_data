import type { Status } from '../types/result';

interface StatusStyle {
  dot: string;
  text: string;
  bg: string;
  label: string;
}

export const STATUS_CONFIG: Record<Status, StatusStyle> = {
  normal: { dot: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Normal' },
  high: { dot: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50', label: 'High' },
  low: { dot: 'bg-blue-400', text: 'text-blue-600', bg: 'bg-blue-50', label: 'Low' },
};

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
