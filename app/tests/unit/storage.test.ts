import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  isStorageAvailable,
  getStorageSize
} from '$lib/utils/storage'

// Mock localStorage
const createLocalStorageMock = () => {
  const store: Record<string, string> = {}

  return new Proxy(store, {
    get(target, prop: string) {
      if (prop === 'getItem') {
        return (key: string) => target[key] || null
      }
      if (prop === 'setItem') {
        return (key: string, value: string) => {
          target[key] = value
        }
      }
      if (prop === 'removeItem') {
        return (key: string) => {
          delete target[key]
        }
      }
      if (prop === 'clear') {
        return () => {
          Object.keys(target).forEach(key => delete target[key])
        }
      }
      if (prop === 'hasOwnProperty') {
        return (key: string) => key in target
      }
      return target[prop]
    },
    set(target, prop: string, value: string) {
      target[prop] = value
      return true
    },
    deleteProperty(target, prop: string) {
      delete target[prop]
      return true
    },
    ownKeys(target) {
      return Object.keys(target)
    },
    has(target, prop: string) {
      return prop in target
    },
    getOwnPropertyDescriptor(target, prop: string) {
      return {
        enumerable: true,
        configurable: true,
        value: target[prop]
      }
    }
  })
}

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock()
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
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      localStorage.setItem('invalid', 'not valid json {')
      const loaded = loadFromStorage('invalid', 'default')
      expect(loaded).toBe('default')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load from localStorage (key: invalid):'),
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
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
