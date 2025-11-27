import type { Country } from '$lib/types'

export const neighboringCountries: Country[] = [
  {
    id: 'dk',
    name: 'Dänemark',
    capital: 'Kopenhagen',
    svgPathId: 'DK'
  },
  {
    id: 'nl',
    name: 'Niederlande',
    capital: 'Amsterdam',
    svgPathId: 'NL'
  },
  {
    id: 'be',
    name: 'Belgien',
    capital: 'Brüssel',
    svgPathId: 'BE'
  },
  {
    id: 'lu',
    name: 'Luxemburg',
    capital: 'Luxemburg',
    svgPathId: 'LU'
  },
  {
    id: 'fr',
    name: 'Frankreich',
    capital: 'Paris',
    svgPathId: 'FR'
  },
  {
    id: 'ch',
    name: 'Schweiz',
    capital: 'Bern',
    svgPathId: 'CH'
  },
  {
    id: 'at',
    name: 'Österreich',
    capital: 'Wien',
    svgPathId: 'AT'
  },
  {
    id: 'cz',
    name: 'Tschechien',
    capital: 'Prag',
    svgPathId: 'CZ'
  },
  {
    id: 'pl',
    name: 'Polen',
    capital: 'Warschau',
    svgPathId: 'PL'
  }
]

// Helper function to get country by ID
export function getCountryById(id: string): Country | undefined {
  return neighboringCountries.find(country => country.id === id)
}

// Helper function to get country by name
export function getCountryByName(name: string): Country | undefined {
  return neighboringCountries.find(country =>
    country.name.toLowerCase() === name.toLowerCase()
  )
}
