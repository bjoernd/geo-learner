/**
 * Generic localStorage wrapper with error handling and validation
 */

type Validator<T> = (value: unknown) => value is T

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error)
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Cannot save data.')
      if (typeof window !== 'undefined') {
        alert(
          'Speicher voll: Daten können nicht gespeichert werden. ' +
            'Bitte löschen Sie den Browser-Cache in den Einstellungen.'
        )
      }
    }
    return false
  }
}

export function loadFromStorage<T>(
  key: string,
  defaultValue: T,
  validator?: Validator<T>
): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }

    const parsed = JSON.parse(item)

    // Validate data if validator provided
    if (validator) {
      if (!validator(parsed)) {
        console.error(
          `Invalid data structure in localStorage (key: ${key}). Using default value.`
        )
        return defaultValue
      }
    }

    return parsed as T
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
