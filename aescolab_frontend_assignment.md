# Frontend Assignment: Biomarker Results UI

## Goal
Build a small, production-minded UI that displays and explores biomarker results. We're interested in how you structure the code, make UX decisions, and handle real-world states, not pixel-perfect visuals.

## Expected effort
This assignment is designed to be doable in **~2–3 hours** for an experienced frontend engineer.  
If you choose to spend more time, that's totally fine. Please keep the scope reasonable and focus on quality and clarity over "more features".

## Tech
- React + TypeScript
- Styling: Tailwind preferred (or similar utility CSS)
- You may use component libraries (Radix, shadcn/ui, Headless UI) if you want
- You may use any AI tools. Please mention briefly how you used them.

## Data
Use the provided JSON files as your "API responses". You can hardcode them or simulate API calls with a small delay.

**`biomarkers.json`** — reference data for each biomarker
- `id` (string)
- `name` (string)
- `standardUnit` (string)
- `referenceRange` `{ low, high }`
- `category` (string)

**`results.json`** — actual test results
- `id` (string)
- `biomarkerId` (string) — references a biomarker
- `value` (number)
- `sampledAt` (ISO date string)
- `status` (one of: `low`, `normal`, `high`)

## What to build (must-haves)

### 1) Results list
- Show biomarkers in a table or list with at least: **name**, **value + unit**, **status**, **reference range**, **category**.
- Include a clear visual distinction for status (**low / normal / high**).

### 2) Filtering and sorting
- Add at least **one filter** (example: category).
- Add at least **one sort** (example: by name).

### 3) Detail view
- Clicking a biomarker opens a **details view** (drawer, modal, or separate panel).
- Include at least: **full reference range**, **sampled date**, and a short **interpretation** section.
  - Interpretation can be simple and rule-based. We care more about structure than medical accuracy.

### 4) Add a note (autosave)
- In the biomarker details, allow adding/editing a note.
- Implement **autosave** (localStorage is fine). 

## Decisions you should make

- layout (table vs cards, details drawer vs modal, etc.)
- what information to emphasize
- how filtering should work
- copy, empty states, and micro-interactions

## Nice-to-haves (optional)

### Real-world states
- Handle **loading** state (even if simulated).
- Handle **empty** state (e.g. filter returns no results).
- Handle **error** state (simulated error is fine, e.g. toggle a boolean).

## Deliverables
- A GitHub repo link
- README with:
  - setup instructions
  - key decisions and trade-offs
  - how you used AI tools (if used)
  - what you'd do next with more time

Optional: short Loom/video (2–3 min) showing the UI and your thought process.

## How we'll evaluate it
- UX clarity and sensible decisions
- Component structure and code readability
- State/data handling (filtering, details, autosave)
- Quality basics (responsiveness, accessibility mindset, error/empty/loading)
