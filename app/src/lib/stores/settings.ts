import { createPersistedStore } from './createPersistedStore'
import type { Settings } from '$lib/types'
import { validateSettings } from '$lib/utils/validators'

const STORAGE_KEY = 'geo-learner-settings'

const defaultSettings: Settings = {
  timerEnabled: false,
  timerDuration: 30
}

function createSettingsStore() {
  const store = createPersistedStore({
    key: STORAGE_KEY,
    defaultValue: defaultSettings,
    merge: true, // Merge to handle schema changes
    validator: validateSettings
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
