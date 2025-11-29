import { writable } from 'svelte/store'
import type { Statistics, GameSession, GameMode, ModeStatistics } from '$lib/types'

const STORAGE_KEY = 'geo-learner-statistics'

const defaultModeStats: ModeStatistics = {
  sessionsPlayed: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  successRate: 0,
  bestScore: 0
}

const defaultStatistics: Statistics = {
  totalSessions: 0,
  byMode: {
    laender: { ...defaultModeStats },
    city: { ...defaultModeStats }
  },
  weakAreas: []
}

function createStatisticsStore() {
  const loadStatistics = (): Statistics => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
    return defaultStatistics
  }

  const { subscribe, set, update } = writable<Statistics>(loadStatistics())

  // Save to localStorage whenever statistics change
  subscribe((stats) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error('Failed to save statistics:', error)
    }
  })

  return {
    subscribe,
    set,
    update,

    recordSession: (session: GameSession) => {
      update(stats => {
        const mode = session.mode
        const modeStats = stats.byMode[mode]

        // Count correct answers (location + capital if applicable)
        let correctAnswers = 0
        session.answers.forEach(answer => {
          if (answer.locationCorrect) correctAnswers++
          if (answer.capitalCorrect === true) correctAnswers++
        })

        // Update mode statistics
        const newModeStats: ModeStatistics = {
          sessionsPlayed: modeStats.sessionsPlayed + 1,
          totalQuestions: modeStats.totalQuestions + session.totalQuestions,
          correctAnswers: modeStats.correctAnswers + correctAnswers,
          successRate: 0, // Will be calculated below
          bestScore: Math.max(modeStats.bestScore, session.score)
        }

        newModeStats.successRate =
          newModeStats.totalQuestions > 0
            ? (newModeStats.correctAnswers / newModeStats.totalQuestions) * 100
            : 0

        // Update weak areas
        const weakAreas = calculateWeakAreas(stats, session)

        return {
          totalSessions: stats.totalSessions + 1,
          byMode: {
            ...stats.byMode,
            [mode]: newModeStats
          },
          weakAreas
        }
      })
    },

    reset: () => {
      set(defaultStatistics)
    }
  }
}

function calculateWeakAreas(
  currentStats: Statistics,
  newSession: GameSession
): Statistics['weakAreas'] {
  // Track success rate per location across all sessions
  const locationStats = new Map<string, { correct: number; total: number; name: string }>()

  // Process new session
  newSession.answers.forEach(answer => {
    const locationId = answer.question.location.id
    const locationName = answer.question.location.name

    if (!locationStats.has(locationId)) {
      locationStats.set(locationId, { correct: 0, total: 0, name: locationName })
    }

    const stats = locationStats.get(locationId)!

    // Count location clicks
    if (answer.question.type === 'location') {
      stats.total++
      if (answer.locationCorrect) stats.correct++
    }

    // Count capital answers
    if (answer.question.type === 'capital' || answer.capitalCorrect !== undefined) {
      stats.total++
      if (answer.capitalCorrect) stats.correct++
    }
  })

  // Convert to array and sort by success rate
  const weakAreas = Array.from(locationStats.entries())
    .map(([locationId, stats]) => ({
      locationId,
      locationName: stats.name,
      successRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    }))
    .filter(area => area.successRate < 100) // Only include areas with some failures
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 10) // Keep top 10 weakest areas

  return weakAreas
}

export const statistics = createStatisticsStore()
