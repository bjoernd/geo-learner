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
