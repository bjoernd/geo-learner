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
