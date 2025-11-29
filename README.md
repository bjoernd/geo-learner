# Geography Learning App

An interactive geography learning application for studying German federal states, neighboring countries, and major cities. Designed for ages 11-14.

## Game Modes

**Federal State Mode**
Learn the 16 German federal states and their capitals. Click each state on the map, then type its capital name. 10 random questions per session.

**Neighbor Mode**
Extended version including Germany's 9 neighboring countries. Learn both German states and neighboring countries with their capitals. 10 random questions per session.

**City Mode**
Learn locations of 50+ major German cities by clicking their positions on the map. 15 random questions per session.

## Running the Application

The application code is in the `app/` directory. Navigate there before running commands.

```bash
cd app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Building for Production

```bash
cd app
npm run build
npm run preview
```

## Development

**Tech Stack**
- Svelte 5 with TypeScript
- Vite
- Vitest for testing

**Commands** (run from `app/` directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Type checking
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once

**Project Structure**
- `app/src/lib/components/` - Svelte components
- `app/src/lib/stores/` - State management
- `app/src/lib/data/` - Geography data
- `app/src/lib/utils/` - Utility functions

**Import Alias**
The project uses `$lib` as an alias for `src/lib`:
```typescript
import { something } from '$lib/utils/storage'
```

## Data Persistence

Progress and statistics are saved in browser LocalStorage and persist across sessions.

## Documentation

- `SPECIFICATION.md` - Technical requirements
- `IMPLEMENTATION_PLAN.md` - Development roadmap
- `CLAUDE.md` - AI assistant guidance
- `app/TESTING_CHECKLIST.md` - Manual testing guide
