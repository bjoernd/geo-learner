# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

**IMPORTANT:** The actual application code is in the `app/` subdirectory, not the root directory. Always run commands from within `app/`.

The root directory contains planning and specification documents:
- `SPECIFICATION.md` - Detailed technical requirements for the geography learning app
- `IMPLEMENTATION_PLAN.md` - Step-by-step implementation guide (tracks completed steps)
- `project.md` - High-level project description

## Application Architecture

This is a geography learning web application for teaching German federal states, neighboring countries, and cities through interactive map-based exercises. Target audience is children aged 11-14.

### Game Modes

1. **Laender Mode** (`'laender'`): Click German states + neighboring countries on map, then answer capital names (10 random questions per session, 2 points per question: 1 for location + 1 for capital)
2. **Orte Mode** (`'orte'`): Click locations of German cities and rivers on map (15 random questions per session, 1 point per question, no capital input)

### Tech Stack

- **Framework:** Svelte 5 with TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest with @testing-library/svelte
- **Data Persistence:** LocalStorage API
- **Map:** Custom SVG with event handlers (to be implemented)

### Code Organization (under `app/src/lib/`)

- `components/` - Svelte components (Map, CapitalInputModal, ScoreDisplay, ModeSelector, Timer, Settings, Statistics)
- `stores/` - Svelte stores for state management (gameState, settings, statistics)
- `data/` - Static data files (federalStates, neighboringCountries, cities)
- `types/` - TypeScript type definitions
- `utils/` - Utility functions (scoring, textMatching, storage)

### Import Alias

The project uses `$lib` as an alias for `src/lib`:
```typescript
import { something } from '$lib/utils/storage'
```

## Development Commands

**All commands must be run from the `app/` directory:**

```bash
# Development server (http://localhost:5173)
npm run dev

# Type checking (TypeScript + Svelte)
npm run check

# Build for production
npm run build

# Preview production build
npm run preview

# Run all tests (watch mode)
npm test

# Run all tests once (CI mode)
npm run test:run

# Run single test file
npm test -- tests/unit/gameState.test.ts

# Run tests with UI
npm run test:ui
```

## Testing

- Test organization: `tests/unit/` for unit tests, `tests/components/` for component tests, `tests/integration/` for integration tests
- Test setup: `tests/setup.ts` configures jsdom environment and imports @testing-library/jest-dom
- Framework: Vitest with @testing-library/svelte
- Global test utilities available (globals: true in vitest config) - no need to import describe/it/expect
- Expected stderr: localStorage errors in test output are normal (jsdom localStorage polyfill warnings)
- Manual testing checklist: `app/TESTING_CHECKLIST.md`

## Key Implementation Details

### Scoring System
- **Laender mode:** 2 points per question (1 for location + 1 for capital). Max score = totalQuestions × 2
- **Orte mode:** 1 point per question (no capital). Max score = totalQuestions × 1
- Score calculations must check `session.mode` to determine max score
- Incorrect answers show the correct answer before moving to next question

### Text Matching for Capitals
- Case-insensitive matching required
- Must support common spelling variations (e.g., "München"/"Munchen")
- Implementation in `src/lib/utils/textMatching.ts`

### Location Data Structure
All locations extend the base `Location` interface with `id`, `name`, `capital?`, and `svgPathId`:
- **FederalState:** 16 German states with required capitals (e.g., Bayern → München)
- **Country:** 9 neighboring countries with required capitals (e.g., Frankreich → Paris)
- **City:** 50+ German cities with `stateId` and `coordinates` (x, y in SVG space)
- **River:** 30 rivers and water bodies (Rhein, Elbe, Donau, etc.) - just locations, no capitals

### Question Sampling
- **Laender mode:** Shuffles and samples 10 questions from federalStates + neighboringCountries
- **Orte mode:** Shuffles and samples 15 questions from cities + rivers
- All sampling is random each session to keep gameplay fresh

### Timer Feature (Optional)
- Configurable via settings
- Default: 30 seconds per question
- Pauses during capital input popup
- Timeout counts as incorrect answer

## Architecture Patterns

### State Management
- **gameState:** Main game logic, question queue, scoring, answer validation
- **statistics:** Tracks per-mode stats, weak areas, success rates
- **settings:** Timer configuration
- All stores use `createPersistedStore()` wrapper for automatic LocalStorage sync

### Map Interaction
The SVG map (`src/assets/germany-map.svg`) contains:
- `.clickable-region` path elements for states/countries (id matches `svgPathId` in data files)
- `.river-path` path elements for rivers (id format: `river-0`, `river-1`, etc.)
- Hover effects: regions turn yellow, rivers turn yellow and thicken
- Click detection:
  - States/countries: Click event on path element
  - Rivers: Click event on path element (can click anywhere along the river)
  - Cities: SVG coordinate distance calculation (≤ 30px threshold)
- Visual feedback CSS classes: `.permanent-correct` (green), `.permanent-incorrect` (red), `.highlighted`, `.hovered`

### Answer Validation
- **Laender mode:** Checks `clickedRegionId === location.svgPathId` for map clicks, uses `compareText()` for capital text matching
- **Orte mode:**
  - Cities: Calculates distance between click coordinates and city location, correct if ≤ 30px
  - Rivers: Checks `clickedRegionId === location.svgPathId` (user can click anywhere on river path)

### Persisted Data
All game data persists to LocalStorage with these keys:
- `geo-learner-statistics`: Session history, mode stats, weak areas
- `geo-learner-settings`: Timer enabled/duration preferences
- No key for gameState (sessions are ephemeral, don't persist mid-game)

## Development Workflow Notes

### Interactive HTML Tools for SVG/Data Work

When working with SVG maps or complex data structures, standalone HTML tools are effective for interactive exploration and editing. Examples from this project:

**Pattern: Interactive Identifier Tools**
- Created `identify-states.html` - Click SVG polygons to map them to state IDs
- Created `identify-countries.html` - Similar tool for neighboring countries
- Created `draw-countries.html` - Draw polygon boundaries by clicking points on the map

**Why this approach:**
- Provides visual feedback during identification/editing
- Allows user (Bjoern) to make decisions requiring domain knowledge
- Faster iteration than editing SVG XML directly
- Tools run via simple HTTP server: `python3 -m http.server 8000`

**Tool pattern:**
1. Load source data (SVG file) via fetch
2. Make elements interactive with click handlers
3. Show current state in sidebar panel
4. Allow user to assign/identify/draw
5. Export result as JSON or code snippet
6. Claude uses exported data to update source files programmatically

**Location:** Development tools stored in project root (not in `app/` directory). These are temporary aids, not part of the application.

**Created for SVG map setup:**
- `identify-states.html` - Mapped 71 polygons to 16 German states
- `draw-countries.html` - User drew 9 neighboring country boundaries
- `draw-rivers.html` - User drew 30 river paths (includes load/edit/delete functionality)
- `test-map.html` - Verification that all regions work correctly

This pattern is reusable for similar tasks: data classification, mapping, visual editing, or identification where human judgment is needed.

## Common Pitfalls

### Score Calculation
Always check `session.mode` when calculating max score. Laender mode has 2 points per question, orte mode has 1 point per question. Don't hardcode `totalQuestions * 2`.

### SVG Path IDs
All location data files must have `svgPathId` matching actual SVG element IDs in `germany-map.svg`. Rivers use format `river-N` where N is a numeric index. States/countries use descriptive IDs.

### Type Narrowing for Cities vs Rivers
In orte mode, use type guards to distinguish cities from rivers:
```typescript
const isCity = 'coordinates' in location
if (isCity) {
  // Handle city click validation
} else {
  // Handle river click validation
}
```
