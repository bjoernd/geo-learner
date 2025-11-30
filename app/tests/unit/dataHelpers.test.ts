import { describe, it, expect } from 'vitest'
import { findLocationById, findLocationByName, filterLocationsByProperty } from '$lib/data/dataHelpers'
import type { FederalState, NeighboringCountry, City } from '$lib/types'

describe('dataHelpers', () => {
  describe('findLocationById', () => {
    const testStates: FederalState[] = [
      { id: 'by', name: 'Bayern', capital: 'München', svgPathId: 'bayern' },
      { id: 'bw', name: 'Baden-Württemberg', capital: 'Stuttgart', svgPathId: 'bw' },
      { id: 'be', name: 'Berlin', capital: 'Berlin', svgPathId: 'berlin' }
    ]

    it('should find location by ID', () => {
      const result = findLocationById(testStates, 'by')
      expect(result).toBeDefined()
      expect(result?.name).toBe('Bayern')
      expect(result?.capital).toBe('München')
    })

    it('should return undefined for non-existent ID', () => {
      const result = findLocationById(testStates, 'invalid')
      expect(result).toBeUndefined()
    })

    it('should handle empty array', () => {
      const result = findLocationById([], 'by')
      expect(result).toBeUndefined()
    })

    it('should find first match when multiple items exist', () => {
      const duplicates: FederalState[] = [
        ...testStates,
        { id: 'by', name: 'Duplicate', capital: 'Test', svgPathId: 'test' }
      ]
      const result = findLocationById(duplicates, 'by')
      expect(result?.name).toBe('Bayern')
    })
  })

  describe('findLocationByName', () => {
    const testCountries: NeighboringCountry[] = [
      { id: 'fr', name: 'Frankreich', capital: 'Paris', svgPathId: 'france' },
      { id: 'pl', name: 'Polen', capital: 'Warschau', svgPathId: 'poland' },
      { id: 'ch', name: 'Schweiz', capital: 'Bern', svgPathId: 'switzerland' }
    ]

    it('should find location by exact name', () => {
      const result = findLocationByName(testCountries, 'Frankreich')
      expect(result).toBeDefined()
      expect(result?.id).toBe('fr')
      expect(result?.capital).toBe('Paris')
    })

    it('should find location by name (case-insensitive)', () => {
      const result = findLocationByName(testCountries, 'frankreich')
      expect(result).toBeDefined()
      expect(result?.id).toBe('fr')
    })

    it('should find location by name with different casing', () => {
      const result = findLocationByName(testCountries, 'POLEN')
      expect(result).toBeDefined()
      expect(result?.id).toBe('pl')
    })

    it('should return undefined for non-existent name', () => {
      const result = findLocationByName(testCountries, 'Invalid')
      expect(result).toBeUndefined()
    })

    it('should handle empty array', () => {
      const result = findLocationByName([], 'Frankreich')
      expect(result).toBeUndefined()
    })

    it('should handle partial matches as non-matches', () => {
      const result = findLocationByName(testCountries, 'Frank')
      expect(result).toBeUndefined()
    })
  })

  describe('filterLocationsByProperty', () => {
    const testCities: City[] = [
      { id: 'muenchen', name: 'München', stateId: 'by', svgPathId: 'muc', coordinates: { x: 100, y: 200 } },
      { id: 'nuernberg', name: 'Nürnberg', stateId: 'by', svgPathId: 'nue', coordinates: { x: 110, y: 190 } },
      { id: 'stuttgart', name: 'Stuttgart', stateId: 'bw', svgPathId: 'str', coordinates: { x: 90, y: 210 } },
      { id: 'berlin', name: 'Berlin', stateId: 'be', svgPathId: 'ber', coordinates: { x: 150, y: 100 } }
    ]

    it('should filter locations by property', () => {
      const bavarianCities = filterLocationsByProperty(testCities, 'stateId', 'by')
      expect(bavarianCities).toHaveLength(2)
      expect(bavarianCities[0].name).toBe('München')
      expect(bavarianCities[1].name).toBe('Nürnberg')
    })

    it('should return empty array when no matches', () => {
      const result = filterLocationsByProperty(testCities, 'stateId', 'invalid')
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    it('should filter by id property', () => {
      const result = filterLocationsByProperty(testCities, 'id', 'muenchen')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('München')
    })

    it('should filter by name property', () => {
      const result = filterLocationsByProperty(testCities, 'name', 'Berlin')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('berlin')
    })

    it('should handle empty array', () => {
      const result = filterLocationsByProperty([], 'stateId', 'by')
      expect(result).toHaveLength(0)
    })

    it('should return all matching items', () => {
      const allCities = filterLocationsByProperty(testCities, 'stateId', 'by')
      expect(allCities).toHaveLength(2)
      allCities.forEach(city => {
        expect(city.stateId).toBe('by')
      })
    })

    it('should work with different property types', () => {
      // Filter by svgPathId (string property)
      const result = filterLocationsByProperty(testCities, 'svgPathId', 'muc')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('München')
    })
  })
})
