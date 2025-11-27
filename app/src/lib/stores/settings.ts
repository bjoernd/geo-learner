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
