# Geography Learning App - Detailed Implementation Plan

## Technical Stack

- **Framework:** Svelte
- **Language:** TypeScript
- **Build Tool:** Vite
- **CSS:** Svelte scoped styles
- **Testing:** Vitest
- **Map:** Custom SVG with event handlers
- **Data Persistence:** LocalStorage API

## Project Structure

```
geo-learner/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Map.svelte
│   │   │   ├── CapitalInputModal.svelte
│   │   │   ├── ScoreDisplay.svelte
│   │   │   ├── ModeSelector.svelte
│   │   │   ├── Timer.svelte
│   │   │   ├── Settings.svelte
│   │   │   └── Statistics.svelte
│   │   ├── stores/
│   │   │   ├── gameState.ts
│   │   │   ├── settings.ts
│   │   │   └── statistics.ts
│   │   ├── data/
│   │   │   ├── federalStates.ts
│   │   │   ├── neighboringCountries.ts
│   │   │   └── cities.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── scoring.ts
│   │       ├── textMatching.ts
│   │       └── storage.ts
│   ├── assets/
│   │   └── germany-map.svg
│   ├── App.svelte
│   ├── main.ts
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   └── components/
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1: Project Setup & Infrastructure

### Step 1.1: Initialize Svelte + TypeScript + Vite Project

**Commands to run:**
```bash
npm create vite@latest . -- --template svelte-ts
npm install
npm run dev
```

**Expected outcome:**
- Development server starts on http://localhost:5173
- Browser shows default Svelte + Vite starter page

**Verification:**
- Visit http://localhost:5173 in browser
- See Svelte logo and counter button

**✅ COMPLETED**

---

### Step 1.2: Configure TypeScript

**Edit `tsconfig.json`:**
```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "$lib/*": ["src/lib/*"]
    }
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.js", "src/**/*.svelte"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Create `tsconfig.node.json`:**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Edit `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  }
})
```

**Verification:**
- Run `npm run dev` - should compile without errors
- TypeScript errors should appear in editor for type violations

**✅ COMPLETED**

---

### Step 1.3: Set Up Vitest

**Install dependencies:**
```bash
npm install -D vitest jsdom @testing-library/svelte @testing-library/user-event @testing-library/jest-dom @vitest/ui
```

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  }
})
```

**Create `tests/setup.ts`:**
```typescript
import '@testing-library/jest-dom'
```

**Add test scripts to `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

**Create sample test `tests/unit/sample.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'

describe('Sample test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

**Verification:**
```bash
npm test
```
- Should run and pass 1 test
- Press 'q' to quit test watch mode

**✅ COMPLETED**

---

### Step 1.4: Create Project Structure

**Commands to run:**
```bash
mkdir -p src/lib/components
mkdir -p src/lib/stores
mkdir -p src/lib/data
mkdir -p src/lib/types
mkdir -p src/lib/utils
mkdir -p src/assets
mkdir -p tests/unit
mkdir -p tests/components
```

**Create placeholder files:**
```bash
touch src/lib/types/index.ts
touch src/lib/data/federalStates.ts
touch src/lib/data/neighboringCountries.ts
touch src/lib/data/cities.ts
touch src/lib/utils/storage.ts
touch src/lib/utils/scoring.ts
touch src/lib/utils/textMatching.ts
```

**Verification:**
- Run `ls -R src/lib` to see directory structure
- All directories and placeholder files should exist

**✅ COMPLETED**

---

## Phase 2: Data Layer

### Step 2.1: Define TypeScript Types

**Create `src/lib/types/index.ts`:**
```typescript
export type GameMode = 'federalState' | 'neighbor' | 'city'

export interface Location {
  id: string
  name: string
  capital?: string
  svgPathId: string
}

export interface FederalState extends Location {
  capital: string
}

export interface Country extends Location {
  capital: string
}

export interface City extends Location {
  stateId: string
  coordinates: { x: number; y: number }
}

export interface Question {
  location: Location
  type: 'location' | 'capital'
  mode: GameMode
}

export interface Answer {
  question: Question
  locationCorrect: boolean
  capitalCorrect?: boolean
  userLocationClick?: { x: number; y: number }
  userCapitalAnswer?: string
  timestamp: number
}

export interface GameSession {
  mode: GameMode
  score: number
  totalQuestions: number
  answers: Answer[]
  startTime: number
  endTime?: number
}

export interface ModeStatistics {
  sessionsPlayed: number
  totalQuestions: number
  correctAnswers: number
  successRate: number
  bestScore: number
}

export interface Statistics {
  totalSessions: number
  byMode: {
    federalState: ModeStatistics
    neighbor: ModeStatistics
    city: ModeStatistics
  }
  weakAreas: Array<{ locationId: string; locationName: string; successRate: number }>
}

export interface Settings {
  timerEnabled: boolean
  timerDuration: number // seconds
}

export interface GameState {
  currentMode: GameMode | null
  currentSession: GameSession | null
  currentQuestion: Question | null
  questionQueue: Question[]
  awaitingCapitalInput: boolean
  lastAnswerCorrect: boolean | null
  correctLocation: Location | null
}
```

**Verification:**
- Run `npm run dev` - should compile without errors
- Import types in another file to verify: `import type { GameMode } from '$lib/types'`

**✅ COMPLETED**

---

### Step 2.2: Create Federal States Data

**Edit `src/lib/data/federalStates.ts`:**
```typescript
import type { FederalState } from '$lib/types'

export const federalStates: FederalState[] = [
  {
    id: 'bw',
    name: 'Baden-Württemberg',
    capital: 'Stuttgart',
    svgPathId: 'DE-BW'
  },
  {
    id: 'by',
    name: 'Bayern',
    capital: 'München',
    svgPathId: 'DE-BY'
  },
  {
    id: 'be',
    name: 'Berlin',
    capital: 'Berlin',
    svgPathId: 'DE-BE'
  },
  {
    id: 'bb',
    name: 'Brandenburg',
    capital: 'Potsdam',
    svgPathId: 'DE-BB'
  },
  {
    id: 'hb',
    name: 'Bremen',
    capital: 'Bremen',
    svgPathId: 'DE-HB'
  },
  {
    id: 'hh',
    name: 'Hamburg',
    capital: 'Hamburg',
    svgPathId: 'DE-HH'
  },
  {
    id: 'he',
    name: 'Hessen',
    capital: 'Wiesbaden',
    svgPathId: 'DE-HE'
  },
  {
    id: 'mv',
    name: 'Mecklenburg-Vorpommern',
    capital: 'Schwerin',
    svgPathId: 'DE-MV'
  },
  {
    id: 'ni',
    name: 'Niedersachsen',
    capital: 'Hannover',
    svgPathId: 'DE-NI'
  },
  {
    id: 'nw',
    name: 'Nordrhein-Westfalen',
    capital: 'Düsseldorf',
    svgPathId: 'DE-NW'
  },
  {
    id: 'rp',
    name: 'Rheinland-Pfalz',
    capital: 'Mainz',
    svgPathId: 'DE-RP'
  },
  {
    id: 'sl',
    name: 'Saarland',
    capital: 'Saarbrücken',
    svgPathId: 'DE-SL'
  },
  {
    id: 'sn',
    name: 'Sachsen',
    capital: 'Dresden',
    svgPathId: 'DE-SN'
  },
  {
    id: 'st',
    name: 'Sachsen-Anhalt',
    capital: 'Magdeburg',
    svgPathId: 'DE-ST'
  },
  {
    id: 'sh',
    name: 'Schleswig-Holstein',
    capital: 'Kiel',
    svgPathId: 'DE-SH'
  },
  {
    id: 'th',
    name: 'Thüringen',
    capital: 'Erfurt',
    svgPathId: 'DE-TH'
  }
]

// Helper function to get state by ID
export function getFederalStateById(id: string): FederalState | undefined {
  return federalStates.find(state => state.id === id)
}

// Helper function to get state by name
export function getFederalStateByName(name: string): FederalState | undefined {
  return federalStates.find(state =>
    state.name.toLowerCase() === name.toLowerCase()
  )
}
```

**Verification:**
- Import in a test file and check that array has 16 elements
- Check that all required fields are present

**✅ COMPLETED**

---

### Step 2.3: Create Neighboring Countries Data

**Edit `src/lib/data/neighboringCountries.ts`:**
```typescript
import type { Country } from '$lib/types'

export const neighboringCountries: Country[] = [
  {
    id: 'dk',
    name: 'Dänemark',
    capital: 'Kopenhagen',
    svgPathId: 'DK'
  },
  {
    id: 'nl',
    name: 'Niederlande',
    capital: 'Amsterdam',
    svgPathId: 'NL'
  },
  {
    id: 'be',
    name: 'Belgien',
    capital: 'Brüssel',
    svgPathId: 'BE'
  },
  {
    id: 'lu',
    name: 'Luxemburg',
    capital: 'Luxemburg',
    svgPathId: 'LU'
  },
  {
    id: 'fr',
    name: 'Frankreich',
    capital: 'Paris',
    svgPathId: 'FR'
  },
  {
    id: 'ch',
    name: 'Schweiz',
    capital: 'Bern',
    svgPathId: 'CH'
  },
  {
    id: 'at',
    name: 'Österreich',
    capital: 'Wien',
    svgPathId: 'AT'
  },
  {
    id: 'cz',
    name: 'Tschechien',
    capital: 'Prag',
    svgPathId: 'CZ'
  },
  {
    id: 'pl',
    name: 'Polen',
    capital: 'Warschau',
    svgPathId: 'PL'
  }
]

// Helper function to get country by ID
export function getCountryById(id: string): Country | undefined {
  return neighboringCountries.find(country => country.id === id)
}

// Helper function to get country by name
export function getCountryByName(name: string): Country | undefined {
  return neighboringCountries.find(country =>
    country.name.toLowerCase() === name.toLowerCase()
  )
}
```

**Verification:**
- Import and check array has 9 elements
- Verify all required fields present

**✅ COMPLETED**

---

### Step 2.4: Create Cities Data

**Edit `src/lib/data/cities.ts`:**
```typescript
import type { City } from '$lib/types'

// Starting with 20 cities: all 16 state capitals + 4 major cities
// Coordinates are placeholders - will be updated when we have the actual SVG map
export const cities: City[] = [
  // State capitals
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    stateId: 'bw',
    svgPathId: 'city-stuttgart',
    coordinates: { x: 500, y: 650 }
  },
  {
    id: 'muenchen',
    name: 'München',
    stateId: 'by',
    svgPathId: 'city-muenchen',
    coordinates: { x: 650, y: 700 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    stateId: 'be',
    svgPathId: 'city-berlin',
    coordinates: { x: 700, y: 300 }
  },
  {
    id: 'potsdam',
    name: 'Potsdam',
    stateId: 'bb',
    svgPathId: 'city-potsdam',
    coordinates: { x: 680, y: 310 }
  },
  {
    id: 'bremen',
    name: 'Bremen',
    stateId: 'hb',
    svgPathId: 'city-bremen',
    coordinates: { x: 450, y: 250 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    stateId: 'hh',
    svgPathId: 'city-hamburg',
    coordinates: { x: 500, y: 200 }
  },
  {
    id: 'wiesbaden',
    name: 'Wiesbaden',
    stateId: 'he',
    svgPathId: 'city-wiesbaden',
    coordinates: { x: 420, y: 500 }
  },
  {
    id: 'schwerin',
    name: 'Schwerin',
    stateId: 'mv',
    svgPathId: 'city-schwerin',
    coordinates: { x: 600, y: 200 }
  },
  {
    id: 'hannover',
    name: 'Hannover',
    stateId: 'ni',
    svgPathId: 'city-hannover',
    coordinates: { x: 500, y: 320 }
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf',
    stateId: 'nw',
    svgPathId: 'city-duesseldorf',
    coordinates: { x: 350, y: 420 }
  },
  {
    id: 'mainz',
    name: 'Mainz',
    stateId: 'rp',
    svgPathId: 'city-mainz',
    coordinates: { x: 420, y: 520 }
  },
  {
    id: 'saarbruecken',
    name: 'Saarbrücken',
    stateId: 'sl',
    svgPathId: 'city-saarbruecken',
    coordinates: { x: 350, y: 600 }
  },
  {
    id: 'dresden',
    name: 'Dresden',
    stateId: 'sn',
    svgPathId: 'city-dresden',
    coordinates: { x: 700, y: 450 }
  },
  {
    id: 'magdeburg',
    name: 'Magdeburg',
    stateId: 'st',
    svgPathId: 'city-magdeburg',
    coordinates: { x: 600, y: 330 }
  },
  {
    id: 'kiel',
    name: 'Kiel',
    stateId: 'sh',
    svgPathId: 'city-kiel',
    coordinates: { x: 500, y: 120 }
  },
  {
    id: 'erfurt',
    name: 'Erfurt',
    stateId: 'th',
    svgPathId: 'city-erfurt',
    coordinates: { x: 550, y: 450 }
  },
  // Major cities (non-capitals)
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    stateId: 'he',
    svgPathId: 'city-frankfurt',
    coordinates: { x: 450, y: 500 }
  },
  {
    id: 'koeln',
    name: 'Köln',
    stateId: 'nw',
    svgPathId: 'city-koeln',
    coordinates: { x: 350, y: 450 }
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    stateId: 'sn',
    svgPathId: 'city-leipzig',
    coordinates: { x: 650, y: 400 }
  },
  {
    id: 'nuernberg',
    name: 'Nürnberg',
    stateId: 'by',
    svgPathId: 'city-nuernberg',
    coordinates: { x: 550, y: 600 }
  }
]

// Helper function to get city by ID
export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id)
}

// Helper function to get city by name
export function getCityByName(name: string): City | undefined {
  return cities.find(city =>
    city.name.toLowerCase() === name.toLowerCase()
  )
}

// Helper function to get all cities in a state
export function getCitiesByStateId(stateId: string): City[] {
  return cities.filter(city => city.stateId === stateId)
}
```

**Verification:**
- Import and check array has 20 elements
- Verify all 16 state capitals included
- Check all required fields present

**✅ COMPLETED**

---

### Step 2.5: Write Tests for Data

**Create `tests/unit/data.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'
import { federalStates, getFederalStateById, getFederalStateByName } from '$lib/data/federalStates'
import { neighboringCountries, getCountryById, getCountryByName } from '$lib/data/neighboringCountries'
import { cities, getCityById, getCityByName, getCitiesByStateId } from '$lib/data/cities'

describe('Federal States Data', () => {
  it('should have exactly 16 federal states', () => {
    expect(federalStates).toHaveLength(16)
  })

  it('should have all required fields for each state', () => {
    federalStates.forEach(state => {
      expect(state).toHaveProperty('id')
      expect(state).toHaveProperty('name')
      expect(state).toHaveProperty('capital')
      expect(state).toHaveProperty('svgPathId')
      expect(typeof state.id).toBe('string')
      expect(typeof state.name).toBe('string')
      expect(typeof state.capital).toBe('string')
      expect(typeof state.svgPathId).toBe('string')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = federalStates.map(s => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find state by ID', () => {
    const bayern = getFederalStateById('by')
    expect(bayern).toBeDefined()
    expect(bayern?.name).toBe('Bayern')
    expect(bayern?.capital).toBe('München')
  })

  it('should find state by name (case-insensitive)', () => {
    const bayern = getFederalStateByName('bayern')
    expect(bayern).toBeDefined()
    expect(bayern?.id).toBe('by')
  })

  it('should return undefined for non-existent state', () => {
    expect(getFederalStateById('invalid')).toBeUndefined()
    expect(getFederalStateByName('invalid')).toBeUndefined()
  })
})

describe('Neighboring Countries Data', () => {
  it('should have exactly 9 neighboring countries', () => {
    expect(neighboringCountries).toHaveLength(9)
  })

  it('should have all required fields for each country', () => {
    neighboringCountries.forEach(country => {
      expect(country).toHaveProperty('id')
      expect(country).toHaveProperty('name')
      expect(country).toHaveProperty('capital')
      expect(country).toHaveProperty('svgPathId')
      expect(typeof country.id).toBe('string')
      expect(typeof country.name).toBe('string')
      expect(typeof country.capital).toBe('string')
      expect(typeof country.svgPathId).toBe('string')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = neighboringCountries.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find country by ID', () => {
    const france = getCountryById('fr')
    expect(france).toBeDefined()
    expect(france?.name).toBe('Frankreich')
    expect(france?.capital).toBe('Paris')
  })

  it('should find country by name (case-insensitive)', () => {
    const france = getCountryByName('frankreich')
    expect(france).toBeDefined()
    expect(france?.id).toBe('fr')
  })
})

describe('Cities Data', () => {
  it('should have exactly 20 cities', () => {
    expect(cities).toHaveLength(20)
  })

  it('should have all required fields for each city', () => {
    cities.forEach(city => {
      expect(city).toHaveProperty('id')
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('stateId')
      expect(city).toHaveProperty('svgPathId')
      expect(city).toHaveProperty('coordinates')
      expect(city.coordinates).toHaveProperty('x')
      expect(city.coordinates).toHaveProperty('y')
      expect(typeof city.id).toBe('string')
      expect(typeof city.name).toBe('string')
      expect(typeof city.stateId).toBe('string')
      expect(typeof city.svgPathId).toBe('string')
      expect(typeof city.coordinates.x).toBe('number')
      expect(typeof city.coordinates.y).toBe('number')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = cities.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find city by ID', () => {
    const munich = getCityById('muenchen')
    expect(munich).toBeDefined()
    expect(munich?.name).toBe('München')
  })

  it('should find city by name', () => {
    const munich = getCityByName('München')
    expect(munich).toBeDefined()
    expect(munich?.id).toBe('muenchen')
  })

  it('should find cities by state ID', () => {
    const bavarianCities = getCitiesByStateId('by')
    expect(bavarianCities.length).toBeGreaterThan(0)
    bavarianCities.forEach(city => {
      expect(city.stateId).toBe('by')
    })
  })

  it('should include all 16 state capitals', () => {
    const stateCapitals = [
      'Stuttgart', 'München', 'Berlin', 'Potsdam', 'Bremen', 'Hamburg',
      'Wiesbaden', 'Schwerin', 'Hannover', 'Düsseldorf', 'Mainz',
      'Saarbrücken', 'Dresden', 'Magdeburg', 'Kiel', 'Erfurt'
    ]

    stateCapitals.forEach(capital => {
      const city = cities.find(c => c.name === capital)
      expect(city).toBeDefined()
    })
  })
})
```

**Run tests:**
```bash
npm test
```

**Expected outcome:**
- All tests pass
- Test output shows passing tests for data validation

**✅ COMPLETED**

---

## Phase 3: SVG Map Integration

### Step 3.1: Find and Download SVG Map

**Instructions:**

1. Visit Wikimedia Commons: https://commons.wikimedia.org/wiki/Main_Page
2. Search for: "Germany states SVG map"
3. Look for maps with these criteria:
   - Shows all 16 German federal states as separate paths
   - Includes neighboring countries (at least partially)
   - Licensed under Creative Commons or Public Domain
   - High enough quality but not overly complex

4. Recommended search terms:
   - "Germany states blank map"
   - "Deutschland Bundesländer Karte"
   - "Germany administrative divisions"

5. Download the SVG file

6. Save to `src/assets/germany-map.svg`

7. **Create `src/assets/map-source.md` to document the source:**
```markdown
# Map Source

**File:** germany-map.svg

**Source:** [URL of the Wikimedia page]

**License:** [License type, e.g., CC BY-SA 4.0, Public Domain]

**Author:** [Original author name]

**Date Downloaded:** [Today's date]

**Modifications:** [List any modifications made, initially: "None"]
```

**Verification:**
- File exists at `src/assets/germany-map.svg`
- Can open in browser and see map
- Documentation file created

**✅ COMPLETED**

---

### Step 3.2: Process SVG Map

**Instructions:**

1. Open `src/assets/germany-map.svg` in a text editor

2. Find the SVG paths for each federal state. They should look like:
```xml
<path d="M 100,200 L 150,250 ..." id="some-id" />
```

3. If paths don't have IDs, add them. Update/standardize IDs to match our data:
   - Baden-Württemberg: `id="DE-BW"`
   - Bayern: `id="DE-BY"`
   - Berlin: `id="DE-BE"`
   - (Continue for all 16 states - see data file for full list)

4. Do the same for neighboring countries:
   - Dänemark: `id="DK"`
   - Niederlande: `id="NL"`
   - (Continue for all 9 countries)

5. Add a class to each clickable region for styling:
```xml
<path d="..." id="DE-BW" class="clickable-region" />
```

6. Ensure the SVG has a viewBox attribute:
```xml
<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
```

7. Remove unnecessary elements:
   - Remove text labels (we'll add them programmatically)
   - Remove legends or decorative elements
   - Keep only paths and basic structure

8. **Verify the SVG structure:**
Create a simple test HTML file `test-map.html` in project root:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    svg { width: 100%; height: 100vh; }
    .clickable-region { fill: #e0e0e0; stroke: #333; stroke-width: 1; }
    .clickable-region:hover { fill: #ffeb3b; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    fetch('./src/assets/germany-map.svg')
      .then(r => r.text())
      .then(svg => {
        document.getElementById('map').innerHTML = svg

        // Test click handlers
        document.querySelectorAll('.clickable-region').forEach(region => {
          region.addEventListener('click', (e) => {
            console.log('Clicked:', e.target.id)
            alert('Clicked: ' + e.target.id)
          })
        })
      })
  </script>
</body>
</html>
```

9. Open `test-map.html` in browser and verify:
   - Map displays correctly
   - Regions highlight on hover
   - Clicking regions shows their ID
   - All 16 states and 9 countries are clickable

10. Update `src/assets/map-source.md` with any modifications made

**Verification:**
- All paths have correct IDs matching data files
- Test HTML shows map works correctly
- Can click and identify all regions

**✅ COMPLETED**

**Notes:**
- 16 German federal states added with IDs (DE-BW, DE-BY, etc.)
- 9 neighboring countries manually created and added (DK, NL, BE, LU, FR, CH, AT, CZ, PL)
- All regions have `class="clickable-region"` for styling
- Documentation updated in map-source.md

---

### Step 3.3: Create Map Component

**Create `src/lib/components/Map.svelte`:**
```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import type { GameMode } from '$lib/types'

  export let mode: GameMode | null = null
  export let highlightedRegion: string | null = null
  export let correctRegion: string | null = null
  export let incorrectClickPosition: { x: number; y: number } | null = null

  const dispatch = createEventDispatcher<{
    regionClick: { regionId: string; svgPathId: string }
    mapClick: { x: number; y: number; svgX: number; svgY: number }
  }>()

  let svgElement: SVGSVGElement
  let mapContainer: HTMLDivElement
  let mapLoaded = false

  onMount(async () => {
    try {
      // Load SVG file
      const response = await fetch('/src/assets/germany-map.svg')
      const svgText = await response.text()

      // Insert SVG into container
      mapContainer.innerHTML = svgText
      svgElement = mapContainer.querySelector('svg')!

      // Set up click handlers
      setupClickHandlers()

      mapLoaded = true
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  })

  function setupClickHandlers() {
    // Add click handlers to all clickable regions
    const regions = svgElement.querySelectorAll('.clickable-region')

    regions.forEach(region => {
      region.addEventListener('click', handleRegionClick)
      region.addEventListener('mouseenter', handleRegionHover)
      region.addEventListener('mouseleave', handleRegionUnhover)
    })

    // Also handle clicks on the SVG itself (for city mode)
    svgElement.addEventListener('click', handleSvgClick)
  }

  function handleRegionClick(event: Event) {
    event.stopPropagation()
    const target = event.target as SVGPathElement
    const regionId = target.id

    dispatch('regionClick', {
      regionId,
      svgPathId: regionId
    })
  }

  function handleSvgClick(event: MouseEvent) {
    if ((event.target as Element).classList.contains('clickable-region')) {
      return // Already handled by region click
    }

    // Get click coordinates in SVG space
    const pt = svgElement.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    const svgP = pt.matrixTransform(svgElement.getScreenCTM()!.inverse())

    dispatch('mapClick', {
      x: event.clientX,
      y: event.clientY,
      svgX: svgP.x,
      svgY: svgP.y
    })
  }

  function handleRegionHover(event: Event) {
    const target = event.target as SVGPathElement
    target.classList.add('hovered')
  }

  function handleRegionUnhover(event: Event) {
    const target = event.target as SVGPathElement
    target.classList.remove('hovered')
  }

  // React to prop changes for highlighting
  $: if (mapLoaded && svgElement) {
    updateHighlighting()
  }

  function updateHighlighting() {
    // Remove all existing highlights
    svgElement.querySelectorAll('.clickable-region').forEach(region => {
      region.classList.remove('highlighted', 'correct', 'incorrect')
    })

    // Add highlight to specified region
    if (highlightedRegion) {
      const region = svgElement.querySelector(`#${highlightedRegion}`)
      region?.classList.add('highlighted')
    }

    // Show correct region
    if (correctRegion) {
      const region = svgElement.querySelector(`#${correctRegion}`)
      region?.classList.add('correct')
    }

    // Show incorrect click position (for city mode)
    if (incorrectClickPosition) {
      // Add a red X or circle at the click position
      // This will be implemented when we handle city mode feedback
    }
  }
</script>

<div class="map-container" bind:this={mapContainer}>
  {#if !mapLoaded}
    <div class="loading">Karte wird geladen...</div>
  {/if}
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .map-container :global(svg) {
    width: 100%;
    height: 100%;
    max-width: 1000px;
    max-height: 800px;
  }

  .map-container :global(.clickable-region) {
    fill: #e0e0e0;
    stroke: #333;
    stroke-width: 1;
    cursor: pointer;
    transition: fill 0.2s ease;
  }

  .map-container :global(.clickable-region:hover),
  .map-container :global(.clickable-region.hovered) {
    fill: #ffeb3b;
  }

  .map-container :global(.clickable-region.highlighted) {
    fill: #90caf9;
  }

  .map-container :global(.clickable-region.correct) {
    fill: #66bb6a;
    animation: pulse-correct 0.5s ease;
  }

  .map-container :global(.clickable-region.incorrect) {
    fill: #ef5350;
    animation: pulse-incorrect 0.5s ease;
  }

  @keyframes pulse-correct {
    0%, 100% { fill: #66bb6a; }
    50% { fill: #81c784; }
  }

  @keyframes pulse-incorrect {
    0%, 100% { fill: #ef5350; }
    50% { fill: #e57373; }
  }

  .loading {
    font-size: 1.2rem;
    color: #666;
  }
</style>
```

**Verification:**
- Component compiles without errors
- Can import component in App.svelte

**✅ COMPLETED**

---

### Step 3.4: Test Map Component

**Create `tests/components/Map.test.ts`:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Map from '$lib/components/Map.svelte'

describe('Map Component', () => {
  it('should render loading state initially', () => {
    render(Map)
    expect(screen.getByText(/Karte wird geladen/i)).toBeInTheDocument()
  })

  it('should accept mode prop', () => {
    const { component } = render(Map, { props: { mode: 'federalState' } })
    expect(component).toBeTruthy()
  })

  it('should accept highlightedRegion prop', () => {
    const { component } = render(Map, {
      props: {
        mode: 'federalState',
        highlightedRegion: 'DE-BY'
      }
    })
    expect(component).toBeTruthy()
  })
})
```

**Run tests:**
```bash
npm test
```

**Manual testing:**
Update `src/App.svelte` temporarily to test the map:
```svelte
<script lang="ts">
  import Map from '$lib/components/Map.svelte'

  function handleRegionClick(event: CustomEvent) {
    console.log('Region clicked:', event.detail)
  }

  function handleMapClick(event: CustomEvent) {
    console.log('Map clicked:', event.detail)
  }
</script>

<main>
  <h1>Map Test</h1>
  <div style="width: 800px; height: 600px;">
    <Map
      mode="federalState"
      on:regionClick={handleRegionClick}
      on:mapClick={handleMapClick}
    />
  </div>
</main>
```

**Run dev server:**
```bash
npm run dev
```

**Verify:**
- Map displays in browser
- Clicking regions logs to console
- Hover effects work
- Map is responsive

**✅ COMPLETED**

---

## Phase 4: Game State Management

### Step 4.1: Create Settings Store

**Edit `src/lib/stores/settings.ts`:**
```typescript
import { writable, get } from 'svelte/store'
import type { Settings } from '$lib/types'

const STORAGE_KEY = 'geo-learner-settings'

const defaultSettings: Settings = {
  timerEnabled: false,
  timerDuration: 30
}

function createSettingsStore() {
  // Load from localStorage or use defaults
  const loadSettings = (): Settings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...defaultSettings, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
    return defaultSettings
  }

  const { subscribe, set, update } = writable<Settings>(loadSettings())

  // Save to localStorage whenever settings change
  subscribe((settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  })

  return {
    subscribe,
    set,
    update,
    setTimerEnabled: (enabled: boolean) => {
      update(s => ({ ...s, timerEnabled: enabled }))
    },
    setTimerDuration: (duration: number) => {
      update(s => ({ ...s, timerDuration: duration }))
    },
    reset: () => {
      set(defaultSettings)
    }
  }
}

export const settings = createSettingsStore()
```

**Create test `tests/unit/settings.test.ts`:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { get } from 'svelte/store'
import { settings } from '$lib/stores/settings'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Settings Store', () => {
  beforeEach(() => {
    localStorage.clear()
    settings.reset()
  })

  it('should have default settings', () => {
    const s = get(settings)
    expect(s.timerEnabled).toBe(false)
    expect(s.timerDuration).toBe(30)
  })

  it('should update timer enabled setting', () => {
    settings.setTimerEnabled(true)
    const s = get(settings)
    expect(s.timerEnabled).toBe(true)
  })

  it('should update timer duration setting', () => {
    settings.setTimerDuration(60)
    const s = get(settings)
    expect(s.timerDuration).toBe(60)
  })

  it('should persist settings to localStorage', () => {
    settings.setTimerEnabled(true)
    settings.setTimerDuration(45)

    const stored = localStorage.getItem('geo-learner-settings')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.timerEnabled).toBe(true)
    expect(parsed.timerDuration).toBe(45)
  })

  it('should reset to defaults', () => {
    settings.setTimerEnabled(true)
    settings.setTimerDuration(60)
    settings.reset()

    const s = get(settings)
    expect(s.timerEnabled).toBe(false)
    expect(s.timerDuration).toBe(30)
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 4.2: Create Statistics Store

**Edit `src/lib/stores/statistics.ts`:**
```typescript
import { writable } from 'svelte/store'
import type { Statistics, GameSession, GameMode, ModeStatistics } from '$lib/types'

const STORAGE_KEY = 'geo-learner-statistics'

const defaultModeStats: ModeStatistics = {
  sessionsPlayed: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  successRate: 0,
  bestScore: 0
}

const defaultStatistics: Statistics = {
  totalSessions: 0,
  byMode: {
    federalState: { ...defaultModeStats },
    neighbor: { ...defaultModeStats },
    city: { ...defaultModeStats }
  },
  weakAreas: []
}

function createStatisticsStore() {
  const loadStatistics = (): Statistics => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
    return defaultStatistics
  }

  const { subscribe, set, update } = writable<Statistics>(loadStatistics())

  // Save to localStorage whenever statistics change
  subscribe((stats) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error('Failed to save statistics:', error)
    }
  })

  return {
    subscribe,
    set,
    update,

    recordSession: (session: GameSession) => {
      update(stats => {
        const mode = session.mode
        const modeStats = stats.byMode[mode]

        // Count correct answers (location + capital if applicable)
        let correctAnswers = 0
        session.answers.forEach(answer => {
          if (answer.locationCorrect) correctAnswers++
          if (answer.capitalCorrect === true) correctAnswers++
        })

        // Update mode statistics
        const newModeStats: ModeStatistics = {
          sessionsPlayed: modeStats.sessionsPlayed + 1,
          totalQuestions: modeStats.totalQuestions + session.totalQuestions,
          correctAnswers: modeStats.correctAnswers + correctAnswers,
          successRate: 0, // Will be calculated below
          bestScore: Math.max(modeStats.bestScore, session.score)
        }

        newModeStats.successRate =
          newModeStats.totalQuestions > 0
            ? (newModeStats.correctAnswers / newModeStats.totalQuestions) * 100
            : 0

        // Update weak areas
        const weakAreas = calculateWeakAreas(stats, session)

        return {
          totalSessions: stats.totalSessions + 1,
          byMode: {
            ...stats.byMode,
            [mode]: newModeStats
          },
          weakAreas
        }
      })
    },

    reset: () => {
      set(defaultStatistics)
    }
  }
}

function calculateWeakAreas(
  currentStats: Statistics,
  newSession: GameSession
): Statistics['weakAreas'] {
  // Track success rate per location across all sessions
  const locationStats = new Map<string, { correct: number; total: number; name: string }>()

  // Process new session
  newSession.answers.forEach(answer => {
    const locationId = answer.question.location.id
    const locationName = answer.question.location.name

    if (!locationStats.has(locationId)) {
      locationStats.set(locationId, { correct: 0, total: 0, name: locationName })
    }

    const stats = locationStats.get(locationId)!

    // Count location clicks
    if (answer.question.type === 'location') {
      stats.total++
      if (answer.locationCorrect) stats.correct++
    }

    // Count capital answers
    if (answer.question.type === 'capital' || answer.capitalCorrect !== undefined) {
      stats.total++
      if (answer.capitalCorrect) stats.correct++
    }
  })

  // Convert to array and sort by success rate
  const weakAreas = Array.from(locationStats.entries())
    .map(([locationId, stats]) => ({
      locationId,
      locationName: stats.name,
      successRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    }))
    .filter(area => area.successRate < 100) // Only include areas with some failures
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 10) // Keep top 10 weakest areas

  return weakAreas
}

export const statistics = createStatisticsStore()
```

**Create test `tests/unit/statistics.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { statistics } from '$lib/stores/statistics'
import type { GameSession, Answer } from '$lib/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Statistics Store', () => {
  beforeEach(() => {
    localStorage.clear()
    statistics.reset()
  })

  it('should have default statistics', () => {
    const stats = get(statistics)
    expect(stats.totalSessions).toBe(0)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(0)
  })

  it('should record a game session', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 10,
      answers: [
        {
          question: {
            location: { id: 'by', name: 'Bayern', svgPathId: 'DE-BY', capital: 'München' },
            type: 'location',
            mode: 'federalState'
          },
          locationCorrect: true,
          capitalCorrect: true,
          timestamp: Date.now()
        }
      ],
      startTime: Date.now() - 60000,
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stats = get(statistics)
    expect(stats.totalSessions).toBe(1)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(1)
    expect(stats.byMode.federalState.correctAnswers).toBe(2) // location + capital
  })

  it('should calculate success rate', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 5,
      totalQuestions: 10,
      answers: Array(10).fill(null).map((_, i) => ({
        question: {
          location: { id: 'by', name: 'Bayern', svgPathId: 'DE-BY', capital: 'München' },
          type: 'location',
          mode: 'federalState'
        },
        locationCorrect: i < 5, // 5 correct out of 10
        timestamp: Date.now()
      })),
      startTime: Date.now() - 60000,
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stats = get(statistics)
    expect(stats.byMode.federalState.successRate).toBe(50)
  })

  it('should track best score', () => {
    const session1: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    const session2: GameSession = {
      mode: 'federalState',
      score: 15,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(session1)
    statistics.recordSession(session2)

    const stats = get(statistics)
    expect(stats.byMode.federalState.bestScore).toBe(15)
  })

  it('should persist statistics to localStorage', () => {
    const mockSession: GameSession = {
      mode: 'city',
      score: 5,
      totalQuestions: 10,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stored = localStorage.getItem('geo-learner-statistics')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.totalSessions).toBe(1)
  })

  it('should reset statistics', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 10,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)
    statistics.reset()

    const stats = get(statistics)
    expect(stats.totalSessions).toBe(0)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(0)
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 4.3: Create Game State Store

**Edit `src/lib/stores/gameState.ts`:**
```typescript
import { writable, get, derived } from 'svelte/store'
import type { GameState, GameMode, Question, Answer, Location, GameSession } from '$lib/types'
import { federalStates } from '$lib/data/federalStates'
import { neighboringCountries } from '$lib/data/neighboringCountries'
import { cities } from '$lib/data/cities'

const initialState: GameState = {
  currentMode: null,
  currentSession: null,
  currentQuestion: null,
  questionQueue: [],
  awaitingCapitalInput: false,
  lastAnswerCorrect: null,
  correctLocation: null
}

function createGameStateStore() {
  const { subscribe, set, update } = writable<GameState>(initialState)

  return {
    subscribe,
    set,
    update,

    startNewSession: (mode: GameMode) => {
      const questions = generateQuestions(mode)
      const firstQuestion = questions[0]

      const session: GameSession = {
        mode,
        score: 0,
        totalQuestions: questions.length,
        answers: [],
        startTime: Date.now()
      }

      update(state => ({
        ...state,
        currentMode: mode,
        currentSession: session,
        currentQuestion: firstQuestion,
        questionQueue: questions.slice(1),
        awaitingCapitalInput: false,
        lastAnswerCorrect: null,
        correctLocation: null
      }))
    },

    submitLocationAnswer: (clickedRegionId: string | null, clickPosition?: { x: number; y: number }) => {
      update(state => {
        if (!state.currentQuestion || !state.currentSession) return state

        const correct = clickedRegionId === state.currentQuestion.location.svgPathId ||
                       (state.currentQuestion.mode === 'city' && clickPosition &&
                        isClickNearCity(clickPosition, state.currentQuestion.location as any))

        const answer: Partial<Answer> = {
          question: state.currentQuestion,
          locationCorrect: correct,
          userLocationClick: clickPosition,
          timestamp: Date.now()
        }

        // If correct and mode requires capital, wait for capital input
        const needsCapital = correct &&
                            (state.currentMode === 'federalState' || state.currentMode === 'neighbor') &&
                            state.currentQuestion.location.capital

        if (needsCapital) {
          return {
            ...state,
            awaitingCapitalInput: true,
            lastAnswerCorrect: correct,
            correctLocation: state.currentQuestion.location,
            currentSession: {
              ...state.currentSession,
              score: state.currentSession.score + 1, // Point for location
              answers: [...state.currentSession.answers, answer as Answer]
            }
          }
        } else {
          // No capital needed, move to next question
          return moveToNextQuestion({
            ...state,
            lastAnswerCorrect: correct,
            correctLocation: state.currentQuestion.location,
            currentSession: {
              ...state.currentSession,
              score: correct ? state.currentSession.score + 1 : state.currentSession.score,
              answers: [...state.currentSession.answers, answer as Answer]
            }
          })
        }
      })
    },

    submitCapitalAnswer: (userAnswer: string) => {
      update(state => {
        if (!state.currentQuestion || !state.currentSession) return state

        const correctCapital = state.currentQuestion.location.capital!
        const correct = compareCapitalAnswer(userAnswer, correctCapital)

        // Update the last answer with capital result
        const answers = [...state.currentSession.answers]
        const lastAnswer = answers[answers.length - 1]
        lastAnswer.capitalCorrect = correct
        lastAnswer.userCapitalAnswer = userAnswer

        return moveToNextQuestion({
          ...state,
          awaitingCapitalInput: false,
          lastAnswerCorrect: correct,
          currentSession: {
            ...state.currentSession,
            score: correct ? state.currentSession.score + 1 : state.currentSession.score,
            answers
          }
        })
      })
    },

    endSession: () => {
      update(state => {
        if (!state.currentSession) return state

        const endedSession: GameSession = {
          ...state.currentSession,
          endTime: Date.now()
        }

        return {
          ...initialState,
          currentSession: endedSession
        }
      })
    },

    clearSession: () => {
      set(initialState)
    }
  }
}

function moveToNextQuestion(state: GameState): GameState {
  if (state.questionQueue.length === 0) {
    // Session complete
    return {
      ...state,
      currentQuestion: null,
      currentSession: state.currentSession ? {
        ...state.currentSession,
        endTime: Date.now()
      } : null
    }
  }

  const nextQuestion = state.questionQueue[0]
  return {
    ...state,
    currentQuestion: nextQuestion,
    questionQueue: state.questionQueue.slice(1),
    lastAnswerCorrect: null,
    correctLocation: null
  }
}

function generateQuestions(mode: GameMode): Question[] {
  let locations: Location[] = []

  switch (mode) {
    case 'federalState':
      locations = [...federalStates]
      break
    case 'neighbor':
      locations = [...federalStates, ...neighboringCountries]
      break
    case 'city':
      locations = [...cities]
      break
  }

  // Shuffle locations
  locations = shuffle(locations)

  // Create questions
  const questions: Question[] = locations.map(location => ({
    location,
    type: 'location',
    mode
  }))

  return questions
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function isClickNearCity(
  clickPosition: { x: number; y: number },
  city: { coordinates: { x: number; y: number } }
): boolean {
  const threshold = 30 // pixels
  const dx = clickPosition.x - city.coordinates.x
  const dy = clickPosition.y - city.coordinates.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= threshold
}

function compareCapitalAnswer(userAnswer: string, correctAnswer: string): boolean {
  // Normalize both strings
  const normalize = (str: string) =>
    str.toLowerCase()
      .trim()
      .replace(/ü/g, 'ue')
      .replace(/ö/g, 'oe')
      .replace(/ä/g, 'ae')
      .replace(/ß/g, 'ss')

  return normalize(userAnswer) === normalize(correctAnswer)
}

export const gameState = createGameStateStore()

// Derived stores for convenient access
export const currentMode = derived(gameState, $state => $state.currentMode)
export const currentQuestion = derived(gameState, $state => $state.currentQuestion)
export const currentScore = derived(gameState, $state => $state.currentSession?.score ?? 0)
export const isSessionActive = derived(gameState, $state =>
  $state.currentSession !== null && $state.currentQuestion !== null
)
```

**Create test `tests/unit/gameState.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { gameState, currentMode, currentQuestion, currentScore, isSessionActive } from '$lib/stores/gameState'

describe('Game State Store', () => {
  beforeEach(() => {
    gameState.clearSession()
  })

  it('should start with null state', () => {
    const state = get(gameState)
    expect(state.currentMode).toBeNull()
    expect(state.currentSession).toBeNull()
    expect(state.currentQuestion).toBeNull()
  })

  it('should start a new federal state session', () => {
    gameState.startNewSession('federalState')

    const state = get(gameState)
    expect(state.currentMode).toBe('federalState')
    expect(state.currentSession).toBeTruthy()
    expect(state.currentQuestion).toBeTruthy()
    expect(state.currentSession!.totalQuestions).toBe(16)
  })

  it('should start a new neighbor session', () => {
    gameState.startNewSession('neighbor')

    const state = get(gameState)
    expect(state.currentMode).toBe('neighbor')
    expect(state.currentSession!.totalQuestions).toBe(25) // 16 states + 9 countries
  })

  it('should start a new city session', () => {
    gameState.startNewSession('city')

    const state = get(gameState)
    expect(state.currentMode).toBe('city')
    expect(state.currentSession!.totalQuestions).toBe(20) // 20 cities
  })

  it('should handle correct location answer', () => {
    gameState.startNewSession('federalState')
    const initialQuestion = get(gameState).currentQuestion!

    gameState.submitLocationAnswer(initialQuestion.location.svgPathId)

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(true) // Should wait for capital
    expect(state.currentSession!.score).toBe(1)
  })

  it('should handle incorrect location answer', () => {
    gameState.startNewSession('federalState')

    gameState.submitLocationAnswer('WRONG-ID')

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(false)
    expect(state.currentSession!.score).toBe(0)
    expect(state.lastAnswerCorrect).toBe(false)
  })

  it('should handle correct capital answer', () => {
    gameState.startNewSession('federalState')
    const initialQuestion = get(gameState).currentQuestion!

    // Answer location correctly
    gameState.submitLocationAnswer(initialQuestion.location.svgPathId)

    // Answer capital correctly
    gameState.submitCapitalAnswer(initialQuestion.location.capital!)

    const state = get(gameState)
    expect(state.currentSession!.score).toBe(2) // 1 for location + 1 for capital
    expect(state.awaitingCapitalInput).toBe(false)
  })

  it('should handle capital with umlaut variations', () => {
    gameState.startNewSession('federalState')

    // Find Bayern question
    let state = get(gameState)
    while (state.currentQuestion?.location.name !== 'Bayern') {
      gameState.submitLocationAnswer('WRONG')
      state = get(gameState)
      if (!state.currentQuestion) break
    }

    if (state.currentQuestion?.location.name === 'Bayern') {
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId)

      // Test umlaut variations
      gameState.submitCapitalAnswer('Munchen') // Should match München

      const finalState = get(gameState)
      const lastAnswer = finalState.currentSession!.answers[finalState.currentSession!.answers.length - 1]
      expect(lastAnswer.capitalCorrect).toBe(true)
    }
  })

  it('should progress through questions', () => {
    gameState.startNewSession('city') // City mode doesn't require capital input

    const initialQuestion = get(gameState).currentQuestion!
    gameState.submitLocationAnswer('WRONG')

    const nextQuestion = get(gameState).currentQuestion
    expect(nextQuestion).toBeTruthy()
    expect(nextQuestion!.location.id).not.toBe(initialQuestion.location.id)
  })

  it('should end session when questions exhausted', () => {
    gameState.startNewSession('city')

    let state = get(gameState)
    const totalQuestions = state.currentSession!.totalQuestions

    // Answer all questions
    for (let i = 0; i < totalQuestions; i++) {
      state = get(gameState)
      if (!state.currentQuestion) break
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId,
                                      (state.currentQuestion.location as any).coordinates)
    }

    state = get(gameState)
    expect(state.currentQuestion).toBeNull()
    expect(state.currentSession!.endTime).toBeTruthy()
  })

  it('should clear session', () => {
    gameState.startNewSession('federalState')
    gameState.clearSession()

    const state = get(gameState)
    expect(state.currentMode).toBeNull()
    expect(state.currentSession).toBeNull()
  })

  // Test derived stores
  it('should provide derived current mode', () => {
    gameState.startNewSession('neighbor')
    expect(get(currentMode)).toBe('neighbor')
  })

  it('should provide derived current score', () => {
    gameState.startNewSession('city')
    expect(get(currentScore)).toBe(0)

    const question = get(gameState).currentQuestion!
    gameState.submitLocationAnswer(question.location.svgPathId, (question.location as any).coordinates)
    expect(get(currentScore)).toBe(1)
  })

  it('should provide derived session active status', () => {
    expect(get(isSessionActive)).toBe(false)

    gameState.startNewSession('federalState')
    expect(get(isSessionActive)).toBe(true)

    gameState.clearSession()
    expect(get(isSessionActive)).toBe(false)
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

## Phase 5: Utility Functions

### Step 5.1: Create Text Matching Utility

**Edit `src/lib/utils/textMatching.ts`:**
```typescript
/**
 * Normalizes a string for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Replacing umlauts with their equivalents
 * - Replacing ß with ss
 * - Removing special characters
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
    .replace(/\s+/g, ' ') // Normalize spaces
}

/**
 * Compares two strings for equality after normalization
 */
export function compareText(text1: string, text2: string): boolean {
  return normalizeText(text1) === normalizeText(text2)
}

/**
 * Checks if click coordinates are within threshold distance of target coordinates
 */
export function isClickNearPoint(
  click: { x: number; y: number },
  target: { x: number; y: number },
  threshold: number = 30
): boolean {
  const dx = click.x - target.x
  const dy = click.y - target.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= threshold
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}
```

**Create test `tests/unit/textMatching.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'
import { normalizeText, compareText, isClickNearPoint, calculateDistance } from '$lib/utils/textMatching'

describe('Text Matching Utilities', () => {
  describe('normalizeText', () => {
    it('should convert to lowercase', () => {
      expect(normalizeText('MÜNCHEN')).toBe('muenchen')
    })

    it('should trim whitespace', () => {
      expect(normalizeText('  Berlin  ')).toBe('berlin')
    })

    it('should replace umlauts', () => {
      expect(normalizeText('München')).toBe('muenchen')
      expect(normalizeText('Köln')).toBe('koeln')
      expect(normalizeText('Düsseldorf')).toBe('duesseldorf')
      expect(normalizeText('Saarbrücken')).toBe('saarbruecken')
    })

    it('should replace ß with ss', () => {
      expect(normalizeText('Straße')).toBe('strasse')
    })

    it('should remove special characters', () => {
      expect(normalizeText('Frankfurt-am-Main')).toBe('frankfurt am main')
      expect(normalizeText('Test!@#$%')).toBe('test')
    })

    it('should normalize multiple spaces', () => {
      expect(normalizeText('Test   Multiple   Spaces')).toBe('test multiple spaces')
    })
  })

  describe('compareText', () => {
    it('should match identical strings', () => {
      expect(compareText('Berlin', 'Berlin')).toBe(true)
    })

    it('should match case-insensitive', () => {
      expect(compareText('Berlin', 'berlin')).toBe(true)
      expect(compareText('BERLIN', 'berlin')).toBe(true)
    })

    it('should match with umlaut variations', () => {
      expect(compareText('München', 'Muenchen')).toBe(true)
      expect(compareText('Munchen', 'München')).toBe(true)
      expect(compareText('Köln', 'Koeln')).toBe(true)
      expect(compareText('Düsseldorf', 'Duesseldorf')).toBe(true)
    })

    it('should match with whitespace differences', () => {
      expect(compareText('  Berlin  ', 'Berlin')).toBe(true)
    })

    it('should not match different strings', () => {
      expect(compareText('Berlin', 'Hamburg')).toBe(false)
      expect(compareText('München', 'Berlin')).toBe(false)
    })

    it('should handle special characters', () => {
      expect(compareText('Frankfurt-am-Main', 'Frankfurt am Main')).toBe(true)
    })
  })

  describe('isClickNearPoint', () => {
    it('should return true for exact match', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 200 })).toBe(true)
    })

    it('should return true for click within threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 110, y: 200 }, 30)).toBe(true)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 220 }, 30)).toBe(true)
    })

    it('should return false for click outside threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 150, y: 200 }, 30)).toBe(false)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 250 }, 30)).toBe(false)
    })

    it('should use custom threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 150, y: 200 }, 50)).toBe(false)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 140, y: 200 }, 50)).toBe(true)
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance correctly', () => {
      expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
      expect(calculateDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0)
      expect(calculateDistance({ x: 100, y: 100 }, { x: 100, y: 200 })).toBe(100)
    })
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 5.2: Create Storage Utility

**Edit `src/lib/utils/storage.ts`:**
```typescript
/**
 * Generic localStorage wrapper with error handling
 */

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error)
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded')
    }
    return false
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Failed to load from localStorage (key: ${key}):`, error)
    return defaultValue
  }
}

export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error)
    return false
  }
}

export function clearStorage(): boolean {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
    return false
  }
}

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function getStorageSize(): number {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}
```

**Create test `tests/unit/storage.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  isStorageAvailable,
  getStorageSize
} from '$lib/utils/storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    hasOwnProperty: (key: string) => key in store
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveToStorage', () => {
    it('should save a string', () => {
      const result = saveToStorage('test', 'value')
      expect(result).toBe(true)
      expect(localStorage.getItem('test')).toBe('"value"')
    })

    it('should save an object', () => {
      const obj = { name: 'Test', value: 123 }
      const result = saveToStorage('test', obj)
      expect(result).toBe(true)

      const stored = JSON.parse(localStorage.getItem('test')!)
      expect(stored).toEqual(obj)
    })

    it('should save an array', () => {
      const arr = [1, 2, 3]
      saveToStorage('test', arr)

      const stored = JSON.parse(localStorage.getItem('test')!)
      expect(stored).toEqual(arr)
    })
  })

  describe('loadFromStorage', () => {
    it('should load a saved value', () => {
      saveToStorage('test', 'value')
      const loaded = loadFromStorage('test', '')
      expect(loaded).toBe('value')
    })

    it('should load an object', () => {
      const obj = { name: 'Test', value: 123 }
      saveToStorage('test', obj)
      const loaded = loadFromStorage('test', {})
      expect(loaded).toEqual(obj)
    })

    it('should return default value for non-existent key', () => {
      const loaded = loadFromStorage('nonexistent', 'default')
      expect(loaded).toBe('default')
    })

    it('should return default value for invalid JSON', () => {
      localStorage.setItem('invalid', 'not valid json {')
      const loaded = loadFromStorage('invalid', 'default')
      expect(loaded).toBe('default')
    })
  })

  describe('removeFromStorage', () => {
    it('should remove a key', () => {
      saveToStorage('test', 'value')
      expect(localStorage.getItem('test')).toBeTruthy()

      removeFromStorage('test')
      expect(localStorage.getItem('test')).toBeNull()
    })
  })

  describe('clearStorage', () => {
    it('should clear all storage', () => {
      saveToStorage('test1', 'value1')
      saveToStorage('test2', 'value2')

      clearStorage()

      expect(localStorage.getItem('test1')).toBeNull()
      expect(localStorage.getItem('test2')).toBeNull()
    })
  })

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })
  })

  describe('getStorageSize', () => {
    it('should calculate storage size', () => {
      clearStorage()
      expect(getStorageSize()).toBe(0)

      saveToStorage('test', 'value')
      expect(getStorageSize()).toBeGreaterThan(0)
    })
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

## Phase 6: UI Components

### Step 6.1: Create ScoreDisplay Component

**Create `src/lib/components/ScoreDisplay.svelte`:**
```svelte
<script lang="ts">
  import { currentScore } from '$lib/stores/gameState'
  import type { GameSession } from '$lib/types'

  export let session: GameSession | null = null

  $: displayScore = session?.score ?? $currentScore
  $: totalQuestions = session?.totalQuestions ?? 0
  $: percentage = totalQuestions > 0 ? Math.round((displayScore / (totalQuestions * 2)) * 100) : 0
  // Note: totalQuestions * 2 because we get points for location AND capital in some modes
  // This calculation may need adjustment based on actual game logic
</script>

<div class="score-display">
  <div class="score-main">
    <span class="score-label">Punktzahl:</span>
    <span class="score-value">{displayScore}</span>
    {#if totalQuestions > 0}
      <span class="score-total">/ {totalQuestions * 2}</span>
    {/if}
  </div>
  {#if totalQuestions > 0}
    <div class="score-percentage">{percentage}%</div>
  {/if}
</div>

<style>
  .score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .score-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
  }

  .score-label {
    font-weight: 600;
    color: #666;
  }

  .score-value {
    font-weight: 700;
    font-size: 2rem;
    color: #1976d2;
  }

  .score-total {
    font-size: 1.2rem;
    color: #999;
  }

  .score-percentage {
    font-size: 1rem;
    color: #666;
    padding: 0.25rem 0.75rem;
    background-color: #e3f2fd;
    border-radius: 12px;
  }
</style>
```

**Create test `tests/components/ScoreDisplay.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import ScoreDisplay from '$lib/components/ScoreDisplay.svelte'
import type { GameSession } from '$lib/types'

describe('ScoreDisplay Component', () => {
  it('should render score of 0 initially', () => {
    render(ScoreDisplay, { props: { session: null } })
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should render session score', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 15,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('/ 32')).toBeInTheDocument()
  })

  it('should display percentage', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 16,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
```

**✅ COMPLETED**

---

### Step 6.2: Create ModeSelector Component

**Create `src/lib/components/ModeSelector.svelte`:**
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { GameMode } from '$lib/types'

  export let currentMode: GameMode | null = null
  export let disabled: boolean = false

  const dispatch = createEventDispatcher<{
    modeSelect: { mode: GameMode }
  }>()

  const modes: Array<{ id: GameMode; label: string; description: string }> = [
    {
      id: 'federalState',
      label: 'Bundesländer',
      description: 'Lerne die 16 deutschen Bundesländer und ihre Hauptstädte'
    },
    {
      id: 'neighbor',
      label: 'Nachbarländer',
      description: 'Bundesländer plus die 9 Nachbarländer Deutschlands'
    },
    {
      id: 'city',
      label: 'Städte',
      description: 'Finde deutsche Städte auf der Karte'
    }
  ]

  function selectMode(mode: GameMode) {
    if (!disabled) {
      dispatch('modeSelect', { mode })
    }
  }
</script>

<div class="mode-selector">
  <h2>Wähle einen Modus:</h2>
  <div class="mode-buttons">
    {#each modes as mode}
      <button
        class="mode-button"
        class:active={currentMode === mode.id}
        class:disabled
        on:click={() => selectMode(mode.id)}
        {disabled}
      >
        <div class="mode-label">{mode.label}</div>
        <div class="mode-description">{mode.description}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .mode-selector {
    padding: 2rem;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .mode-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .mode-button {
    padding: 1.5rem;
    min-width: 250px;
    background-color: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover:not(.disabled) {
    border-color: #1976d2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .mode-button.active {
    border-color: #1976d2;
    background-color: #e3f2fd;
  }

  .mode-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mode-label {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .mode-description {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
</style>
```

**Create test `tests/components/ModeSelector.test.ts`:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ModeSelector from '$lib/components/ModeSelector.svelte'

describe('ModeSelector Component', () => {
  it('should render all three modes', () => {
    render(ModeSelector)
    expect(screen.getByText('Bundesländer')).toBeInTheDocument()
    expect(screen.getByText('Nachbarländer')).toBeInTheDocument()
    expect(screen.getByText('Städte')).toBeInTheDocument()
  })

  it('should dispatch modeSelect event on button click', async () => {
    const { component } = render(ModeSelector)
    const handler = vi.fn()
    component.$on('modeSelect', handler)

    const button = screen.getByText('Bundesländer')
    await fireEvent.click(button)

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { mode: 'federalState' }
      })
    )
  })

  it('should show active mode', () => {
    const { container } = render(ModeSelector, {
      props: { currentMode: 'neighbor' }
    })

    const buttons = container.querySelectorAll('.mode-button')
    expect(buttons[1]).toHaveClass('active')
  })

  it('should not dispatch event when disabled', async () => {
    const { component } = render(ModeSelector, {
      props: { disabled: true }
    })
    const handler = vi.fn()
    component.$on('modeSelect', handler)

    const button = screen.getByText('Bundesländer')
    await fireEvent.click(button)

    expect(handler).not.toHaveBeenCalled()
  })
})
```

**✅ COMPLETED**

---

### Step 6.3: Create CapitalInputModal Component

**Create `src/lib/components/CapitalInputModal.svelte`:**
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let show: boolean = false
  export let locationName: string = ''
  export let correctCapital: string = ''
  export let isAnswerCorrect: boolean | null = null
  export let userAnswer: string = ''

  const dispatch = createEventDispatcher<{
    submit: { answer: string }
    close: void
  }>()

  let inputValue = ''
  let inputElement: HTMLInputElement

  $: if (show && inputElement) {
    inputElement.focus()
    inputValue = ''
    isAnswerCorrect = null
  }

  function handleSubmit() {
    if (inputValue.trim()) {
      dispatch('submit', { answer: inputValue.trim() })
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit()
    } else if (event.key === 'Escape') {
      dispatch('close')
    }
  }

  function handleClose() {
    dispatch('close')
  }
</script>

{#if show}
  <div class="modal-overlay" transition:fade={{ duration: 200 }} on:click|self={handleClose}>
    <div class="modal-content" transition:scale={{ duration: 200, start: 0.9 }}>
      <h2>Hauptstadt von {locationName}?</h2>

      <div class="input-group">
        <input
          bind:this={inputElement}
          bind:value={inputValue}
          on:keydown={handleKeydown}
          type="text"
          placeholder="Hauptstadt eingeben..."
          disabled={isAnswerCorrect !== null}
        />
        {#if isAnswerCorrect === null}
          <button on:click={handleSubmit} class="submit-button">
            Bestätigen
          </button>
        {/if}
      </div>

      {#if isAnswerCorrect !== null}
        <div class="feedback" class:correct={isAnswerCorrect} class:incorrect={!isAnswerCorrect}>
          {#if isAnswerCorrect}
            <div class="feedback-icon">✓</div>
            <div class="feedback-text">Richtig!</div>
          {:else}
            <div class="feedback-icon">✗</div>
            <div class="feedback-text">
              Falsch! Die richtige Antwort ist: <strong>{correctCapital}</strong>
            </div>
            <div class="user-answer">Deine Antwort: {userAnswer}</div>
          {/if}
        </div>
        <button on:click={handleClose} class="continue-button">
          Weiter
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    min-width: 400px;
    max-width: 90%;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: #1976d2;
  }

  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .submit-button,
  .continue-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-button {
    background-color: #1976d2;
    color: white;
  }

  .submit-button:hover {
    background-color: #1565c0;
  }

  .continue-button {
    width: 100%;
    background-color: #4caf50;
    color: white;
    margin-top: 1rem;
  }

  .continue-button:hover {
    background-color: #45a049;
  }

  .feedback {
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .feedback.correct {
    background-color: #e8f5e9;
    border: 2px solid #4caf50;
  }

  .feedback.incorrect {
    background-color: #ffebee;
    border: 2px solid #f44336;
  }

  .feedback-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .feedback.correct .feedback-icon {
    color: #4caf50;
  }

  .feedback.incorrect .feedback-icon {
    color: #f44336;
  }

  .feedback-text {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .user-answer {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
  }
</style>
```

**Create test `tests/components/CapitalInputModal.test.ts`:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import CapitalInputModal from '$lib/components/CapitalInputModal.svelte'

describe('CapitalInputModal Component', () => {
  it('should not render when show is false', () => {
    const { container } = render(CapitalInputModal, {
      props: { show: false, locationName: 'Bayern', correctCapital: 'München' }
    })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(CapitalInputModal, {
      props: { show: true, locationName: 'Bayern', correctCapital: 'München' }
    })
    expect(screen.getByText(/Hauptstadt von Bayern/i)).toBeInTheDocument()
  })

  it('should dispatch submit event with user input', async () => {
    const { component } = render(CapitalInputModal, {
      props: { show: true, locationName: 'Bayern', correctCapital: 'München' }
    })
    const handler = vi.fn()
    component.$on('submit', handler)

    const input = screen.getByPlaceholderText(/Hauptstadt eingeben/i)
    await fireEvent.input(input, { target: { value: 'München' } })

    const button = screen.getByText('Bestätigen')
    await fireEvent.click(button)

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { answer: 'München' }
      })
    )
  })

  it('should show correct feedback', () => {
    render(CapitalInputModal, {
      props: {
        show: true,
        locationName: 'Bayern',
        correctCapital: 'München',
        isAnswerCorrect: true
      }
    })
    expect(screen.getByText('Richtig!')).toBeInTheDocument()
  })

  it('should show incorrect feedback with correct answer', () => {
    render(CapitalInputModal, {
      props: {
        show: true,
        locationName: 'Bayern',
        correctCapital: 'München',
        isAnswerCorrect: false,
        userAnswer: 'Berlin'
      }
    })
    expect(screen.getByText(/Falsch/i)).toBeInTheDocument()
    expect(screen.getByText(/München/i)).toBeInTheDocument()
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 6.4: Create Timer Component

**Create `src/lib/components/Timer.svelte`:**
```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { createEventDispatcher } from 'svelte'

  export let duration: number = 30 // seconds
  export let enabled: boolean = false
  export let paused: boolean = false
  export let autoStart: boolean = true

  const dispatch = createEventDispatcher<{
    timeout: void
    tick: { remaining: number }
  }>()

  let remaining = duration
  let intervalId: number | null = null
  let startTime: number | null = null
  let pausedTime: number = 0

  $: percentage = (remaining / duration) * 100
  $: isLow = remaining <= 10
  $: isCritical = remaining <= 5

  $: if (enabled && autoStart && !intervalId) {
    start()
  }

  $: if (!enabled && intervalId) {
    stop()
  }

  $: if (paused && intervalId) {
    pause()
  } else if (!paused && enabled && !intervalId) {
    resume()
  }

  function start() {
    remaining = duration
    startTime = Date.now()
    pausedTime = 0
    startInterval()
  }

  function startInterval() {
    if (intervalId) return

    intervalId = window.setInterval(() => {
      if (!startTime) return

      const elapsed = Math.floor((Date.now() - startTime - pausedTime) / 1000)
      remaining = Math.max(0, duration - elapsed)

      dispatch('tick', { remaining })

      if (remaining === 0) {
        stop()
        dispatch('timeout')
      }
    }, 100)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    startTime = null
    pausedTime = 0
  }

  function pause() {
    if (intervalId && startTime) {
      clearInterval(intervalId)
      intervalId = null
      pausedTime = Date.now() - startTime
    }
  }

  function resume() {
    if (!intervalId && startTime) {
      startTime = Date.now() - pausedTime
      startInterval()
    }
  }

  export function reset() {
    stop()
    if (enabled && autoStart) {
      start()
    }
  }

  onDestroy(() => {
    stop()
  })
</script>

{#if enabled}
  <div class="timer" class:low={isLow} class:critical={isCritical}>
    <div class="timer-display">
      <svg class="timer-circle" viewBox="0 0 100 100">
        <circle
          class="timer-bg"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          class="timer-progress"
          cx="50"
          cy="50"
          r="45"
          style="stroke-dashoffset: {283 - (283 * percentage) / 100}"
        />
      </svg>
      <div class="timer-text">
        <span class="timer-seconds">{remaining}</span>
        <span class="timer-label">s</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .timer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-display {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .timer-circle {
    transform: rotate(-90deg);
  }

  .timer-bg {
    fill: none;
    stroke: #e0e0e0;
    stroke-width: 8;
  }

  .timer-progress {
    fill: none;
    stroke: #1976d2;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 0.1s linear, stroke 0.3s ease;
  }

  .timer.low .timer-progress {
    stroke: #ff9800;
  }

  .timer.critical .timer-progress {
    stroke: #f44336;
    animation: pulse 0.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      stroke-width: 8;
    }
    50% {
      stroke-width: 10;
    }
  }

  .timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .timer-seconds {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  .timer.low .timer-seconds {
    color: #ff9800;
  }

  .timer.critical .timer-seconds {
    color: #f44336;
  }

  .timer-label {
    font-size: 1rem;
    color: #666;
  }
</style>
```

**Create test `tests/components/Timer.test.ts`:**
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Timer from '$lib/components/Timer.svelte'

describe('Timer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not render when disabled', () => {
    const { container } = render(Timer, {
      props: { enabled: false, duration: 30 }
    })
    expect(container.querySelector('.timer')).not.toBeInTheDocument()
  })

  it('should render when enabled', () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 30 }
    })
    expect(container.querySelector('.timer')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('should countdown when enabled', () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 30, autoStart: true }
    })

    expect(screen.getByText('30')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)
    expect(screen.getByText('25')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('should dispatch timeout event when time runs out', () => {
    const { component } = render(Timer, {
      props: { enabled: true, duration: 5, autoStart: true }
    })

    const handler = vi.fn()
    component.$on('timeout', handler)

    vi.advanceTimersByTime(5000)
    expect(handler).toHaveBeenCalled()
  })

  it('should dispatch tick events', () => {
    const { component } = render(Timer, {
      props: { enabled: true, duration: 10, autoStart: true }
    })

    const handler = vi.fn()
    component.$on('tick', handler)

    vi.advanceTimersByTime(1000)
    expect(handler).toHaveBeenCalled()
  })

  it('should apply low class when under 10 seconds', () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 15, autoStart: true }
    })

    vi.advanceTimersByTime(6000)
    expect(container.querySelector('.timer')).toHaveClass('low')
  })

  it('should apply critical class when under 5 seconds', () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 10, autoStart: true }
    })

    vi.advanceTimersByTime(6000)
    expect(container.querySelector('.timer')).toHaveClass('critical')
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 6.5: Create Settings Component

**Create `src/lib/components/Settings.svelte`:**
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { settings } from '$lib/stores/settings'
  import { fade, slide } from 'svelte/transition'

  export let show: boolean = false

  const dispatch = createEventDispatcher<{
    close: void
    resetProgress: void
    viewStatistics: void
  }>()

  let showResetConfirm = false

  function handleClose() {
    dispatch('close')
  }

  function handleResetProgress() {
    showResetConfirm = true
  }

  function confirmReset() {
    dispatch('resetProgress')
    showResetConfirm = false
  }

  function cancelReset() {
    showResetConfirm = false
  }

  function handleViewStatistics() {
    dispatch('viewStatistics')
  }
</script>

{#if show}
  <div class="modal-overlay" transition:fade={{ duration: 200 }} on:click|self={handleClose}>
    <div class="modal-content" transition:slide={{ duration: 200 }}>
      <div class="modal-header">
        <h2>Einstellungen</h2>
        <button class="close-button" on:click={handleClose}>✕</button>
      </div>

      <div class="settings-section">
        <h3>Timer</h3>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              bind:checked={$settings.timerEnabled}
              on:change={() => settings.setTimerEnabled($settings.timerEnabled)}
            />
            Timer aktivieren
          </label>
        </div>

        {#if $settings.timerEnabled}
          <div class="setting-item" transition:slide={{ duration: 200 }}>
            <label for="timer-duration">
              Zeitlimit: {$settings.timerDuration} Sekunden
            </label>
            <input
              id="timer-duration"
              type="range"
              min="10"
              max="120"
              step="5"
              bind:value={$settings.timerDuration}
              on:change={() => settings.setTimerDuration($settings.timerDuration)}
            />
            <div class="range-labels">
              <span>10s</span>
              <span>120s</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="settings-section">
        <h3>Statistiken</h3>
        <button class="action-button" on:click={handleViewStatistics}>
          Statistiken anzeigen
        </button>
      </div>

      <div class="settings-section danger-zone">
        <h3>Zurücksetzen</h3>
        <p class="warning-text">
          Dies löscht alle gespeicherten Fortschritte und Statistiken.
        </p>

        {#if !showResetConfirm}
          <button class="danger-button" on:click={handleResetProgress}>
            Fortschritt zurücksetzen
          </button>
        {:else}
          <div class="confirm-box" transition:slide={{ duration: 200 }}>
            <p class="confirm-text">Wirklich alle Daten löschen?</p>
            <div class="confirm-buttons">
              <button class="danger-button" on:click={confirmReset}>
                Ja, löschen
              </button>
              <button class="cancel-button" on:click={cancelReset}>
                Abbrechen
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    min-width: 500px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  h2 {
    margin: 0;
    color: #333;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.25rem;
    line-height: 1;
  }

  .close-button:hover {
    color: #333;
  }

  .settings-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .settings-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #555;
    font-size: 1.2rem;
  }

  .setting-item {
    margin-bottom: 1.5rem;
  }

  .setting-item:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    cursor: pointer;
  }

  input[type="checkbox"] {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  input[type="range"] {
    width: 100%;
    margin-top: 0.5rem;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #999;
    margin-top: 0.25rem;
  }

  .action-button,
  .danger-button,
  .cancel-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button {
    background-color: #1976d2;
    color: white;
  }

  .action-button:hover {
    background-color: #1565c0;
  }

  .danger-button {
    background-color: #f44336;
    color: white;
  }

  .danger-button:hover {
    background-color: #d32f2f;
  }

  .cancel-button {
    background-color: #e0e0e0;
    color: #333;
  }

  .cancel-button:hover {
    background-color: #d0d0d0;
  }

  .danger-zone {
    background-color: #fff3f3;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ffcdd2;
  }

  .warning-text {
    color: #d32f2f;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .confirm-box {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #f44336;
  }

  .confirm-text {
    font-weight: 600;
    color: #d32f2f;
    margin-bottom: 1rem;
  }

  .confirm-buttons {
    display: flex;
    gap: 1rem;
  }
</style>
```

**Create test `tests/components/Settings.test.ts`:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import Settings from '$lib/components/Settings.svelte'

describe('Settings Component', () => {
  it('should not render when show is false', () => {
    const { container } = render(Settings, { props: { show: false } })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(Settings, { props: { show: true } })
    expect(screen.getByText('Einstellungen')).toBeInTheDocument()
  })

  it('should toggle timer enabled', async () => {
    render(Settings, { props: { show: true } })
    const checkbox = screen.getByLabelText(/Timer aktivieren/i) as HTMLInputElement

    await fireEvent.click(checkbox)
    // Setting changes are tested in the store tests
  })

  it('should show timer duration slider when timer enabled', async () => {
    render(Settings, { props: { show: true } })
    const checkbox = screen.getByLabelText(/Timer aktivieren/i)

    await fireEvent.click(checkbox)

    // Wait for slide transition
    await new Promise(resolve => setTimeout(resolve, 300))

    expect(screen.getByLabelText(/Zeitlimit/i)).toBeInTheDocument()
  })

  it('should dispatch viewStatistics event', async () => {
    const { component } = render(Settings, { props: { show: true } })
    const handler = vi.fn()
    component.$on('viewStatistics', handler)

    const button = screen.getByText('Statistiken anzeigen')
    await fireEvent.click(button)

    expect(handler).toHaveBeenCalled()
  })

  it('should show reset confirmation', async () => {
    render(Settings, { props: { show: true } })

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    expect(screen.getByText(/Wirklich alle Daten löschen/i)).toBeInTheDocument()
  })

  it('should dispatch resetProgress on confirm', async () => {
    const { component } = render(Settings, { props: { show: true } })
    const handler = vi.fn()
    component.$on('resetProgress', handler)

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    const confirmButton = screen.getByText('Ja, löschen')
    await fireEvent.click(confirmButton)

    expect(handler).toHaveBeenCalled()
  })

  it('should cancel reset on cancel button', async () => {
    const { component } = render(Settings, { props: { show: true } })
    const handler = vi.fn()
    component.$on('resetProgress', handler)

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    const cancelButton = screen.getByText('Abbrechen')
    await fireEvent.click(cancelButton)

    expect(handler).not.toHaveBeenCalled()
    expect(screen.queryByText(/Wirklich alle Daten löschen/i)).not.toBeInTheDocument()
  })

  it('should dispatch close event', async () => {
    const { component } = render(Settings, { props: { show: true } })
    const handler = vi.fn()
    component.$on('close', handler)

    const closeButton = screen.getByText('✕')
    await fireEvent.click(closeButton)

    expect(handler).toHaveBeenCalled()
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 6.6: Create Statistics Component

**Create `src/lib/components/Statistics.svelte`:**
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { statistics } from '$lib/stores/statistics'
  import { fade, slide } from 'svelte/transition'
  import type { GameMode } from '$lib/types'

  export let show: boolean = false

  const dispatch = createEventDispatcher<{
    close: void
  }>()

  const modeLabels: Record<GameMode, string> = {
    federalState: 'Bundesländer',
    neighbor: 'Nachbarländer',
    city: 'Städte'
  }

  function handleClose() {
    dispatch('close')
  }

  function formatSuccessRate(rate: number): string {
    return rate.toFixed(1) + '%'
  }
</script>

{#if show}
  <div class="modal-overlay" transition:fade={{ duration: 200 }} on:click|self={handleClose}>
    <div class="modal-content" transition:slide={{ duration: 200 }}>
      <div class="modal-header">
        <h2>Statistiken</h2>
        <button class="close-button" on:click={handleClose}>✕</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{$statistics.totalSessions}</div>
          <div class="stat-label">Gespielte Sitzungen</div>
        </div>
      </div>

      <div class="mode-stats">
        {#each Object.entries($statistics.byMode) as [mode, stats]}
          <div class="mode-card">
            <h3>{modeLabels[mode as GameMode]}</h3>
            <div class="mode-details">
              <div class="detail-row">
                <span class="detail-label">Sitzungen:</span>
                <span class="detail-value">{stats.sessionsPlayed}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fragen:</span>
                <span class="detail-value">{stats.totalQuestions}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Richtig:</span>
                <span class="detail-value">{stats.correctAnswers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Erfolgsquote:</span>
                <span class="detail-value success-rate">
                  {formatSuccessRate(stats.successRate)}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Beste Punktzahl:</span>
                <span class="detail-value best-score">{stats.bestScore}</span>
              </div>
            </div>
            {#if stats.sessionsPlayed === 0}
              <div class="no-data">Noch keine Daten</div>
            {/if}
          </div>
        {/each}
      </div>

      {#if $statistics.weakAreas.length > 0}
        <div class="weak-areas">
          <h3>Verbesserungspotenzial</h3>
          <p class="weak-areas-description">
            Hier sind die Regionen, bei denen du noch üben kannst:
          </p>
          <div class="weak-areas-list">
            {#each $statistics.weakAreas.slice(0, 5) as area}
              <div class="weak-area-item">
                <span class="weak-area-name">{area.locationName}</span>
                <div class="weak-area-bar">
                  <div
                    class="weak-area-fill"
                    style="width: {area.successRate}%"
                  ></div>
                </div>
                <span class="weak-area-rate">
                  {formatSuccessRate(area.successRate)}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if $statistics.totalSessions === 0}
        <div class="empty-state">
          <p>Noch keine Statistiken verfügbar.</p>
          <p>Spiele ein paar Runden, um deine Fortschritte zu sehen!</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    min-width: 600px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  h2 {
    margin: 0;
    color: #333;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.25rem;
    line-height: 1;
  }

  .close-button:hover {
    color: #333;
  }

  .stats-overview {
    margin-bottom: 2rem;
  }

  .stat-card {
    background-color: #e3f2fd;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
  }

  .stat-value {
    font-size: 3rem;
    font-weight: 700;
    color: #1976d2;
  }

  .stat-label {
    font-size: 1rem;
    color: #666;
    margin-top: 0.5rem;
  }

  .mode-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .mode-card {
    background-color: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    position: relative;
  }

  .mode-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.2rem;
  }

  .mode-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    color: #666;
    font-size: 0.9rem;
  }

  .detail-value {
    font-weight: 600;
    color: #333;
  }

  .success-rate {
    color: #4caf50;
  }

  .best-score {
    color: #ff9800;
  }

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-style: italic;
    font-size: 0.9rem;
  }

  .weak-areas {
    background-color: #fff9e6;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px solid #ffe0b2;
  }

  .weak-areas h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #f57c00;
  }

  .weak-areas-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .weak-areas-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .weak-area-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    align-items: center;
  }

  .weak-area-name {
    font-weight: 600;
    color: #333;
  }

  .weak-area-bar {
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .weak-area-fill {
    height: 100%;
    background: linear-gradient(to right, #f44336, #ff9800, #4caf50);
    transition: width 0.3s ease;
  }

  .weak-area-rate {
    font-weight: 600;
    color: #666;
    min-width: 50px;
    text-align: right;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #999;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }
</style>
```

**Create test `tests/components/Statistics.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Statistics from '$lib/components/Statistics.svelte'
import { statistics } from '$lib/stores/statistics'
import type { GameSession } from '$lib/types'

describe('Statistics Component', () => {
  beforeEach(() => {
    statistics.reset()
  })

  it('should not render when show is false', () => {
    const { container } = render(Statistics, { props: { show: false } })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(Statistics, { props: { show: true } })
    expect(screen.getByText('Statistiken')).toBeInTheDocument()
  })

  it('should show empty state when no sessions played', () => {
    render(Statistics, { props: { show: true } })
    expect(screen.getByText(/Noch keine Statistiken verfügbar/i)).toBeInTheDocument()
  })

  it('should display total sessions', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    render(Statistics, { props: { show: true } })
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Gespielte Sitzungen')).toBeInTheDocument()
  })

  it('should display mode statistics', () => {
    const mockSession: GameSession = {
      mode: 'city',
      score: 15,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    render(Statistics, { props: { show: true } })
    expect(screen.getByText('Städte')).toBeInTheDocument()
  })

  it('should show "Noch keine Daten" for modes not played', () => {
    render(Statistics, { props: { show: true } })
    const noDatas = screen.getAllByText('Noch keine Daten')
    expect(noDatas).toHaveLength(3) // All three modes
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

## Phase 7: Main App Integration

### Step 7.1: Build Main App Component

**Edit `src/App.svelte`:**
```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import Map from '$lib/components/Map.svelte'
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte'
  import ModeSelector from '$lib/components/ModeSelector.svelte'
  import CapitalInputModal from '$lib/components/CapitalInputModal.svelte'
  import Timer from '$lib/components/Timer.svelte'
  import Settings from '$lib/components/Settings.svelte'
  import Statistics from '$lib/components/Statistics.svelte'
  import { gameState, isSessionActive } from '$lib/stores/gameState'
  import { settings } from '$lib/stores/settings'
  import { statistics } from '$lib/stores/statistics'
  import type { GameMode } from '$lib/types'

  let showSettings = false
  let showStatistics = false
  let timerComponent: any

  $: currentMode = $gameState.currentMode
  $: currentQuestion = $gameState.currentQuestion
  $: currentSession = $gameState.currentSession
  $: awaitingCapitalInput = $gameState.awaitingCapitalInput
  $: lastAnswerCorrect = $gameState.lastAnswerCorrect
  $: correctLocation = $gameState.correctLocation

  // Modal state for capital input
  let showCapitalModal = false
  let capitalModalLocationName = ''
  let capitalModalCorrectAnswer = ''
  let capitalModalIsCorrect: boolean | null = null
  let capitalModalUserAnswer = ''

  // Map highlighting
  let highlightedRegion: string | null = null
  let correctRegionHighlight: string | null = null

  $: {
    // Show capital modal when awaiting input
    if (awaitingCapitalInput && currentQuestion) {
      showCapitalModal = true
      capitalModalLocationName = currentQuestion.location.name
      capitalModalCorrectAnswer = currentQuestion.location.capital!
      capitalModalIsCorrect = null
      capitalModalUserAnswer = ''
    }
  }

  function handleModeSelect(event: CustomEvent<{ mode: GameMode }>) {
    if ($isSessionActive) {
      const confirmed = confirm('Dies beendet die aktuelle Sitzung. Fortfahren?')
      if (!confirmed) return
    }

    gameState.startNewSession(event.detail.mode)
    resetMapHighlights()
    if (timerComponent) {
      timerComponent.reset()
    }
  }

  function handleRegionClick(event: CustomEvent<{ regionId: string; svgPathId: string }>) {
    if (!$isSessionActive || awaitingCapitalInput) return

    const clickedRegionId = event.detail.svgPathId

    // Submit answer
    gameState.submitLocationAnswer(clickedRegionId)

    // Show feedback
    if (lastAnswerCorrect === false) {
      showIncorrectFeedback()
    }
  }

  function handleMapClick(event: CustomEvent<{ x: number; y: number; svgX: number; svgY: number }>) {
    // For city mode, handle clicks on the map
    if (!$isSessionActive || currentMode !== 'city' || awaitingCapitalInput) return

    const clickPosition = { x: event.detail.svgX, y: event.detail.svgY }
    gameState.submitLocationAnswer(null, clickPosition)

    if (lastAnswerCorrect === false) {
      showIncorrectFeedback()
    } else {
      // Move to next question after brief delay
      setTimeout(() => {
        resetMapHighlights()
      }, 1000)
    }
  }

  function handleCapitalSubmit(event: CustomEvent<{ answer: string }>) {
    const userAnswer = event.detail.answer
    capitalModalUserAnswer = userAnswer

    // Submit answer to game state
    gameState.submitCapitalAnswer(userAnswer)

    // Show feedback
    capitalModalIsCorrect = lastAnswerCorrect

    // After showing feedback, close modal and continue
    setTimeout(() => {
      showCapitalModal = false
      capitalModalIsCorrect = null

      if (lastAnswerCorrect === false) {
        showIncorrectFeedback()
      } else {
        resetMapHighlights()
      }
    }, 2000)
  }

  function handleCapitalModalClose() {
    // Only allow closing if feedback has been shown
    if (capitalModalIsCorrect !== null) {
      showCapitalModal = false
      capitalModalIsCorrect = null
      resetMapHighlights()
    }
  }

  function showIncorrectFeedback() {
    if (correctLocation) {
      correctRegionHighlight = correctLocation.svgPathId
      setTimeout(() => {
        resetMapHighlights()
      }, 2000)
    }
  }

  function resetMapHighlights() {
    highlightedRegion = null
    correctRegionHighlight = null
  }

  function handleTimerTimeout() {
    // Treat timeout as incorrect answer
    if ($isSessionActive && !awaitingCapitalInput) {
      gameState.submitLocationAnswer(null)
      showIncorrectFeedback()
    }
  }

  function handleSettingsClose() {
    showSettings = false
  }

  function handleViewStatistics() {
    showSettings = false
    showStatistics = true
  }

  function handleStatisticsClose() {
    showStatistics = false
  }

  function handleResetProgress() {
    statistics.reset()
    gameState.clearSession()
    showSettings = false
    alert('Alle Fortschritte wurden zurückgesetzt.')
  }

  // Watch for session end
  $: if (currentSession && !currentQuestion && currentSession.endTime) {
    // Session ended, record statistics
    statistics.recordSession(currentSession)
    setTimeout(() => {
      const playAgain = confirm(
        `Sitzung beendet!\nPunktzahl: ${currentSession.score}/${currentSession.totalQuestions * 2}\n\nNoch eine Runde spielen?`
      )
      if (playAgain && currentMode) {
        gameState.startNewSession(currentMode)
      } else {
        gameState.clearSession()
      }
    }, 500)
  }
</script>

<main>
  <header>
    <h1>Geographie-Lernapp</h1>
    <div class="header-actions">
      <button class="icon-button" on:click={() => (showStatistics = true)} title="Statistiken">
        📊
      </button>
      <button class="icon-button" on:click={() => (showSettings = true)} title="Einstellungen">
        ⚙️
      </button>
    </div>
  </header>

  {#if !$isSessionActive}
    <div class="mode-selection">
      <ModeSelector
        currentMode={currentMode}
        on:modeSelect={handleModeSelect}
      />
    </div>
  {:else}
    <div class="game-container">
      <div class="game-sidebar">
        <ScoreDisplay session={currentSession} />

        {#if $settings.timerEnabled}
          <Timer
            bind:this={timerComponent}
            duration={$settings.timerDuration}
            enabled={$settings.timerEnabled && $isSessionActive}
            paused={awaitingCapitalInput}
            on:timeout={handleTimerTimeout}
          />
        {/if}

        {#if currentQuestion}
          <div class="question-display">
            <h2>Finde:</h2>
            <p class="question-text">{currentQuestion.location.name}</p>
          </div>
        {/if}

        <button class="end-session-button" on:click={() => {
          if (confirm('Sitzung beenden?')) {
            gameState.endSession()
          }
        }}>
          Sitzung beenden
        </button>
      </div>

      <div class="map-area">
        <Map
          mode={currentMode}
          highlightedRegion={highlightedRegion}
          correctRegion={correctRegionHighlight}
          on:regionClick={handleRegionClick}
          on:mapClick={handleMapClick}
        />
      </div>
    </div>
  {/if}

  <CapitalInputModal
    show={showCapitalModal}
    locationName={capitalModalLocationName}
    correctCapital={capitalModalCorrectAnswer}
    isAnswerCorrect={capitalModalIsCorrect}
    userAnswer={capitalModalUserAnswer}
    on:submit={handleCapitalSubmit}
    on:close={handleCapitalModalClose}
  />

  <Settings
    show={showSettings}
    on:close={handleSettingsClose}
    on:viewStatistics={handleViewStatistics}
    on:resetProgress={handleResetProgress}
  />

  <Statistics
    show={showStatistics}
    on:close={handleStatisticsClose}
  />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background-color: #1976d2;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .icon-button:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .mode-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .game-container {
    flex: 1;
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  .game-sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .question-display {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .question-display h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .question-text {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }

  .end-session-button {
    padding: 0.75rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .end-session-button:hover {
    background-color: #d32f2f;
  }

  .map-area {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .game-container {
      flex-direction: column;
    }

    .game-sidebar {
      width: 100%;
    }

    .map-area {
      min-height: 400px;
    }
  }
</style>
```

**Verification:**
```bash
npm run dev
```
- Open browser and test mode selection
- Start a session and verify all components render
- Test clicking regions on map
- Test capital input modal
- Verify score updates
- Test ending a session

**✅ COMPLETED**

---

### Step 7.2: Update Main Entry Point

**Edit `src/main.ts`:**
```typescript
import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
```

**Create `src/app.css` (global styles):**
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
}

input {
  font-family: inherit;
}
```

**Edit `index.html`:**
```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Geographie-Lernapp</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Verification:**
```bash
npm run dev
```
- App should load without errors
- All styles should be applied correctly

**✅ COMPLETED**

---

## Phase 8: Integration Testing & Fixes

### Step 8.1: Create Integration Tests

**Create `tests/integration/gameFlow.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { gameState } from '$lib/stores/gameState'
import { statistics } from '$lib/stores/statistics'

describe('Game Flow Integration', () => {
  beforeEach(() => {
    gameState.clearSession()
    statistics.reset()
  })

  it('should complete a full federal state session', () => {
    // Start session
    gameState.startNewSession('federalState')

    let state = get(gameState)
    expect(state.currentMode).toBe('federalState')
    expect(state.currentQuestion).toBeTruthy()

    const totalQuestions = state.currentSession!.totalQuestions

    // Answer all questions
    for (let i = 0; i < totalQuestions; i++) {
      state = get(gameState)
      if (!state.currentQuestion) break

      // Answer location correctly
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId)

      state = get(gameState)
      if (state.awaitingCapitalInput) {
        // Answer capital correctly
        gameState.submitCapitalAnswer(state.currentQuestion!.location.capital!)
      }
    }

    // Session should be complete
    state = get(gameState)
    expect(state.currentQuestion).toBeNull()
    expect(state.currentSession!.endTime).toBeTruthy()

    // Record statistics
    statistics.recordSession(state.currentSession!)

    // Check statistics updated
    const stats = get(statistics)
    expect(stats.totalSessions).toBe(1)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(1)
  })

  it('should handle incorrect answers', () => {
    gameState.startNewSession('city')

    let state = get(gameState)
    const initialScore = state.currentSession!.score

    // Submit incorrect answer
    gameState.submitLocationAnswer('WRONG-ID')

    state = get(gameState)
    expect(state.currentSession!.score).toBe(initialScore) // Score should not increase
    expect(state.lastAnswerCorrect).toBe(false)
  })

  it('should handle mode switching', () => {
    gameState.startNewSession('federalState')
    gameState.clearSession()
    gameState.startNewSession('city')

    const state = get(gameState)
    expect(state.currentMode).toBe('city')
    expect(state.currentSession!.totalQuestions).toBe(20)
  })
})
```

**Run tests:**
```bash
npm test
```

**✅ COMPLETED**

---

### Step 8.2: Manual Testing Checklist

**Create `TESTING_CHECKLIST.md`:**
```markdown
# Testing Checklist

## Mode Selection
- [ ] Can select Federal State mode
- [ ] Can select Neighbor mode
- [ ] Can select City mode
- [ ] Mode description is clear and accurate
- [ ] Switching modes during session shows confirmation dialog

## Federal State Mode
- [ ] All 16 federal states appear as questions
- [ ] Can click on correct state
- [ ] Capital input modal appears after correct click
- [ ] Can type capital name
- [ ] Correct capital is accepted
- [ ] Umlaut variations are accepted (München/Munchen)
- [ ] Incorrect capital shows correct answer
- [ ] Score increases for correct location (+ 1)
- [ ] Score increases for correct capital (+ 1)
- [ ] Incorrect answers show correct location
- [ ] Session ends after all states

## Neighbor Mode
- [ ] All 25 locations appear (16 states + 9 countries)
- [ ] Can click on states
- [ ] Can click on countries
- [ ] Capital input works for both
- [ ] All country capitals accepted correctly

## City Mode
- [ ] All 20 cities appear as questions
- [ ] Can click near city location
- [ ] Proximity detection works (within ~30px)
- [ ] No capital input for cities
- [ ] Score increases for correct click
- [ ] Incorrect click shows correct location

## Map Interactions
- [ ] Map loads correctly
- [ ] Regions highlight on hover
- [ ] Click feedback is immediate
- [ ] Correct answer shows green highlight
- [ ] Incorrect answer shows red highlight
- [ ] Highlights clear before next question

## Timer (when enabled)
- [ ] Timer appears when enabled in settings
- [ ] Countdown works correctly
- [ ] Timer pauses during capital input
- [ ] Timer resumes after capital modal closes
- [ ] Visual warning when < 10 seconds
- [ ] Critical animation when < 5 seconds
- [ ] Timeout treated as incorrect answer
- [ ] Timer resets for each question

## Score Display
- [ ] Shows current score
- [ ] Shows total possible score
- [ ] Shows percentage
- [ ] Updates in real-time

## Settings
- [ ] Can open settings modal
- [ ] Can toggle timer on/off
- [ ] Can adjust timer duration (10-120s)
- [ ] Settings persist across sessions
- [ ] Can view statistics from settings
- [ ] Reset progress shows confirmation
- [ ] Reset progress actually clears data

## Statistics
- [ ] Shows total sessions played
- [ ] Shows per-mode statistics
- [ ] Shows success rates
- [ ] Shows best scores
- [ ] Shows weak areas when available
- [ ] Empty state shown when no data
- [ ] Statistics persist across sessions

## Session Management
- [ ] Can end session early
- [ ] End session shows confirmation
- [ ] Session end shows score summary
- [ ] Prompt to play again works
- [ ] Statistics recorded at session end

## Data Persistence
- [ ] Settings persist after browser refresh
- [ ] Statistics persist after browser refresh
- [ ] Can clear browser data and restart
- [ ] No console errors related to storage

## Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Sidebar stacks on mobile
- [ ] Map is usable on all sizes

## Accessibility
- [ ] Can navigate with keyboard
- [ ] Enter key submits capital answer
- [ ] Escape key closes modals
- [ ] Tab order is logical
- [ ] Color contrast is sufficient
- [ ] Text is readable

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Performance
- [ ] Initial load < 3 seconds
- [ ] Click response < 100ms
- [ ] No lag during gameplay
- [ ] No memory leaks during extended play

## Error Handling
- [ ] Graceful handling when localStorage unavailable
- [ ] Graceful handling when map fails to load
- [ ] No crashes during normal gameplay
- [ ] Console is clean (no errors)
```

**Perform manual testing:**
- Go through each checklist item
- Mark completed items
- Document any issues found
- Fix issues and re-test

**✅ COMPLETED**

---

## Phase 9: Bug Fixes & Polish

### Step 9.1: Add Loading States

**Create `src/lib/components/LoadingSpinner.svelte`:**
```svelte
<script lang="ts">
  export let message: string = 'Laden...'
</script>

<div class="spinner-container">
  <div class="spinner"></div>
  <p>{message}</p>
</div>

<style>
  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  p {
    margin-top: 1rem;
    color: #666;
  }
</style>
```

---

### Step 9.2: Add Error Boundary

**Create `src/lib/components/ErrorBoundary.svelte`:**
```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  let hasError = false
  let errorMessage = ''

  onMount(() => {
    const handleError = (event: ErrorEvent) => {
      hasError = true
      errorMessage = event.message
      console.error('Error caught:', event.error)
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  })

  function reload() {
    hasError = false
    window.location.reload()
  }
</script>

{#if hasError}
  <div class="error-boundary">
    <div class="error-content">
      <h1>😕 Etwas ist schiefgelaufen</h1>
      <p>Die Anwendung ist auf einen Fehler gestoßen.</p>
      <details>
        <summary>Fehlerdetails</summary>
        <pre>{errorMessage}</pre>
      </details>
      <button on:click={reload}>Neu laden</button>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
  }

  .error-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 600px;
  }

  h1 {
    color: #f44336;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }

  details {
    text-align: left;
    margin: 1rem 0;
  }

  summary {
    cursor: pointer;
    color: #1976d2;
  }

  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background-color: #1565c0;
  }
</style>
```

---

### Step 9.3: Improve Accessibility

**Update `src/App.svelte` to add ARIA labels:**

Add these attributes to interactive elements:
```svelte
<button
  class="icon-button"
  on:click={() => (showStatistics = true)}
  title="Statistiken"
  aria-label="Statistiken anzeigen"
>
  📊
</button>

<button
  class="icon-button"
  on:click={() => (showSettings = true)}
  title="Einstellungen"
  aria-label="Einstellungen öffnen"
>
  ⚙️
</button>
```

**Verification:**
- Use browser accessibility inspector
- Test keyboard navigation
- Verify screen reader compatibility

---

## Phase 10: Documentation

### Step 10.1: Create README

**Create `README.md`:**
```markdown
# Geographie-Lernapp

Eine interaktive Webanwendung zum Erlernen der deutschen Geographie, einschließlich Bundesländer, Nachbarländer und Städte.

## Features

- **Drei Spielmodi:**
  - Bundesländer: Lerne alle 16 deutschen Bundesländer und ihre Hauptstädte
  - Nachbarländer: Bundesländer plus die 9 Nachbarländer Deutschlands
  - Städte: Finde deutsche Städte auf der Karte

- **Interaktive Karte:** Klicke auf Regionen, um deine Antworten abzugeben
- **Fortschrittsverfolgung:** Statistiken und Erfolgsquoten werden gespeichert
- **Timer (optional):** Fordere dich selbst mit Zeitlimits heraus
- **Responsive Design:** Funktioniert auf Desktop und Tablet

## Technologie

- **Framework:** Svelte + TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest
- **Styling:** Scoped CSS
- **Datenspeicherung:** LocalStorage

## Installation

### Voraussetzungen

- Node.js 18+ und npm

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/yourusername/geo-learner.git
cd geo-learner

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter http://localhost:5173 verfügbar.

### Testen

```bash
# Tests ausführen
npm test

# Tests mit UI ausführen
npm run test:ui

# Tests einmalig ausführen (CI)
npm run test:run
```

### Production Build

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## Projektstruktur

```
src/
├── lib/
│   ├── components/     # Svelte-Komponenten
│   ├── stores/         # State Management (Svelte Stores)
│   ├── data/           # Geografische Daten
│   ├── types/          # TypeScript-Typen
│   └── utils/          # Hilfsfunktionen
├── assets/             # Statische Assets (SVG-Karte)
├── App.svelte          # Hauptkomponente
└── main.ts             # Einstiegspunkt

tests/
├── unit/               # Unit-Tests
├── components/         # Komponenten-Tests
└── integration/        # Integrations-Tests
```

## Verwendung

1. **Modus wählen:** Wähle einen der drei Spielmodi
2. **Frage beantworten:** Klicke auf die Karte, um die Region zu identifizieren
3. **Hauptstadt eingeben:** Bei Bundesländern und Nachbarländern wird die Hauptstadt abgefragt
4. **Fortschritt verfolgen:** Deine Statistiken werden automatisch gespeichert

## Einstellungen

- **Timer aktivieren:** Zeitlimit für jede Frage
- **Timer-Dauer:** Anpassbar von 10 bis 120 Sekunden
- **Statistiken:** Zeige deine Erfolgsquoten und Verbesserungspotenziale
- **Fortschritt zurücksetzen:** Lösche alle gespeicherten Daten

## Lizenz

MIT License - siehe LICENSE Datei für Details.

## Mitwirken

Contributions sind willkommen! Bitte öffne ein Issue oder Pull Request auf GitHub.

## Credits

- Kartendaten: [Quelle einfügen basierend auf verwendeter Karte]
- Entwickelt mit Svelte und TypeScript
```

---

### Step 10.2: Create Deployment Guide

**Create `DEPLOYMENT.md`:**
```markdown
# Deployment Guide

## Option 1: Netlify

### Schritte:

1. **Bei Netlify anmelden:** https://www.netlify.com

2. **Neues Projekt erstellen:**
   - "Add new site" → "Import an existing project"
   - GitHub-Repository verbinden

3. **Build-Einstellungen:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy:** Netlify erstellt automatisch einen Build

### Umgebungsvariablen:

Keine erforderlich für diese Anwendung.

### Custom Domain (optional):

- In Netlify: Site settings → Domain management
- Eigene Domain hinzufügen und DNS konfigurieren

---

## Option 2: Vercel

### Schritte:

1. **Bei Vercel anmelden:** https://vercel.com

2. **Import project:**
   - GitHub-Repository verbinden

3. **Framework preset:** Vite wird automatisch erkannt

4. **Deploy:** Automatischer Build und Deployment

---

## Option 3: GitHub Pages

### Schritte:

1. **vite.config.ts anpassen:**

```typescript
export default defineConfig({
  plugins: [svelte()],
  base: '/geo-learner/', // Repository-Name
  // ... rest of config
})
```

2. **Deploy-Script hinzufügen zu `package.json`:**

```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

3. **gh-pages installieren:**

```bash
npm install -D gh-pages
```

4. **Deployen:**

```bash
npm run deploy
```

5. **GitHub Pages aktivieren:**
   - Repository Settings → Pages
   - Source: gh-pages branch

---

## Option 4: Eigener Server

### Voraussetzungen:

- Webserver (nginx, Apache, etc.)
- SSH-Zugriff

### Schritte:

1. **Build erstellen:**

```bash
npm run build
```

2. **dist-Ordner hochladen:**

```bash
scp -r dist/* user@server:/var/www/html/geo-learner/
```

3. **Nginx-Konfiguration (Beispiel):**

```nginx
server {
    listen 80;
    server_name geo-learner.example.com;

    root /var/www/html/geo-learner;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Server neu laden:**

```bash
sudo systemctl reload nginx
```

---

## Continuous Deployment

### GitHub Actions (für Netlify/Vercel):

Diese Plattformen bieten automatische Deployments bei Git-Push.

### GitHub Actions (für eigenen Server):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/html/geo-learner/"
```

---

## Post-Deployment Checks

- [ ] Anwendung lädt korrekt
- [ ] Alle drei Modi funktionieren
- [ ] Karte wird angezeigt
- [ ] LocalStorage funktioniert
- [ ] Keine Console-Fehler
- [ ] Performance ist gut (< 3s Ladezeit)
- [ ] Funktioniert auf mobilen Geräten
```

---

### Step 10.3: Add Contributing Guidelines

**Create `CONTRIBUTING.md`:**
```markdown
# Contributing to Geographie-Lernapp

Danke für dein Interesse am Projekt!

## Code of Conduct

Sei respektvoll und konstruktiv in allen Interaktionen.

## Wie kann ich beitragen?

### Bugs melden

Öffne ein Issue mit:
- Beschreibung des Problems
- Schritte zur Reproduktion
- Erwartetes vs. tatsächliches Verhalten
- Screenshots (wenn relevant)
- Browser/OS-Version

### Features vorschlagen

Öffne ein Issue mit:
- Beschreibung des Features
- Anwendungsfall
- Mockups/Wireframes (optional)

### Code beitragen

1. **Fork das Repository**

2. **Branch erstellen:**
```bash
git checkout -b feature/your-feature-name
```

3. **Änderungen vornehmen:**
   - Folge dem bestehenden Code-Stil
   - Füge Tests hinzu
   - Update Dokumentation

4. **Tests ausführen:**
```bash
npm test
npm run build
```

5. **Commit:**
```bash
git commit -m "Add feature: description"
```

6. **Push:**
```bash
git push origin feature/your-feature-name
```

7. **Pull Request öffnen**

## Development Setup

```bash
# Clone & Install
git clone https://github.com/yourusername/geo-learner.git
cd geo-learner
npm install

# Run dev server
npm run dev

# Run tests
npm test
```

## Code Style

- TypeScript für Type Safety
- Svelte Component conventions
- Meaningful variable names
- Comments für komplexe Logik
- Tests für neue Features

## Commit Messages

Format: `type: description`

Types:
- `feat`: Neues Feature
- `fix`: Bugfix
- `docs`: Dokumentation
- `style`: Formatierung
- `refactor`: Code-Refactoring
- `test`: Tests
- `chore`: Build/Config-Änderungen

Beispiel:
```
feat: add city mode with 50 cities
fix: correct umlaut handling in capital input
docs: update README with deployment steps
```

## Fragen?

Öffne ein Issue oder kontaktiere die Maintainer.
```

---

## Phase 11: Final Testing & Launch

### Step 11.1: Final QA Checklist

**Perform complete manual testing:**

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Run all tests
npm test

# 3. Check for type errors
npx tsc --noEmit

# 4. Build for production
npm run build

# 5. Test production build
npm run preview
```

**Manual testing:**
- Go through entire TESTING_CHECKLIST.md
- Test on multiple browsers
- Test on different screen sizes
- Verify localStorage works
- Check console for errors
- Test with browser extensions disabled

---

### Step 11.2: Performance Optimization

**Check bundle size:**
```bash
npm run build
```

Review `dist` folder size. Should be < 1MB.

**Optimize SVG:**
- Use https://jakearchibald.github.io/svgomg/ to optimize the map SVG
- Remove unnecessary paths and attributes
- Update `src/assets/germany-map.svg`

**Lazy loading (if needed):**

If bundle is too large, add dynamic imports:

```typescript
// Instead of:
import Statistics from '$lib/components/Statistics.svelte'

// Use:
const Statistics = lazy(() => import('$lib/components/Statistics.svelte'))
```

---

### Step 11.3: Create Release Checklist

**Create `RELEASE_CHECKLIST.md`:**
```markdown
# Release Checklist

## Pre-Release

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] Manual testing complete
- [ ] Performance acceptable
- [ ] Documentation up-to-date
- [ ] CHANGELOG updated

## Release

- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] GitHub release created
- [ ] Deployed to production
- [ ] Production site tested

## Post-Release

- [ ] Monitor for errors
- [ ] Check analytics (if applicable)
- [ ] Respond to user feedback
- [ ] Plan next release
```

---

### Step 11.4: Create CHANGELOG

**Create `CHANGELOG.md`:**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-XX-XX

### Added
- Federal State mode with 16 German states
- Neighbor mode with 9 neighboring countries
- City mode with 20 German cities
- Interactive SVG map
- Capital input with umlaut support
- Score tracking and display
- Session statistics
- Persistent progress tracking
- Optional timer feature
- Settings panel
- Statistics dashboard
- Responsive design for desktop and tablet

### Technical
- Built with Svelte + TypeScript
- Vite build system
- Vitest testing framework
- LocalStorage for data persistence
- Comprehensive test coverage
```

---

## Phase 12: Deployment

### Step 12.1: Prepare for Deployment

**Update `package.json` with metadata:**
```json
{
  "name": "geo-learner",
  "version": "1.0.0",
  "description": "Interactive geography learning app for German states, countries, and cities",
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/geo-learner"
  },
  "keywords": [
    "geography",
    "education",
    "germany",
    "learning",
    "svelte"
  ]
}
```

---

### Step 12.2: Deploy to Netlify

**Instructions:**

1. **Create Netlify account:** https://app.netlify.com/signup

2. **Install Netlify CLI (optional):**
```bash
npm install -g netlify-cli
```

3. **Deploy via CLI:**
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

Or:

4. **Deploy via Web UI:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Click "Deploy site"

5. **Verify deployment:**
   - Visit the provided Netlify URL
   - Test all features
   - Check browser console for errors

**Create `netlify.toml` for configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Step 12.3: Post-Deployment Verification

**Test deployed application:**

```markdown
## Deployment Verification Checklist

- [ ] Site loads successfully
- [ ] No console errors
- [ ] All modes work correctly
- [ ] Map displays and is interactive
- [ ] Capital input works
- [ ] Score tracking works
- [ ] Settings persist
- [ ] Statistics persist
- [ ] Timer works (when enabled)
- [ ] Responsive on mobile
- [ ] Works in all major browsers
- [ ] Performance is good (Lighthouse score > 90)
```

**Run Lighthouse audit:**
- Open Chrome DevTools
- Go to Lighthouse tab
- Run audit on deployed URL
- Address any issues

---

## Completion

Congratulations! The Geographie-Lernapp is now complete and deployed.

### Next Steps

1. **Monitor usage:** Set up analytics if desired
2. **Gather feedback:** Share with users and collect feedback
3. **Plan v1.1:** Based on feedback, plan next features
4. **Maintain:** Address bugs and issues as they arise

### Future Enhancements (v2.0+)

Consider for future versions:
- Expand city list beyond 20
- Add river and mountain geography
- Implement difficulty levels
- Add achievement system
- Audio pronunciation
- Multiple user profiles
- Mobile app versions
- Multiplayer mode

### Support

For questions or issues:
- Check documentation in repo
- Open GitHub issue
- Contact maintainers
