import type { River } from '$lib/types'

export const rivers: readonly River[] = [
  {
    id: 'aller',
    name: 'Aller',
    svgPathIndices: [4]
  },
  {
    id: 'chiemsee',
    name: 'Chiemsee',
    svgPathIndices: [49]
  },
  {
    id: 'donau',
    name: 'Donau',
    svgPathIndices: [38, 46]
  },
  {
    id: 'elbe',
    name: 'Elbe',
    svgPathIndices: [11, 12]
  },
  {
    id: 'ems',
    name: 'Ems',
    svgPathIndices: [1]
  },
  {
    id: 'fulda',
    name: 'Fulda',
    svgPathIndices: [0]
  },
  {
    id: 'havel',
    name: 'Havel',
    svgPathIndices: [13, 14, 15, 16, 18, 19, 20, 21, 51, 53]
  },
  {
    id: 'ijssel',
    name: 'IJssel',
    svgPathIndices: [45]
  },
  {
    id: 'inn',
    name: 'Inn',
    svgPathIndices: [39]
  },
  {
    id: 'lippe',
    name: 'Lippe',
    svgPathIndices: [6]
  },
  {
    id: 'maas',
    name: 'Maas',
    svgPathIndices: [44]
  },
  {
    id: 'main',
    name: 'Main',
    svgPathIndices: [32]
  },
  {
    id: 'moldau',
    name: 'Moldau',
    svgPathIndices: [7, 8]
  },
  {
    id: 'mosel',
    name: 'Mosel',
    svgPathIndices: [42]
  },
  {
    id: 'neckar',
    name: 'Neckar',
    svgPathIndices: [47]
  },
  {
    id: 'oder',
    name: 'Oder',
    svgPathIndices: [22, 23, 52]
  },
  {
    id: 'rhein',
    name: 'Rhein',
    svgPathIndices: [10, 40, 41]
  },
  {
    id: 'ruhr',
    name: 'Ruhr',
    svgPathIndices: [35]
  },
  {
    id: 'saale',
    name: 'Saale',
    svgPathIndices: [2, 3, 5]
  },
  {
    id: 'schwerinersee',
    name: 'Schweriner See',
    svgPathIndices: [50]
  },
  {
    id: 'spree',
    name: 'Spree',
    svgPathIndices: [17, 25, 26, 27, 28]
  },
  {
    id: 'warthe',
    name: 'Warthe',
    svgPathIndices: [9]
  },
  {
    id: 'werra',
    name: 'Werra',
    svgPathIndices: [33]
  },
  {
    id: 'weser',
    name: 'Weser',
    svgPathIndices: [34]
  }
]

// Helper functions
export function getRiverById(id: string): River | undefined {
  return rivers.find(r => r.id === id)
}

export function getRiverByName(name: string): River | undefined {
  return rivers.find(r => r.name.toLowerCase() === name.toLowerCase())
}

export function getRiverBySvgPathIndex(index: number): River | undefined {
  return rivers.find(r => r.svgPathIndices.includes(index))
}
