import type { FederalState } from '$lib/types'
import { findLocationById, findLocationByName } from './dataHelpers'

export const federalStates: FederalState[] = [
  {
    id: 'bw',
    name: 'Baden-Württemberg',
    capital: 'Stuttgart',
    svgPathId: 'DE-BW'
  },
  {
    id: 'by',
    name: 'Bayern',
    capital: 'München',
    svgPathId: 'DE-BY'
  },
  {
    id: 'be',
    name: 'Berlin',
    capital: 'Berlin',
    svgPathId: 'DE-BE'
  },
  {
    id: 'bb',
    name: 'Brandenburg',
    capital: 'Potsdam',
    svgPathId: 'DE-BB'
  },
  {
    id: 'hb',
    name: 'Bremen',
    capital: 'Bremen',
    svgPathId: 'DE-HB'
  },
  {
    id: 'hh',
    name: 'Hamburg',
    capital: 'Hamburg',
    svgPathId: 'DE-HH'
  },
  {
    id: 'he',
    name: 'Hessen',
    capital: 'Wiesbaden',
    svgPathId: 'DE-HE'
  },
  {
    id: 'mv',
    name: 'Mecklenburg-Vorpommern',
    capital: 'Schwerin',
    svgPathId: 'DE-MV'
  },
  {
    id: 'ni',
    name: 'Niedersachsen',
    capital: 'Hannover',
    svgPathId: 'DE-NI'
  },
  {
    id: 'nw',
    name: 'Nordrhein-Westfalen',
    capital: 'Düsseldorf',
    svgPathId: 'DE-NW'
  },
  {
    id: 'rp',
    name: 'Rheinland-Pfalz',
    capital: 'Mainz',
    svgPathId: 'DE-RP'
  },
  {
    id: 'sl',
    name: 'Saarland',
    capital: 'Saarbrücken',
    svgPathId: 'DE-SL'
  },
  {
    id: 'sn',
    name: 'Sachsen',
    capital: 'Dresden',
    svgPathId: 'DE-SN'
  },
  {
    id: 'st',
    name: 'Sachsen-Anhalt',
    capital: 'Magdeburg',
    svgPathId: 'DE-ST'
  },
  {
    id: 'sh',
    name: 'Schleswig-Holstein',
    capital: 'Kiel',
    svgPathId: 'DE-SH'
  },
  {
    id: 'th',
    name: 'Thüringen',
    capital: 'Erfurt',
    svgPathId: 'DE-TH'
  }
]

export const getFederalStateById = (id: string) =>
  findLocationById(federalStates, id)

export const getFederalStateByName = (name: string) =>
  findLocationByName(federalStates, name)
