const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', DATE_OPTIONS);
}
