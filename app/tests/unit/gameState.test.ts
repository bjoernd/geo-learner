import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { gameState, currentMode, currentQuestion, currentScore, isSessionActive, answeredRegions } from '$lib/stores/gameState'
import type { Location, River, City } from '$lib/types'

// Helper to determine if a location is a city
function isCity(location: Location): location is City {
  return 'coordinates' in location
}

// Helper to submit a correct answer for any location type
function submitCorrectAnswer(location: Location) {
  if (isCity(location)) {
    // For cities, provide coordinates
    const city = location as City
    gameState.submitLocationAnswer(null, city.coordinates)
  } else {
    // For rivers and states/countries, click the region
    gameState.submitLocationAnswer(location.svgPathId)
  }
}

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

  it('should start a new laender session', () => {
    gameState.startNewSession('laender')

    const state = get(gameState)
    expect(state.currentMode).toBe('laender')
    expect(state.currentSession).toBeTruthy()
    expect(state.currentQuestion).toBeTruthy()
    expect(state.currentSession!.totalQuestions).toBe(10)
  })

  it('should start a new city session', () => {
    gameState.startNewSession('orte')

    const state = get(gameState)
    expect(state.currentMode).toBe('orte')
    expect(state.currentSession!.totalQuestions).toBe(15)
  })

  it('should handle correct location answer', () => {
    gameState.startNewSession('laender')
    const initialQuestion = get(gameState).currentQuestion!

    gameState.submitLocationAnswer(initialQuestion.location.svgPathId)

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(true) // Should wait for capital
    expect(state.currentSession!.score).toBe(1)
  })

  it('should handle incorrect location answer', () => {
    gameState.startNewSession('laender')

    gameState.submitLocationAnswer('WRONG-ID')

    const state = get(gameState)
    expect(state.awaitingCapitalInput).toBe(false)
    expect(state.currentSession!.score).toBe(0)
    expect(state.lastAnswerCorrect).toBe(false)
  })

  it('should handle correct capital answer', () => {
    gameState.startNewSession('laender')
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
    gameState.startNewSession('laender')

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
    gameState.startNewSession('orte') // City mode doesn't require capital input

    const initialQuestion = get(gameState).currentQuestion!
    gameState.submitLocationAnswer('WRONG')

    const nextQuestion = get(gameState).currentQuestion
    expect(nextQuestion).toBeTruthy()
    expect(nextQuestion!.location.id).not.toBe(initialQuestion.location.id)
  })

  it('should end session when questions exhausted', () => {
    gameState.startNewSession('orte')

    let state = get(gameState)
    const totalQuestions = state.currentSession!.totalQuestions

    // Answer all questions
    for (let i = 0; i < totalQuestions; i++) {
      state = get(gameState)
      if (!state.currentQuestion) break
      submitCorrectAnswer(state.currentQuestion.location)
    }

    state = get(gameState)
    expect(state.currentQuestion).toBeNull()
    expect(state.currentSession!.endTime).toBeTruthy()
  })

  it('should clear session', () => {
    gameState.startNewSession('laender')
    gameState.clearSession()

    const state = get(gameState)
    expect(state.currentMode).toBeNull()
    expect(state.currentSession).toBeNull()
  })

  // Test derived stores
  it('should provide derived current mode', () => {
    gameState.startNewSession('laender')
    expect(get(currentMode)).toBe('laender')
  })

  it('should provide derived current score', () => {
    gameState.startNewSession('orte')
    expect(get(currentScore)).toBe(0)

    const question = get(gameState).currentQuestion!
    submitCorrectAnswer(question.location)
    expect(get(currentScore)).toBe(1)
  })

  it('should provide derived session active status', () => {
    expect(get(isSessionActive)).toBe(false)

    gameState.startNewSession('laender')
    expect(get(isSessionActive)).toBe(true)

    gameState.clearSession()
    expect(get(isSessionActive)).toBe(false)
  })

  // Test permanent highlighting of answered regions
  it('should track correctly answered regions', () => {
    gameState.startNewSession('laender')
    const question = get(gameState).currentQuestion!
    const regionId = question.location.svgPathId

    gameState.submitLocationAnswer(regionId)

    const regions = get(answeredRegions)
    expect(regions.correct).toContain(regionId)
    expect(regions.incorrect).not.toContain(regionId)
  })

  it('should track incorrectly answered regions', () => {
    gameState.startNewSession('laender')
    const question = get(gameState).currentQuestion!
    const wrongRegionId = 'WRONG-ID'

    gameState.submitLocationAnswer(wrongRegionId)

    const regions = get(answeredRegions)
    expect(regions.incorrect).toContain(question.location.svgPathId)
    expect(regions.correct).not.toContain(question.location.svgPathId)
  })

  it('should accumulate answered regions across multiple questions', () => {
    gameState.startNewSession('orte')

    const question1 = get(gameState).currentQuestion!
    submitCorrectAnswer(question1.location)

    const question2 = get(gameState).currentQuestion!
    gameState.submitLocationAnswer('WRONG')

    const regions = get(answeredRegions)
    // For rivers, multiple paths are added; for cities, one svgPathId is added
    expect(regions.correct.length).toBeGreaterThan(0)
    expect(regions.incorrect.length).toBeGreaterThan(0)
  })

  it('should reset answered regions when starting new session', () => {
    gameState.startNewSession('orte')
    const question = get(gameState).currentQuestion!
    submitCorrectAnswer(question.location)

    expect(get(answeredRegions).correct.length).toBeGreaterThan(0)

    gameState.startNewSession('orte')
    const regions = get(answeredRegions)
    expect(regions.correct).toHaveLength(0)
    expect(regions.incorrect).toHaveLength(0)
  })
})
