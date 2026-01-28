# Biomarker Results UI

A React + TypeScript application for viewing and exploring biomarker test results.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
Hoisted: [https://frontend-data-9eej.vercel.app/](https://frontend-data-9eej.vercel.app/)

## Features

- Results table with name, value, status, reference range, category
- Filter by category and status
- Sort by name, value, status, or date (asc/desc)
- Detail drawer with interpretation and notes
- Autosave notes to localStorage (500ms debounce)
- Loading, error, and empty states

## Key Decisions & Trade-offs

### Architecture
- **Page-based structure** - Pages in `/pages`, components in `/components`; designed with scalability in mind, easy to add routing as the app grows
- **Custom hooks** - `useBiomarkerData` for data fetching, `useFilteredResults` for filtering/sorting logic, `useLocalStorage` for persisted state - keeps business logic out of components
- **Tests** - Unit tests in `/utils/tests` using Vitest

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

## Mock API Setup

To simulate real-world data fetching, I served the `biomarkers.json` and `results.json` files via the `/public/api` directory and fetched them through relative URLs. This mimics a REST API response without setting up a backend.

```js
fetch('/api/biomarkers.json') // acts like a GET /api/biomarkers; simulate real api call
```

## AI Tools Used

Used Claude AI for:
- Mocking data and testing 
- TypeScript type definitions
- Component refactoring and simplification

## What I'd Do Next

With more time:
- Add animations for drawer transitions
- Show historical trends for biomarkers with multiple results
- Add search and filter by name
- Export results to PDF
- Support dark mode
- Set up a CI pipeline using GitHub Actions for automated testing and linting
- Protect the main branch to ensure all changes go through pull requests and pass CI checks before merging

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 
