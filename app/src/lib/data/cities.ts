import type { City } from '$lib/types'
import { findLocationById, findLocationByName, filterLocationsByProperty } from './dataHelpers'

// 26 cities: all 16 state capitals + 10 biggest non-capital cities
export const cities: City[] = [
  // State capitals
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    stateId: 'bw',
    svgPathId: 'city-stuttgart',
    coordinates: { x: 405, y: 1023.01 }
  },
  {
    id: 'muenchen',
    name: 'München',
    stateId: 'by',
    svgPathId: 'city-muenchen',
    coordinates: { x: 713, y: 1144.01 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    stateId: 'be',
    svgPathId: 'city-berlin',
    coordinates: { x: 844, y: 416.01 }
  },
  {
    id: 'potsdam',
    name: 'Potsdam',
    stateId: 'bb',
    svgPathId: 'city-potsdam',
    coordinates: { x: 815, y: 437.01 }
  },
  {
    id: 'bremen',
    name: 'Bremen',
    stateId: 'hb',
    svgPathId: 'city-bremen',
    coordinates: { x: 350, y: 320 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    stateId: 'hh',
    svgPathId: 'city-hamburg',
    coordinates: { x: 486, y: 249 }
  },
  {
    id: 'wiesbaden',
    name: 'Wiesbaden',
    stateId: 'he',
    svgPathId: 'city-wiesbaden',
    coordinates: { x: 294, y: 811.01 }
  },
  {
    id: 'schwerin',
    name: 'Schwerin',
    stateId: 'mv',
    svgPathId: 'city-schwerin',
    coordinates: { x: 635, y: 237 }
  },
  {
    id: 'hannover',
    name: 'Hannover',
    stateId: 'ni',
    svgPathId: 'city-hannover',
    coordinates: { x: 437, y: 426.01 }
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf',
    stateId: 'nw',
    svgPathId: 'city-duesseldorf',
    coordinates: { x: 125, y: 618.01 }
  },
  {
    id: 'mainz',
    name: 'Mainz',
    stateId: 'rp',
    svgPathId: 'city-mainz',
    coordinates: { x: 288, y: 821.01 }
  },
  {
    id: 'saarbruecken',
    name: 'Saarbrücken',
    stateId: 'sl',
    svgPathId: 'city-saarbruecken',
    coordinates: { x: 147, y: 945.01 }
  },
  {
    id: 'dresden',
    name: 'Dresden',
    stateId: 'sn',
    svgPathId: 'city-dresden',
    coordinates: { x: 898.01, y: 653.01 }
  },
  {
    id: 'magdeburg',
    name: 'Magdeburg',
    stateId: 'st',
    svgPathId: 'city-magdeburg',
    coordinates: { x: 659, y: 478.01 }
  },
  {
    id: 'kiel',
    name: 'Kiel',
    stateId: 'sh',
    svgPathId: 'city-kiel',
    coordinates: { x: 496, y: 125 }
  },
  {
    id: 'erfurt',
    name: 'Erfurt',
    stateId: 'th',
    svgPathId: 'city-erfurt',
    coordinates: { x: 587, y: 657.01 }
  },
  // Major cities (non-capitals)
  {
    id: 'koeln',
    name: 'Köln',
    stateId: 'nw',
    svgPathId: 'city-koeln',
    coordinates: { x: 137, y: 625.01 }
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    stateId: 'he',
    svgPathId: 'city-frankfurt',
    coordinates: { x: 337, y: 803.01 }
  },
  {
    id: 'dortmund',
    name: 'Dortmund',
    stateId: 'nw',
    svgPathId: 'city-dortmund',
    coordinates: { x: 204, y: 574.01 }
  },
  {
    id: 'essen',
    name: 'Essen',
    stateId: 'nw',
    svgPathId: 'city-essen',
    coordinates: { x: 156, y: 577.01 }
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    stateId: 'sn',
    svgPathId: 'city-leipzig',
    coordinates: { x: 742, y: 597.01 }
  },
  {
    id: 'nuernberg',
    name: 'Nürnberg',
    stateId: 'by',
    svgPathId: 'city-nuernberg',
    coordinates: { x: 599, y: 891.01 }
  },
  {
    id: 'duisburg',
    name: 'Duisburg',
    stateId: 'nw',
    svgPathId: 'city-duisburg',
    coordinates: { x: 131, y: 567.01 }
  },
  {
    id: 'bochum',
    name: 'Bochum',
    stateId: 'nw',
    svgPathId: 'city-bochum',
    coordinates: { x: 184, y: 575.01 }
  },
  {
    id: 'wuppertal',
    name: 'Wuppertal',
    stateId: 'nw',
    svgPathId: 'city-wuppertal',
    coordinates: { x: 151, y: 614.01 }
  },
  {
    id: 'bielefeld',
    name: 'Bielefeld',
    stateId: 'nw',
    svgPathId: 'city-bielefeld',
    coordinates: { x: 316, y: 486.01 }
  }
]

export const getCityById = (id: string) =>
  findLocationById(cities, id)

export const getCityByName = (name: string) =>
  findLocationByName(cities, name)

export const getCitiesByStateId = (stateId: string) =>
  filterLocationsByProperty(cities, 'stateId', stateId)
