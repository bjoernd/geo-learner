import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { gameState, currentMode, currentQuestion, currentScore, isSessionActive } from '$lib/stores/gameState'

describe('Game State Store', () => {
  beforeEach(() => {
    gameState.clearSession()
  })

  it('should start with null state', () => {
    const state = get(gameState)
    expect(state.currentMode).toBeNull()
    expect(state.currentSession).toBeNull()
    expect(state.currentQuestion).toBeNull()
  })

  it('should start a new federal state session', () => {
    gameState.startNewSession('federalState')

    const state = get(gameState)
    expect(state.currentMode).toBe('federalState')
    expect(state.currentSession).toBeTruthy()
    expect(state.currentQuestion).toBeTruthy()
    expect(state.currentSession!.totalQuestions).toBe(16)
  })

  it('should start a new neighbor session', () => {
    gameState.startNewSession('neighbor')

    const state = get(gameState)
    expect(state.currentMode).toBe('neighbor')
    expect(state.currentSession!.totalQuestions).toBe(25) // 16 states + 9 countries
  })

  it('should start a new city session', () => {
    gameState.startNewSession('city')

    const state = get(gameState)
    expect(state.currentMode).toBe('city')
    expect(state.currentSession!.totalQuestions).toBe(20) // 20 cities
  })

  it('should handle correct location answer', () => {
    gameState.startNewSession('federalState')
    const initialQuestion = get(gameState).currentQuestion!

    gameState.submitLocationAnswer(initialQuestion.location.svgPathId)

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(true) // Should wait for capital
    expect(state.currentSession!.score).toBe(1)
  })

  it('should handle incorrect location answer', () => {
    gameState.startNewSession('federalState')

    gameState.submitLocationAnswer('WRONG-ID')

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(false)
    expect(state.currentSession!.score).toBe(0)
    expect(state.lastAnswerCorrect).toBe(false)
  })

  it('should handle correct capital answer', () => {
    gameState.startNewSession('federalState')
    const initialQuestion = get(gameState).currentQuestion!

    // Answer location correctly
    gameState.submitLocationAnswer(initialQuestion.location.svgPathId)

    // Answer capital correctly
    gameState.submitCapitalAnswer(initialQuestion.location.capital!)

    const state = get(gameState)
    expect(state.currentSession!.score).toBe(2) // 1 for location + 1 for capital
    expect(state.awaitingCapitalInput).toBe(false)
  })

  it('should handle capital with umlaut variations', () => {
    gameState.startNewSession('federalState')

    // Find Bayern question
    let state = get(gameState)
    while (state.currentQuestion?.location.name !== 'Bayern') {
      gameState.submitLocationAnswer('WRONG')
      state = get(gameState)
      if (!state.currentQuestion) break
    }

    if (state.currentQuestion?.location.name === 'Bayern') {
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId)

      // Test umlaut variations
      gameState.submitCapitalAnswer('Munchen') // Should match München

      const finalState = get(gameState)
      const lastAnswer = finalState.currentSession!.answers[finalState.currentSession!.answers.length - 1]
      expect(lastAnswer.capitalCorrect).toBe(true)
    }
  })

  it('should progress through questions', () => {
    gameState.startNewSession('city') // City mode doesn't require capital input

    const initialQuestion = get(gameState).currentQuestion!
    gameState.submitLocationAnswer('WRONG')

    const nextQuestion = get(gameState).currentQuestion
    expect(nextQuestion).toBeTruthy()
    expect(nextQuestion!.location.id).not.toBe(initialQuestion.location.id)
  })

  it('should end session when questions exhausted', () => {
    gameState.startNewSession('city')

    let state = get(gameState)
    const totalQuestions = state.currentSession!.totalQuestions

    // Answer all questions
    for (let i = 0; i < totalQuestions; i++) {
      state = get(gameState)
      if (!state.currentQuestion) break
      gameState.submitLocationAnswer(state.currentQuestion.location.svgPathId,
                                      (state.currentQuestion.location as any).coordinates)
    }

    state = get(gameState)
    expect(state.currentQuestion).toBeNull()
    expect(state.currentSession!.endTime).toBeTruthy()
  })

  it('should clear session', () => {
    gameState.startNewSession('federalState')
    gameState.clearSession()

    const state = get(gameState)
    expect(state.currentMode).toBeNull()
    expect(state.currentSession).toBeNull()
  })

  // Test derived stores
  it('should provide derived current mode', () => {
    gameState.startNewSession('neighbor')
    expect(get(currentMode)).toBe('neighbor')
  })

  it('should provide derived current score', () => {
    gameState.startNewSession('city')
    expect(get(currentScore)).toBe(0)

    const question = get(gameState).currentQuestion!
    gameState.submitLocationAnswer(question.location.svgPathId, (question.location as any).coordinates)
    expect(get(currentScore)).toBe(1)
  })

  it('should provide derived session active status', () => {
    expect(get(isSessionActive)).toBe(false)

    gameState.startNewSession('federalState')
    expect(get(isSessionActive)).toBe(true)

    gameState.clearSession()
    expect(get(isSessionActive)).toBe(false)
  })
})
