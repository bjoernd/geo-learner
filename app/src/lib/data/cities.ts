import type { City } from '$lib/types'

// Starting with 20 cities: all 16 state capitals + 4 major cities
// Coordinates are placeholders - will be updated when we have the actual SVG map
export const cities: City[] = [
  // State capitals
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    stateId: 'bw',
    svgPathId: 'city-stuttgart',
    coordinates: { x: 500, y: 650 }
  },
  {
    id: 'muenchen',
    name: 'München',
    stateId: 'by',
    svgPathId: 'city-muenchen',
    coordinates: { x: 650, y: 700 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    stateId: 'be',
    svgPathId: 'city-berlin',
    coordinates: { x: 700, y: 300 }
  },
  {
    id: 'potsdam',
    name: 'Potsdam',
    stateId: 'bb',
    svgPathId: 'city-potsdam',
    coordinates: { x: 680, y: 310 }
  },
  {
    id: 'bremen',
    name: 'Bremen',
    stateId: 'hb',
    svgPathId: 'city-bremen',
    coordinates: { x: 450, y: 250 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    stateId: 'hh',
    svgPathId: 'city-hamburg',
    coordinates: { x: 500, y: 200 }
  },
  {
    id: 'wiesbaden',
    name: 'Wiesbaden',
    stateId: 'he',
    svgPathId: 'city-wiesbaden',
    coordinates: { x: 420, y: 500 }
  },
  {
    id: 'schwerin',
    name: 'Schwerin',
    stateId: 'mv',
    svgPathId: 'city-schwerin',
    coordinates: { x: 600, y: 200 }
  },
  {
    id: 'hannover',
    name: 'Hannover',
    stateId: 'ni',
    svgPathId: 'city-hannover',
    coordinates: { x: 500, y: 320 }
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf',
    stateId: 'nw',
    svgPathId: 'city-duesseldorf',
    coordinates: { x: 350, y: 420 }
  },
  {
    id: 'mainz',
    name: 'Mainz',
    stateId: 'rp',
    svgPathId: 'city-mainz',
    coordinates: { x: 420, y: 520 }
  },
  {
    id: 'saarbruecken',
    name: 'Saarbrücken',
    stateId: 'sl',
    svgPathId: 'city-saarbruecken',
    coordinates: { x: 350, y: 600 }
  },
  {
    id: 'dresden',
    name: 'Dresden',
    stateId: 'sn',
    svgPathId: 'city-dresden',
    coordinates: { x: 700, y: 450 }
  },
  {
    id: 'magdeburg',
    name: 'Magdeburg',
    stateId: 'st',
    svgPathId: 'city-magdeburg',
    coordinates: { x: 600, y: 330 }
  },
  {
    id: 'kiel',
    name: 'Kiel',
    stateId: 'sh',
    svgPathId: 'city-kiel',
    coordinates: { x: 500, y: 120 }
  },
  {
    id: 'erfurt',
    name: 'Erfurt',
    stateId: 'th',
    svgPathId: 'city-erfurt',
    coordinates: { x: 550, y: 450 }
  },
  // Major cities (non-capitals)
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    stateId: 'he',
    svgPathId: 'city-frankfurt',
    coordinates: { x: 450, y: 500 }
  },
  {
    id: 'koeln',
    name: 'Köln',
    stateId: 'nw',
    svgPathId: 'city-koeln',
    coordinates: { x: 350, y: 450 }
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    stateId: 'sn',
    svgPathId: 'city-leipzig',
    coordinates: { x: 650, y: 400 }
  },
  {
    id: 'nuernberg',
    name: 'Nürnberg',
    stateId: 'by',
    svgPathId: 'city-nuernberg',
    coordinates: { x: 550, y: 600 }
  }
]

// Helper function to get city by ID
export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id)
}

// Helper function to get city by name
export function getCityByName(name: string): City | undefined {
  return cities.find(city =>
    city.name.toLowerCase() === name.toLowerCase()
  )
}

// Helper function to get all cities in a state
export function getCitiesByStateId(stateId: string): City[] {
  return cities.filter(city => city.stateId === stateId)
}
