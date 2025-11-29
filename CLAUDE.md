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

### Three Game Modes

1. **Federal State Mode:** Click German states on map, then answer capital names (10 random questions per session)
2. **Neighbor Mode:** Extended version including 9 neighboring countries + capitals (10 random questions per session)
3. **City Mode:** Click locations of German cities on map (15 random questions per session)

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

# Run tests (watch mode)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Testing

- Test files: `tests/unit/` for unit tests, `tests/components/` for component tests, `tests/integration/` for integration tests
- Manual testing checklist: `app/TESTING_CHECKLIST.md`
- Test setup: `tests/setup.ts` configures jsdom environment
- Tests use Vitest with @testing-library/svelte
- Global test utilities are available (globals: true in vitest config)

## Key Implementation Details

### Scoring System
- Federal State/Neighbor modes: 1 point for correct map click + 1 point for correct capital
- City mode: 1 point for correct location click
- Incorrect answers show the correct answer before moving to next question

### Text Matching for Capitals
- Case-insensitive matching required
- Must support common spelling variations (e.g., "München"/"Munchen")
- Implementation in `src/lib/utils/textMatching.ts`

### Data Requirements and Question Sampling
- Data includes 16 German federal states with capitals, 9 neighboring countries with capitals, and 50+ German cities
- Sessions use random sampling: Federal State mode (10 questions), Neighbor mode (10 questions), City mode (15 questions)
- Each session randomly selects from available data to keep gameplay fresh and sessions manageable
- See SPECIFICATION.md lines 136-190 for complete data lists

### Timer Feature (Optional)
- Configurable via settings
- Default: 30 seconds per question
- Pauses during capital input popup
- Timeout counts as incorrect answer

## Important Notes

- Progress and statistics persist across sessions using LocalStorage
- Map must show full Germany + partial view of neighboring countries
- Interface designed for ages 11-14 (detailed UI, text input comfortable)
- Responsive design for desktop and tablet

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

**Created for SVG map setup (Steps 3.1-3.2):**
- `identify-states.html` - Mapped 71 polygons to 16 German states
- `draw-countries.html` - User drew 9 neighboring country boundaries
- `test-map.html` - Verification that all 25 regions work correctly

This pattern is reusable for similar tasks: data classification, mapping, visual editing, or identification where human judgment is needed.
