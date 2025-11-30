import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPersistedStore } from '$lib/stores/createPersistedStore'
import { get } from 'svelte/store'

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

describe('createPersistedStore', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should create store with default value when storage is empty', () => {
    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0, name: 'test' }
    })

    const value = get(store)
    expect(value).toEqual({ count: 0, name: 'test' })
  })

  it('should load value from storage if available', () => {
    localStorage.setItem('test-store', JSON.stringify({ count: 42, name: 'loaded' }))

    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0, name: 'test' }
    })

    const value = get(store)
    expect(value).toEqual({ count: 42, name: 'loaded' })
  })

  it('should persist changes to storage on update', () => {
    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0 }
    })

    store.set({ count: 5 })

    const stored = localStorage.getItem('test-store')
    expect(stored).toBe(JSON.stringify({ count: 5 }))
  })

  it('should persist changes when using update method', () => {
    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0 }
    })

    store.update(state => ({ count: state.count + 1 }))

    const stored = localStorage.getItem('test-store')
    expect(stored).toBe(JSON.stringify({ count: 1 }))
  })

  it('should reset to default value when reset is called', () => {
    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0, name: 'default' }
    })

    store.set({ count: 42, name: 'changed' })
    expect(get(store)).toEqual({ count: 42, name: 'changed' })

    store.reset()
    expect(get(store)).toEqual({ count: 0, name: 'default' })
  })

  it('should persist reset value to storage', () => {
    const store = createPersistedStore({
      key: 'test-store',
      defaultValue: { count: 0 }
    })

    store.set({ count: 99 })
    store.reset()

    const stored = localStorage.getItem('test-store')
    expect(stored).toBe(JSON.stringify({ count: 0 }))
  })

  describe('merge option', () => {
    it('should not merge by default', () => {
      localStorage.setItem('test-store', JSON.stringify({ count: 42 }))

      const store = createPersistedStore({
        key: 'test-store',
        defaultValue: { count: 0, name: 'default', extra: 'value' }
      })

      const value = get(store)
      expect(value).toEqual({ count: 42 })
      expect(value).not.toHaveProperty('name')
      expect(value).not.toHaveProperty('extra')
    })

    it('should merge loaded data with defaults when merge=true', () => {
      localStorage.setItem('test-store', JSON.stringify({ count: 42 }))

      const store = createPersistedStore({
        key: 'test-store',
        defaultValue: { count: 0, name: 'default', extra: 'value' },
        merge: true
      })

      const value = get(store)
      expect(value).toEqual({ count: 42, name: 'default', extra: 'value' })
    })

    it('should prioritize loaded values over defaults when merge=true', () => {
      localStorage.setItem('test-store', JSON.stringify({ count: 42, name: 'loaded' }))

      const store = createPersistedStore({
        key: 'test-store',
        defaultValue: { count: 0, name: 'default', extra: 'value' },
        merge: true
      })

      const value = get(store)
      expect(value).toEqual({ count: 42, name: 'loaded', extra: 'value' })
    })

    it('should handle empty storage with merge=true', () => {
      const store = createPersistedStore({
        key: 'empty-store',
        defaultValue: { count: 0, name: 'default' },
        merge: true
      })

      const value = get(store)
      expect(value).toEqual({ count: 0, name: 'default' })
    })
  })

  it('should work with different data types', () => {
    const stringStore = createPersistedStore({
      key: 'string-store',
      defaultValue: 'hello'
    })

    stringStore.set('world')
    expect(get(stringStore)).toBe('world')
    expect(localStorage.getItem('string-store')).toBe(JSON.stringify('world'))
  })

  it('should work with arrays', () => {
    const arrayStore = createPersistedStore({
      key: 'array-store',
      defaultValue: [1, 2, 3]
    })

    arrayStore.set([4, 5, 6])
    expect(get(arrayStore)).toEqual([4, 5, 6])
  })

  it('should work with numbers', () => {
    const numberStore = createPersistedStore({
      key: 'number-store',
      defaultValue: 0
    })

    numberStore.set(42)
    expect(get(numberStore)).toBe(42)
  })

  it('should work with booleans', () => {
    const boolStore = createPersistedStore({
      key: 'bool-store',
      defaultValue: false
    })

    boolStore.set(true)
    expect(get(boolStore)).toBe(true)
  })

  it('should handle complex nested objects', () => {
    const complexStore = createPersistedStore({
      key: 'complex-store',
      defaultValue: {
        user: { name: 'test', age: 25 },
        settings: { theme: 'dark', notifications: true },
        items: [1, 2, 3]
      }
    })

    const newValue = {
      user: { name: 'updated', age: 30 },
      settings: { theme: 'light', notifications: false },
      items: [4, 5, 6]
    }
    complexStore.set(newValue)

    expect(get(complexStore)).toEqual(newValue)
    expect(JSON.parse(localStorage.getItem('complex-store')!)).toEqual(newValue)
  })

  it('should handle corrupted storage data gracefully', () => {
    localStorage.setItem('corrupt-store', 'this is not valid JSON{')

    const store = createPersistedStore({
      key: 'corrupt-store',
      defaultValue: { count: 0 }
    })

    // Should fall back to default value when storage is corrupted
    const value = get(store)
    expect(value).toEqual({ count: 0 })
  })

  it('should be reactive to subscriptions', () => {
    const store = createPersistedStore({
      key: 'reactive-store',
      defaultValue: { count: 0 }
    })

    const values: any[] = []
    const unsubscribe = store.subscribe(value => {
      values.push(value)
    })

    store.set({ count: 1 })
    store.set({ count: 2 })

    unsubscribe()

    expect(values).toHaveLength(3)
    expect(values[0]).toEqual({ count: 0 })
    expect(values[1]).toEqual({ count: 1 })
    expect(values[2]).toEqual({ count: 2 })
  })
})
