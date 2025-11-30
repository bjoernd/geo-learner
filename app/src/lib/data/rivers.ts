import type { River } from '$lib/types'
import { findLocationById, findLocationByName } from './dataHelpers'

export const rivers: readonly River[] = [
  { id: 'fulda', name: 'Fulda', svgPathId: 'river-0' },
  { id: 'ems', name: 'Ems', svgPathId: 'river-1' },
  { id: 'saale', name: 'Saale', svgPathId: 'river-2' },
  { id: 'aller', name: 'Aller', svgPathId: 'river-4' },
  { id: 'lippe', name: 'Lippe', svgPathId: 'river-6' },
  { id: 'moldau', name: 'Moldau', svgPathId: 'river-7' },
  { id: 'warthe', name: 'Warthe', svgPathId: 'river-9' },
  { id: 'rhein', name: 'Rhein', svgPathId: 'river-10' },
  { id: 'elbe', name: 'Elbe', svgPathId: 'river-11' },
  { id: 'havel', name: 'Havel', svgPathId: 'river-13' },
  { id: 'spree', name: 'Spree', svgPathId: 'river-17' },
  { id: 'oder', name: 'Oder', svgPathId: 'river-22' },
  { id: 'main', name: 'Main', svgPathId: 'river-32' },
  { id: 'werra', name: 'Werra', svgPathId: 'river-33' },
  { id: 'weser', name: 'Weser', svgPathId: 'river-34' },
  { id: 'ruhr', name: 'Ruhr', svgPathId: 'river-35' },
  { id: 'donau', name: 'Donau', svgPathId: 'river-38' },
  { id: 'inn', name: 'Inn', svgPathId: 'river-39' },
  { id: 'mosel', name: 'Mosel', svgPathId: 'river-42' },
  { id: 'maas', name: 'Maas', svgPathId: 'river-44' },
  { id: 'ijssel', name: 'IJssel', svgPathId: 'river-45' },
  { id: 'neckar', name: 'Neckar', svgPathId: 'river-47' },
  { id: 'chiemsee', name: 'Chiemsee', svgPathId: 'river-49' },
  { id: 'schwerinersee', name: 'Schweriner See', svgPathId: 'river-50' }
]

// Helper functions
export const getRiverById = (id: string) =>
  findLocationById(rivers, id)

export const getRiverByName = (name: string) =>
  findLocationByName(rivers, name)
