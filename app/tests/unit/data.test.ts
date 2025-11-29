import { describe, it, expect } from 'vitest'
import { federalStates, getFederalStateById, getFederalStateByName } from '$lib/data/federalStates'
import { neighboringCountries, getCountryById, getCountryByName } from '$lib/data/neighboringCountries'
import { cities, getCityById, getCityByName, getCitiesByStateId } from '$lib/data/cities'

describe('Federal States Data', () => {
  it('should have exactly 16 federal states', () => {
    expect(federalStates).toHaveLength(16)
  })

  it('should have all required fields for each state', () => {
    federalStates.forEach(state => {
      expect(state).toHaveProperty('id')
      expect(state).toHaveProperty('name')
      expect(state).toHaveProperty('capital')
      expect(state).toHaveProperty('svgPathId')
      expect(typeof state.id).toBe('string')
      expect(typeof state.name).toBe('string')
      expect(typeof state.capital).toBe('string')
      expect(typeof state.svgPathId).toBe('string')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = federalStates.map(s => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find state by ID', () => {
    const bayern = getFederalStateById('by')
    expect(bayern).toBeDefined()
    expect(bayern?.name).toBe('Bayern')
    expect(bayern?.capital).toBe('München')
  })

  it('should find state by name (case-insensitive)', () => {
    const bayern = getFederalStateByName('bayern')
    expect(bayern).toBeDefined()
    expect(bayern?.id).toBe('by')
  })

  it('should return undefined for non-existent state', () => {
    expect(getFederalStateById('invalid')).toBeUndefined()
    expect(getFederalStateByName('invalid')).toBeUndefined()
  })
})

describe('Neighboring Countries Data', () => {
  it('should have exactly 9 neighboring countries', () => {
    expect(neighboringCountries).toHaveLength(9)
  })

  it('should have all required fields for each country', () => {
    neighboringCountries.forEach(country => {
      expect(country).toHaveProperty('id')
      expect(country).toHaveProperty('name')
      expect(country).toHaveProperty('capital')
      expect(country).toHaveProperty('svgPathId')
      expect(typeof country.id).toBe('string')
      expect(typeof country.name).toBe('string')
      expect(typeof country.capital).toBe('string')
      expect(typeof country.svgPathId).toBe('string')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = neighboringCountries.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find country by ID', () => {
    const france = getCountryById('fr')
    expect(france).toBeDefined()
    expect(france?.name).toBe('Frankreich')
    expect(france?.capital).toBe('Paris')
  })

  it('should find country by name (case-insensitive)', () => {
    const france = getCountryByName('frankreich')
    expect(france).toBeDefined()
    expect(france?.id).toBe('fr')
  })
})

describe('Cities Data', () => {
  it('should have exactly 26 cities', () => {
    expect(cities).toHaveLength(26)
  })

  it('should have all required fields for each city', () => {
    cities.forEach(city => {
      expect(city).toHaveProperty('id')
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('stateId')
      expect(city).toHaveProperty('svgPathId')
      expect(city).toHaveProperty('coordinates')
      expect(city.coordinates).toHaveProperty('x')
      expect(city.coordinates).toHaveProperty('y')
      expect(typeof city.id).toBe('string')
      expect(typeof city.name).toBe('string')
      expect(typeof city.stateId).toBe('string')
      expect(typeof city.svgPathId).toBe('string')
      expect(typeof city.coordinates.x).toBe('number')
      expect(typeof city.coordinates.y).toBe('number')
    })
  })

  it('should have no duplicate IDs', () => {
    const ids = cities.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should find city by ID', () => {
    const munich = getCityById('muenchen')
    expect(munich).toBeDefined()
    expect(munich?.name).toBe('München')
  })

  it('should find city by name', () => {
    const munich = getCityByName('München')
    expect(munich).toBeDefined()
    expect(munich?.id).toBe('muenchen')
  })

  it('should find cities by state ID', () => {
    const bavarianCities = getCitiesByStateId('by')
    expect(bavarianCities.length).toBeGreaterThan(0)
    bavarianCities.forEach(city => {
      expect(city.stateId).toBe('by')
    })
  })

  it('should include all 16 state capitals', () => {
    const stateCapitals = [
      'Stuttgart', 'München', 'Berlin', 'Potsdam', 'Bremen', 'Hamburg',
      'Wiesbaden', 'Schwerin', 'Hannover', 'Düsseldorf', 'Mainz',
      'Saarbrücken', 'Dresden', 'Magdeburg', 'Kiel', 'Erfurt'
    ]

    stateCapitals.forEach(capital => {
      const city = cities.find(c => c.name === capital)
      expect(city).toBeDefined()
    })
  })
})
