# Biomarker Results UI

A React + TypeScript application for viewing and exploring biomarker test results.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- Results table with name, value, status, reference range, category
- Filter by category and status
- Sort by name, value, status, or date (asc/desc)
- Detail drawer with interpretation and notes
- Autosave notes to localStorage (500ms debounce)
- Loading, error, and empty states

## Key Decisions & Trade-offs

### Architecture
- **Single page, no router** - Simple app doesn't need routing complexity
- **Hooks** - Custom hooks (`useBiomarkerData`, `useNotes`) keep data logic out of components
- **Flat component structure** - No deep nesting, all components in `/components`

### State Management
- **React useState** - No Redux/Zustand needed for this scale
- **localStorage for notes** - Simple persistence, no backend required
- **Derived state via useMemo** - Filtering/sorting computed from source data

### Styling
- **Tailwind CSS** - Utility-first, no custom CSS files to maintain
- **Inline classes** - Co-located styling, easier to understand component appearance

### Trade-offs Made
| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| No component library | Smaller bundle, full control | More manual styling |
| localStorage | No backend needed | Data lost if cleared |
| Single fetch on mount | Simple data flow | No real-time updates |
| Drawer instead of modal | Better for detailed content | Takes full screen height |

## AI Tools Used

Used Claude AI for:
- TypeScript type definitions
- Component refactoring and simplification

## What I'd Do Next

With more time:
- Add tests (Vitest + React Testing Library)
- Add animations for drawer open/close
- Historical trend chart for biomarkers with multiple samples
- Search/filter by biomarker name
- Export results to PDF
- Dark mode support

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
