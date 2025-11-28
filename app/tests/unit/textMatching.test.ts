import { describe, it, expect } from 'vitest'
import { normalizeText, compareText, isClickNearPoint, calculateDistance } from '$lib/utils/textMatching'

describe('Text Matching Utilities', () => {
  describe('normalizeText', () => {
    it('should convert to lowercase', () => {
      expect(normalizeText('MÜNCHEN')).toBe('munchen')
    })

    it('should trim whitespace', () => {
      expect(normalizeText('  Berlin  ')).toBe('berlin')
    })

    it('should replace umlauts', () => {
      expect(normalizeText('München')).toBe('munchen')
      expect(normalizeText('Köln')).toBe('koln')
      expect(normalizeText('Düsseldorf')).toBe('dusseldorf')
      expect(normalizeText('Saarbrücken')).toBe('saarbrucken')
    })

    it('should replace ß with ss', () => {
      expect(normalizeText('Straße')).toBe('strasse')
    })

    it('should remove special characters', () => {
      expect(normalizeText('Frankfurt-am-Main')).toBe('frankfurt am main')
      expect(normalizeText('Test!@#$%')).toBe('test')
    })

    it('should normalize multiple spaces', () => {
      expect(normalizeText('Test   Multiple   Spaces')).toBe('test multiple spaces')
    })
  })

  describe('compareText', () => {
    it('should match identical strings', () => {
      expect(compareText('Berlin', 'Berlin')).toBe(true)
    })

    it('should match case-insensitive', () => {
      expect(compareText('Berlin', 'berlin')).toBe(true)
      expect(compareText('BERLIN', 'berlin')).toBe(true)
    })

    it('should match with umlaut variations', () => {
      expect(compareText('München', 'Muenchen')).toBe(true)
      expect(compareText('Munchen', 'München')).toBe(true)
      expect(compareText('Köln', 'Koeln')).toBe(true)
      expect(compareText('Düsseldorf', 'Duesseldorf')).toBe(true)
    })

    it('should match with whitespace differences', () => {
      expect(compareText('  Berlin  ', 'Berlin')).toBe(true)
    })

    it('should not match different strings', () => {
      expect(compareText('Berlin', 'Hamburg')).toBe(false)
      expect(compareText('München', 'Berlin')).toBe(false)
    })

    it('should handle special characters', () => {
      expect(compareText('Frankfurt-am-Main', 'Frankfurt am Main')).toBe(true)
    })
  })

  describe('isClickNearPoint', () => {
    it('should return true for exact match', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 200 })).toBe(true)
    })

    it('should return true for click within threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 110, y: 200 }, 30)).toBe(true)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 220 }, 30)).toBe(true)
    })

    it('should return false for click outside threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 150, y: 200 }, 30)).toBe(false)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 100, y: 250 }, 30)).toBe(false)
    })

    it('should use custom threshold', () => {
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 150, y: 200 }, 50)).toBe(false)
      expect(isClickNearPoint({ x: 100, y: 200 }, { x: 140, y: 200 }, 50)).toBe(true)
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance correctly', () => {
      expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
      expect(calculateDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0)
      expect(calculateDistance({ x: 100, y: 100 }, { x: 100, y: 200 })).toBe(100)
    })
  })
})
