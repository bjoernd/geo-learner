import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { gameState } from '$lib/stores/gameState'
import { statistics } from '$lib/stores/statistics'

describe('Game Flow Integration', () => {
  beforeEach(() => {
    gameState.clearSession()
    statistics.reset()
  })

  it('should complete a full laender session', () => {
    // Start session
    gameState.startNewSession('laender')

    let state = get(gameState)
    expect(state.currentMode).toBe('laender')
    expect(state.currentQuestion).toBeTruthy()

    const totalQuestions = state.currentSession!.totalQuestions

    // Answer all questions
    for (let i = 0; i < totalQuestions; i++) {
      state = get(gameState)
      if (!state.currentQuestion) break

      // Answer location correctly
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId)

      state = get(gameState)
      if (state.awaitingCapitalInput) {
        // Answer capital correctly
        gameState.submitCapitalAnswer(state.currentQuestion!.location.capital!)
      }
    }

    // Session should be complete
    state = get(gameState)
    expect(state.currentQuestion).toBeNull()
    expect(state.currentSession!.endTime).toBeTruthy()

    // Record statistics
    statistics.recordSession(state.currentSession!)

    // Check statistics updated
    const stats = get(statistics)
    expect(stats.totalSessions).toBe(1)
    expect(stats.byMode.laender.sessionsPlayed).toBe(1)
  })

  it('should handle incorrect answers', () => {
    gameState.startNewSession('orte')

    let state = get(gameState)
    const initialScore = state.currentSession!.score

    // Submit incorrect answer
    gameState.submitLocationAnswer('WRONG-ID')

    state = get(gameState)
    expect(state.currentSession!.score).toBe(initialScore) // Score should not increase
    expect(state.lastAnswerCorrect).toBe(false)
  })

  it('should handle mode switching', () => {
    gameState.startNewSession('laender')
    gameState.clearSession()
    gameState.startNewSession('orte')

    const state = get(gameState)
    expect(state.currentMode).toBe('orte')
    expect(state.currentSession!.totalQuestions).toBe(15)
  })
})
