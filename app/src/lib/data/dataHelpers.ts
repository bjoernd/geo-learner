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
