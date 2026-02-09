# Biomarker Results UI

React + TypeScript dashboard for viewing blood biomarker results.

## Demo Videos

**UI Overview**
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/6a23035549bd4d67be9cf4f6508b8687" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

**Code Review**
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/77ebbe9dae39459fa65a49da30a4d6db" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
Hosted: [https://frontend-data-9eej.vercel.app/](https://frontend-data-9eej.vercel.app/)

## Features

- Weighted energy score with gradient scoring per biomarker
- Priority ranking by `importance * deviation from midpoint`
- Three-tier severity system (normal / mild / severe)
- Category sidebar with counts
- Filter by status, sort by name/value/status/date
- Detail drawer with range bar, interpretation, and user notes
- Notes persisted to localStorage with debounce
- Deduplication — latest sample per biomarker only

## Project Structure

```
src/
├── pages/        Page composition
├── components/   UI components
├── hooks/        State and business logic
├── utils/        Pure functions
└── types/        TypeScript interfaces
```

### Hooks

| Hook | What it does |
|------|-------------|
| `useBiomarkerData` | Fetches and joins biomarker + result JSON |
| `useDashboard` | Derives score, priority list, stats from raw data |
| `useResultFilters` | Filter/sort state + filtered output + toolbar props |
| `useNotes` | Read/write notes to localStorage |

### Utils

| File | What it does |
|------|-------------|
| `status.ts` | `getResultDisplay()` — severity, style classes, label in one call |
| `energyScore.ts` | Gradient scoring, deduplication |
| `coachingTips.ts` | One-line context per category + direction |
| `interpretation.ts` | Per-result text based on status |
| `format.ts` | Date formatting |

## Key Decisions

- **`getResultDisplay()`** - single function replaces three separate calls (`getSeverity` + `getSeverityStyle` + `getStatusLabel`). Every component that shows status uses this one entry point.
- **Stateful filter hook** - `useResultFilters` manages its own state and returns a `toolbarProps` object. Page spreads it onto `<Toolbar />` without knowing about sort/filter types.
- **`useDashboard` for derived data** - all `useMemo` computations (score, priority, stats, date) live in one hook. Page stays thin: state + layout only.
- **Progressive disclosure** - cards show value and label. Range bars, interpretation, and notes are in the drawer.
- **No grades or binary scoring** - score uses gradient calculation (partial credit for values near range boundaries) instead of pass/fail.
- **Coaching tips by category** - `coachingTips.ts` maps category + direction (high/low) to a one-sentence explanation. Avoids hardcoding 30 per-biomarker strings.
- **Deduplication before scoring** - `dedupeByLatest()` keeps one result per biomarker. Without this, historical samples inflate the "out of range" count.

## Trade-offs

| Decision | Upside | Downside |
|----------|--------|----------|
| No component library | Smaller bundle, full control | More manual work |
| localStorage for notes | No backend needed | Lost if storage cleared |
| Static JSON in `/public/api` | No server setup | No real-time data |
| Desktop-first | Matches primary use case | Mobile needs work |
| Drawer over modal | Scrollable detail view | Full viewport height |
| `useResultFilters` owns state | Page doesn't import filter types | Sort/filter state resets on unmount |
| `useDashboard` bundles derivations | Single hook, page stays ~80 lines | Hook has 5 `useMemo` calls internally |
| Coaching tips per category, not per biomarker | 10 entries instead of 30, easy to maintain | Less specific per marker |
| Gradient scoring (0–100 continuous) | Reflects how far from range, not just in/out | Harder to explain than pass/fail |

## Mock API

Static JSON served from `/public/api` to simulate REST endpoints.

```js
fetch('/api/biomarkers.json')
fetch('/api/results.json')
```

## Next Steps

- Trend charts for biomarkers with historical samples
- Search by name
- Mobile layout
- Drawer transitions
- CI with GitHub Actions

## Stack

React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Vitest
