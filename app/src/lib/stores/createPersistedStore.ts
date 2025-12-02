import { writable, type Writable } from 'svelte/store'
import { loadFromStorage, saveToStorage } from '$lib/utils/storage'

type Validator<T> = (value: unknown) => value is T

interface PersistedStoreOptions<T> {
  key: string
  defaultValue: T
  merge?: boolean // Whether to merge loaded data with defaults
  validator?: Validator<T> // Optional validator for data integrity
}

export function createPersistedStore<T>(
  options: PersistedStoreOptions<T>
): Writable<T> & { reset: () => void } {
  const { key, defaultValue, merge = false, validator } = options

  // Load initial value with validation
  const initialValue = loadFromStorage(key, defaultValue, validator)
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
