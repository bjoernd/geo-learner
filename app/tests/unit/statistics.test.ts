import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { statistics } from '$lib/stores/statistics'
import type { GameSession, Answer } from '$lib/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Statistics Store', () => {
  beforeEach(() => {
    localStorage.clear()
    statistics.reset()
  })

  it('should have default statistics', () => {
    const stats = get(statistics)
    expect(stats.totalSessions).toBe(0)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(0)
  })

  it('should record a game session', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 10,
      answers: [
        {
          question: {
            location: { id: 'by', name: 'Bayern', svgPathId: 'DE-BY', capital: 'München' },
            type: 'location',
            mode: 'federalState'
          },
          locationCorrect: true,
          capitalCorrect: true,
          timestamp: Date.now()
        }
      ],
      startTime: Date.now() - 60000,
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stats = get(statistics)
    expect(stats.totalSessions).toBe(1)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(1)
    expect(stats.byMode.federalState.correctAnswers).toBe(2) // location + capital
  })

  it('should calculate success rate', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 5,
      totalQuestions: 10,
      answers: Array(10).fill(null).map((_, i) => ({
        question: {
          location: { id: 'by', name: 'Bayern', svgPathId: 'DE-BY', capital: 'München' },
          type: 'location',
          mode: 'federalState'
        },
        locationCorrect: i < 5, // 5 correct out of 10
        timestamp: Date.now()
      })),
      startTime: Date.now() - 60000,
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stats = get(statistics)
    expect(stats.byMode.federalState.successRate).toBe(50)
  })

  it('should track best score', () => {
    const session1: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    const session2: GameSession = {
      mode: 'federalState',
      score: 15,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(session1)
    statistics.recordSession(session2)

    const stats = get(statistics)
    expect(stats.byMode.federalState.bestScore).toBe(15)
  })

  it('should persist statistics to localStorage', () => {
    const mockSession: GameSession = {
      mode: 'city',
      score: 5,
      totalQuestions: 10,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    const stored = localStorage.getItem('geo-learner-statistics')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.totalSessions).toBe(1)
  })

  it('should reset statistics', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 10,
      totalQuestions: 10,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)
    statistics.reset()

    const stats = get(statistics)
    expect(stats.totalSessions).toBe(0)
    expect(stats.byMode.federalState.sessionsPlayed).toBe(0)
  })
})
