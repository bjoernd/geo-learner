# Refactoring Proposal: Code Duplication Analysis

**Date:** 2025-11-30
**Analyzed by:** Claude Code
**Project:** Geography Learning App (Svelte 5 + TypeScript)

## Executive Summary

This analysis identified **9 major duplication patterns** across the codebase affecting **15+ files**. The most critical duplications involve:

1. **LocalStorage persistence logic** (duplicated 3 times across stores)
2. **Modal component structure** (duplicated 3 times)
3. **Helper functions for data access** (duplicated 3 times)
4. **Text normalization logic** (duplicated 2 times)
5. **Distance calculation** (duplicated 2 times)
6. **Modal styling** (duplicated 3 times with 200+ lines)
7. **Event dispatcher patterns** (repeated 8+ times)
8. **Button styling patterns** (duplicated 4+ times)
9. **Color constants** (duplicated 12-27 times across 9+ files)

**Estimated Impact:**
- Potential reduction: ~400-500 lines of code
- Affected files: 15+
- Priority issues: 3 critical, 3 high, 3 medium

---

## 1. LocalStorage Persistence Logic [CRITICAL]

### Duplication Analysis

**Pattern appears in:**
1. `/Users/bjoernd/src/geo-learner/app/src/lib/stores/settings.ts` (lines 11-35)
2. `/Users/bjoernd/src/geo-learner/app/src/lib/stores/statistics.ts` (lines 23-45)
3. Indirectly in utilities at `/Users/bjoernd/src/geo-learner/app/src/lib/utils/storage.ts`

**Duplicated Code Pattern:**

```typescript
// Pattern 1: In settings.ts
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

// Subscribe to save on changes
subscribe((settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
})

// Pattern 2: In statistics.ts (nearly identical)
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

subscribe((stats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save statistics:', error)
  }
})
```

**Problem:** The storage utilities in `storage.ts` already provide `loadFromStorage` and `saveToStorage` functions, but the stores don't use them.

### Recommended Refactoring

**Create:** `/Users/bjoernd/src/geo-learner/app/src/lib/stores/createPersistedStore.ts`

```typescript
import { writable, type Writable } from 'svelte/store'
import { loadFromStorage, saveToStorage } from '$lib/utils/storage'

interface PersistedStoreOptions<T> {
  key: string
  defaultValue: T
  merge?: boolean // Whether to merge loaded data with defaults
}

export function createPersistedStore<T>(
  options: PersistedStoreOptions<T>
): Writable<T> & { reset: () => void } {
  const { key, defaultValue, merge = false } = options

  // Load initial value
  const initialValue = loadFromStorage(key, defaultValue)
  const mergedValue = merge ? { ...defaultValue, ...initialValue } : initialValue

  const { subscribe, set, update } = writable<T>(mergedValue)

  // Auto-save on changes
  subscribe((value) => {
    saveToStorage(key, value)
  })

  return {
    subscribe,
    set,
    update,
    reset: () => set(defaultValue)
  }
}
```

**Update settings.ts:**

```typescript
import { createPersistedStore } from './createPersistedStore'
import type { Settings } from '$lib/types'

const STORAGE_KEY = 'geo-learner-settings'

const defaultSettings: Settings = {
  timerEnabled: false,
  timerDuration: 30
}

function createSettingsStore() {
  const store = createPersistedStore({
    key: STORAGE_KEY,
    defaultValue: defaultSettings,
    merge: true // Merge to handle schema changes
  })

  return {
    ...store,
    setTimerEnabled: (enabled: boolean) => {
      store.update(s => ({ ...s, timerEnabled: enabled }))
    },
    setTimerDuration: (duration: number) => {
      store.update(s => ({ ...s, timerDuration: duration }))
    }
  }
}

export const settings = createSettingsStore()
```

**Update statistics.ts:**

```typescript
import { createPersistedStore } from './createPersistedStore'
import type { Statistics, GameSession } from '$lib/types'

const STORAGE_KEY = 'geo-learner-statistics'

// ... defaultStatistics definition ...

function createStatisticsStore() {
  const store = createPersistedStore({
    key: STORAGE_KEY,
    defaultValue: defaultStatistics,
    merge: false
  })

  return {
    ...store,
    recordSession: (session: GameSession) => {
      store.update(stats => {
        // ... existing logic ...
      })
    }
  }
}

export const statistics = createStatisticsStore()
```

**Impact:**
- Eliminates ~40 lines of duplicated code across 2 files
- Creates reusable pattern for future stores
- Centralizes error handling and storage logic
- Easier to add features like storage quota warnings

**Priority:** CRITICAL

---

## 2. Data Helper Functions [CRITICAL]

### Duplication Analysis

**Pattern appears in:**
1. `/Users/bjoernd/src/geo-learner/app/src/lib/data/federalStates.ts` (lines 103-113)
2. `/Users/bjoernd/src/geo-learner/app/src/lib/data/neighboringCountries.ts` (lines 60-70)
3. `/Users/bjoernd/src/geo-learner/app/src/lib/data/cities.ts` (lines 191-206)

**Duplicated Code Pattern:**

```typescript
// federalStates.ts
export function getFederalStateById(id: string): FederalState | undefined {
  return federalStates.find(state => state.id === id)
}

export function getFederalStateByName(name: string): FederalState | undefined {
  return federalStates.find(state =>
    state.name.toLowerCase() === name.toLowerCase()
  )
}

// neighboringCountries.ts (identical pattern)
export function getCountryById(id: string): Country | undefined {
  return neighboringCountries.find(country => country.id === id)
}

export function getCountryByName(name: string): Country | undefined {
  return neighboringCountries.find(country =>
    country.name.toLowerCase() === name.toLowerCase()
  )
}

// cities.ts (identical pattern + extra function)
export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id)
}

export function getCityByName(name: string): City | undefined {
  return cities.find(city =>
    city.name.toLowerCase() === name.toLowerCase()
  )
}

export function getCitiesByStateId(stateId: string): City[] {
  return cities.filter(city => city.stateId === stateId)
}
```

### Recommended Refactoring

**Create:** `/Users/bjoernd/src/geo-learner/app/src/lib/data/dataHelpers.ts`

```typescript
import type { Location } from '$lib/types'

/**
 * Generic helper to find location by ID
 */
export function findLocationById<T extends Location>(
  locations: readonly T[],
  id: string
): T | undefined {
  return locations.find(loc => loc.id === id)
}

/**
 * Generic helper to find location by name (case-insensitive)
 */
export function findLocationByName<T extends Location>(
  locations: readonly T[],
  name: string
): T | undefined {
  return locations.find(loc =>
    loc.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Generic helper to filter locations by property
 */
export function filterLocationsByProperty<T extends Location, K extends keyof T>(
  locations: readonly T[],
  property: K,
  value: T[K]
): T[] {
  return locations.filter(loc => loc[property] === value)
}
```

**Update federalStates.ts:**

```typescript
import type { FederalState } from '$lib/types'
import { findLocationById, findLocationByName } from './dataHelpers'

export const federalStates: FederalState[] = [
  // ... data ...
]

export const getFederalStateById = (id: string) =>
  findLocationById(federalStates, id)

export const getFederalStateByName = (name: string) =>
  findLocationByName(federalStates, name)
```

**Update neighboringCountries.ts:**

```typescript
import type { Country } from '$lib/types'
import { findLocationById, findLocationByName } from './dataHelpers'

export const neighboringCountries: Country[] = [
  // ... data ...
]

export const getCountryById = (id: string) =>
  findLocationById(neighboringCountries, id)

export const getCountryByName = (name: string) =>
  findLocationByName(neighboringCountries, name)
```

**Update cities.ts:**

```typescript
import type { City } from '$lib/types'
import { findLocationById, findLocationByName, filterLocationsByProperty } from './dataHelpers'

export const cities: City[] = [
  // ... data ...
]

export const getCityById = (id: string) =>
  findLocationById(cities, id)

export const getCityByName = (name: string) =>
  findLocationByName(cities, name)

export const getCitiesByStateId = (stateId: string) =>
  filterLocationsByProperty(cities, 'stateId', stateId)
```

**Impact:**
- Eliminates ~40 lines of duplicated code across 3 files
- Type-safe generic functions
- Single place to update search logic (e.g., fuzzy matching)
- Easier to add new helper functions

**Priority:** CRITICAL

---

## 3. Modal Component Structure [HIGH]

### Duplication Analysis

**Pattern appears in:**
1. `/Users/bjoernd/src/geo-learner/app/src/lib/components/Settings.svelte`
2. `/Users/bjoernd/src/geo-learner/app/src/lib/components/Statistics.svelte`
3. `/Users/bjoernd/src/geo-learner/app/src/lib/components/CapitalInputModal.svelte`

**Duplicated Structural Pattern:**

All three modals share:
- Identical overlay structure with fade transition
- Identical modal header with close button
- Same click-outside-to-close behavior
- Same escape key handling
- Nearly identical CSS for overlay, modal content, header, and close button

**Example from Settings.svelte (lines 38-57):**

```svelte
{#if show}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="modal-content"
      transition:slide={{ duration: 200 }}
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="modal-header">
        <h2>Einstellungen</h2>
        <button class="close-button" onclick={handleClose}>✕</button>
      </div>
      <!-- Modal body content -->
    </div>
  </div>
{/if}
```

**Duplicated CSS (200+ lines total):**

```css
/* Appears in all 3 modals with minor variations */
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
  min-width: 500px; /* Varies: 400px, 500px, 600px */
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

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  line-height: 1;
}
```

### Recommended Refactoring

**Create:** `/Users/bjoernd/src/geo-learner/app/src/lib/components/Modal.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, slide } from 'svelte/transition'

  export let show: boolean = false
  export let title: string
  export let size: 'small' | 'medium' | 'large' = 'medium'
  export let closeOnClickOutside: boolean = true
  export let closeOnEscape: boolean = true

  const dispatch = createEventDispatcher<{
    close: void
  }>()

  const sizeClasses = {
    small: 'min-width: 400px',
    medium: 'min-width: 500px',
    large: 'min-width: 600px'
  }

  function handleClose() {
    dispatch('close')
  }

  function handleOverlayClick() {
    if (closeOnClickOutside) {
      handleClose()
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape') {
      handleClose()
    }
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="modal-content"
      style={sizeClasses[size]}
      transition:slide={{ duration: 200 }}
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="modal-header">
        <h2>{title}</h2>
        <button class="close-button" onclick={handleClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <slot />
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

  .modal-body {
    /* Content padding handled by parent */
  }
</style>
```

**Update Settings.svelte:**

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { settings } from '$lib/stores/settings'
  import Modal from './Modal.svelte'
  import { slide } from 'svelte/transition'

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

  // ... other handlers ...
</script>

<Modal {show} title="Einstellungen" size="medium" on:close={handleClose}>
  <div class="settings-section">
    <h3>Timer</h3>
    <!-- Timer settings content -->
  </div>

  <div class="settings-section">
    <h3>Statistiken</h3>
    <!-- Statistics button -->
  </div>

  <div class="settings-section danger-zone">
    <h3>Zurücksetzen</h3>
    <!-- Reset content -->
  </div>
</Modal>

<style>
  /* Only component-specific styles, no modal overlay/content styles */
  .settings-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }
  /* ... rest of component-specific styles ... */
</style>
```

**Similar updates for Statistics.svelte and CapitalInputModal.svelte**

**Impact:**
- Eliminates ~200 lines of duplicated CSS
- Eliminates ~50 lines of duplicated markup
- Single source of truth for modal behavior
- Easier to add features like animations, backdrop blur, etc.
- Consistent UX across all modals

**Priority:** HIGH

---

## 4. Text Normalization Logic [HIGH]

### Duplication Analysis

**Pattern appears in:**
1. `/Users/bjoernd/src/geo-learner/app/src/lib/utils/textMatching.ts` (lines 9-26)
2. `/Users/bjoernd/src/geo-learner/app/src/lib/stores/gameState.ts` (lines 241-251)

**Duplicated Code:**

```typescript
// textMatching.ts
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss')
    .replace(/ue/g, 'u')
    .replace(/oe/g, 'o')
    .replace(/ae/g, 'a')
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

// gameState.ts (lines 241-251) - slightly different version
function compareCapitalAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (str: string) =>
    str.toLowerCase()
      .trim()
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ä/g, 'a')
      .replace(/ß/g, 'ss')

  return normalize(userAnswer) === normalize(correctAnswer)
}
```

**Problem:** `gameState.ts` has its own version of text normalization instead of using the utility.

### Recommended Refactoring

**Update gameState.ts:**

```typescript
import { compareText } from '$lib/utils/textMatching'

// Remove the local compareCapitalAnswer function

// Update line 128:
const correct = compareText(userAnswer, correctCapital)
```

**Impact:**
- Eliminates ~10 lines of duplicated code
- Consistent normalization logic throughout app
- The `textMatching.ts` version is more comprehensive (handles special chars, etc.)

**Priority:** HIGH

---

## 5. Distance Calculation Logic [MEDIUM]

### Duplication Analysis

**Pattern appears in:**
1. `/Users/bjoernd/src/geo-learner/app/src/lib/utils/textMatching.ts` (lines 52-59)
2. `/Users/bjoernd/src/geo-learner/app/src/lib/stores/gameState.ts` (lines 230-239)

**Duplicated Code:**

```typescript
// textMatching.ts
export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// gameState.ts
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
```

**Problem:** `gameState.ts` recalculates distance instead of using the utility. Note that `textMatching.ts` already has `isClickNearPoint` which does exactly what `isClickNearCity` does.

### Recommended Refactoring

**Update gameState.ts:**

```typescript
import { isClickNearPoint } from '$lib/utils/textMatching'

// Remove the local isClickNearCity function (lines 230-239)

// Update line 65:
correct = isClickNearPoint(clickPosition, city.coordinates, 30)
```

**Impact:**
- Eliminates ~10 lines of duplicated code
- Consistent distance calculation
- Easier to adjust threshold globally if needed

**Priority:** MEDIUM

---

## 6. Button Styling Patterns [MEDIUM]

### Duplication Analysis

**Pattern appears in:**
1. Settings.svelte (lines 234-303)
2. CapitalInputModal.svelte (lines 197-227)
3. App.svelte (lines 374-388)

**Duplicated CSS:**

```css
/* Similar button styles repeated across components */
.action-button,
.submit-button,
.continue-button,
.end-session-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Primary blue button */
.action-button,
.submit-button {
  background-color: #1976d2;
  color: white;
}

.action-button:hover,
.submit-button:hover {
  background-color: #1565c0;
}

/* Success green button */
.continue-button {
  background-color: #4caf50;
  color: white;
}

/* Danger red button */
.danger-button,
.end-session-button {
  background-color: #f44336;
  color: white;
}
```

### Recommended Refactoring

**Create:** `/Users/bjoernd/src/geo-learner/app/src/styles/buttons.css`

```css
/* Base button styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary button (blue) */
.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1565c0;
}

/* Success button (green) */
.btn-success {
  background-color: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #45a049;
}

/* Danger button (red) */
.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #d32f2f;
}

/* Secondary button (gray) */
.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d0d0d0;
}

/* Full width variant */
.btn-full {
  width: 100%;
}
```

**Import in global styles or components:**

```svelte
<!-- In App.svelte or main layout -->
<style>
  @import './styles/buttons.css';

  /* Component-specific styles */
</style>
```

**Update components to use standard classes:**

```svelte
<!-- Instead of custom .submit-button -->
<button class="btn btn-primary" onclick={handleSubmit}>
  Bestätigen
</button>

<!-- Instead of custom .continue-button -->
<button class="btn btn-success btn-full" onclick={handleClose}>
  Weiter
</button>

<!-- Instead of custom .end-session-button -->
<button class="btn btn-danger" onclick={handleEndSession}>
  Sitzung beenden
</button>
```

**Impact:**
- Eliminates ~80 lines of duplicated CSS
- Consistent button appearance and behavior
- Easy to add new button variants
- Better maintainability

**Priority:** MEDIUM (lower priority, but significant CSS savings)

---

## 7. Event Dispatcher Type Definitions [LOW]

### Duplication Analysis

**Pattern appears in 8+ components** with similar structure:

```typescript
const dispatch = createEventDispatcher<{
  close: void
}>()

function handleClose() {
  dispatch('close')
}
```

**Not truly duplicated** (each component has different events), but there's an opportunity for a pattern improvement.

### Recommended Refactoring

Consider creating typed event helpers, but this is lower priority. The current pattern is explicit and clear.

**Priority:** LOW (documentation/pattern rather than refactoring)

---

## 8. Shuffle Function [LOW]

### Duplication Analysis

The `shuffle` function in `gameState.ts` (lines 221-228) is a common utility that could be moved to a utils file if reused elsewhere.

**Current location:** Only used in `gameState.ts`

**Recommendation:** Leave as-is unless shuffle is needed elsewhere. The YAGNI principle applies here.

**Priority:** LOW (not currently duplicated)

---

## 9. Color Constants [MEDIUM]

### Duplication Analysis

**Color values duplicated across 9+ files:**

- `#1976d2` (primary blue): 12 occurrences in 9 files
- `#4caf50` (success green): 5 occurrences in 2 files
- `#f44336` (danger red): 10 occurrences in 7 files
- `#e0e0e0` (gray): Many occurrences
- Other brand colors scattered throughout

**Files affected:**
- App.svelte
- Map.svelte
- Timer.svelte
- ScoreDisplay.svelte
- CapitalInputModal.svelte
- Settings.svelte
- Statistics.svelte
- ModeSelector.svelte
- ErrorBoundary.svelte

**Example duplication:**

```css
/* In multiple components */
.some-element {
  background-color: #1976d2; /* Primary blue */
  color: white;
}

.some-other-element {
  border-color: #1976d2;
}

.success-state {
  color: #4caf50; /* Success green */
}

.danger-button {
  background-color: #f44336; /* Danger red */
}
```

### Recommended Refactoring

**Create:** `/Users/bjoernd/src/geo-learner/app/src/styles/variables.css`

```css
:root {
  /* Primary colors */
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-primary-light: #e3f2fd;

  /* Success colors */
  --color-success: #4caf50;
  --color-success-dark: #45a049;
  --color-success-light: #e8f5e9;

  /* Danger/Error colors */
  --color-danger: #f44336;
  --color-danger-dark: #d32f2f;
  --color-danger-light: #ffebee;

  /* Warning colors */
  --color-warning: #ff9800;
  --color-warning-dark: #f57c00;
  --color-warning-light: #fff9e6;

  /* Neutral colors */
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e0e0e0;
  --color-gray-300: #d0d0d0;
  --color-gray-500: #999;
  --color-gray-600: #666;
  --color-gray-700: #555;
  --color-gray-900: #333;

  /* Semantic colors */
  --color-background: #f5f5f5;
  --color-surface: #ffffff;
  --color-text-primary: #333;
  --color-text-secondary: #666;
  --color-text-disabled: #999;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 4px 20px rgba(0, 0, 0, 0.3);

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

**Update components to use CSS variables:**

```css
/* Before */
.score-value {
  color: #1976d2;
}

/* After */
.score-value {
  color: var(--color-primary);
}

/* Before */
.danger-button {
  background-color: #f44336;
}

.danger-button:hover {
  background-color: #d32f2f;
}

/* After */
.danger-button {
  background-color: var(--color-danger);
}

.danger-button:hover {
  background-color: var(--color-danger-dark);
}
```

**Import in App.svelte or main entry:**

```svelte
<script>
  import './styles/variables.css'
</script>
```

### Benefits

1. **Consistency:** All colors defined in one place
2. **Theming:** Easy to add dark mode or alternative themes
3. **Maintainability:** Change brand colors in one location
4. **Accessibility:** Can adjust colors globally for contrast requirements
5. **Type safety:** Can generate TypeScript types from CSS variables if needed

### Impact

- Eliminates hardcoded color values across 9+ files
- Single source of truth for design system
- Easier to maintain brand consistency
- Foundation for future theming support

**Priority:** MEDIUM (improves maintainability, enables future features)

---

## Refactoring Priority Roadmap

### Phase 1: Critical Foundations (Day 1)
1. **LocalStorage Abstraction** - Create `createPersistedStore.ts` and update stores
2. **Data Helpers** - Create `dataHelpers.ts` and update data files
3. **Text Normalization** - Remove duplication in gameState.ts

**Estimated impact:** ~100 lines removed, 3 files created, 5 files updated

### Phase 2: Component Structure (Day 2)
4. **Modal Component** - Create shared Modal.svelte and update 3 modals
5. **Distance Calculation** - Use existing utility in gameState.ts

**Estimated impact:** ~250 lines removed, 1 file created, 4 files updated

### Phase 3: Polish (Day 3)
6. **Button Styles** - Create shared button CSS and update components
7. **Color Constants** - Create CSS variables file and update all components

**Estimated impact:** ~100+ lines updated, 2 files created, 9+ files updated

---

## Testing Strategy

For each refactoring:

1. **Before refactoring:**
   - Run all existing tests: `npm run test:run`
   - Document current behavior
   - Create benchmarks if performance-critical

2. **During refactoring:**
   - Make changes incrementally
   - Test after each step
   - Ensure TypeScript compilation succeeds

3. **After refactoring:**
   - Run full test suite
   - Manual testing of affected features
   - Check bundle size hasn't increased

---

## Metrics

### Code Reduction Estimates

| Refactoring | Lines Removed | Files Affected | Priority |
|-------------|---------------|----------------|----------|
| LocalStorage | ~40 | 3 | CRITICAL |
| Data Helpers | ~40 | 4 | CRITICAL |
| Modal Component | ~250 | 4 | HIGH |
| Text Normalization | ~10 | 2 | HIGH |
| Distance Calc | ~10 | 2 | MEDIUM |
| Button Styles | ~80 | 4+ | MEDIUM |
| Color Constants | ~30 (replacements) | 9+ | MEDIUM |
| **TOTAL** | **~460** | **17+** | - |

### Maintainability Improvements

- **Before:** 15+ files with duplicated patterns
- **After:** 5 new utility files, 15+ simplified files
- **Reusability:** 5 new reusable abstractions
- **Type Safety:** Improved with generics in data helpers

---

## Notes

- All refactorings maintain existing functionality
- No breaking changes to public APIs
- TypeScript types preserved or improved
- Test coverage should remain the same or improve
- Follow project conventions from CLAUDE.md

---

## Next Steps

1. Review this proposal with the team
2. Create issues/tickets for each refactoring
3. Implement in priority order
4. Create tests for new utilities
5. Update documentation as needed

