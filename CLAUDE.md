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

1. **Federal State Mode:** Click German states on map, then answer capital names
2. **Neighbor Mode:** Extended version including 9 neighboring countries + capitals
3. **City Mode:** Click locations of German cities on map

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

- Test files: `tests/unit/` for unit tests, `tests/components/` for component tests
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

### Data Requirements
- 16 German federal states with capitals
- 9 neighboring countries with capitals
- 50+ German cities (includes all state capitals + major cities)
- See SPECIFICATION.md lines 136-190 for complete lists

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
