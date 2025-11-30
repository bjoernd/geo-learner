import { writable, get, derived } from 'svelte/store'
import type { GameState, GameMode, Question, Answer, Location, GameSession, River, City } from '$lib/types'
import { federalStates } from '$lib/data/federalStates'
import { neighboringCountries } from '$lib/data/neighboringCountries'
import { cities } from '$lib/data/cities'
import { rivers } from '$lib/data/rivers'
import { compareText } from '$lib/utils/textMatching'

const initialState: GameState = {
  currentMode: null,
  currentSession: null,
  currentQuestion: null,
  questionQueue: [],
  awaitingCapitalInput: false,
  lastAnswerCorrect: null,
  correctLocation: null,
  answeredRegions: {
    correct: [],
    incorrect: []
  }
}

function createGameStateStore() {
  const { subscribe, set, update } = writable<GameState>(initialState)

  return {
    subscribe,
    set,
    update,

    startNewSession: (mode: GameMode) => {
      const questions = generateQuestions(mode)
      const firstQuestion = questions[0]

      const session: GameSession = {
        mode,
        score: 0,
        totalQuestions: questions.length,
        answers: [],
        startTime: Date.now()
      }

      update(state => ({
        ...state,
        currentMode: mode,
        currentSession: session,
        currentQuestion: firstQuestion,
        questionQueue: questions.slice(1),
        awaitingCapitalInput: false,
        lastAnswerCorrect: null,
        correctLocation: null,
        answeredRegions: {
          correct: [],
          incorrect: []
        }
      }))
    },

    submitLocationAnswer: (clickedRegionId: string | null, clickPosition?: { x: number; y: number }) => {
      update(state => {
        if (!state.currentQuestion || !state.currentSession) return state

        const location = state.currentQuestion.location
        const isCity = 'coordinates' in location
        let correct = false

        if (state.currentQuestion.mode === 'orte') {
          if (isCity && clickPosition !== undefined) {
            // City: check if click is near the city coordinates
            const city = location as City
            correct = isClickNearCity(clickPosition, city)
          } else if (!isCity && clickedRegionId !== null) {
            // River: check if clicked region matches
            correct = clickedRegionId === location.svgPathId
          }
        } else if (clickedRegionId !== null) {
          // For laender mode (states/countries)
          correct = clickedRegionId === location.svgPathId
        }

        const answer: Partial<Answer> = {
          question: state.currentQuestion,
          locationCorrect: correct,
          userLocationClick: clickPosition,
          timestamp: Date.now()
        }

        // Track answered region
        const regionId = location.svgPathId
        const updatedAnsweredRegions = {
          correct: correct
            ? [...state.answeredRegions.correct, regionId]
            : state.answeredRegions.correct,
          incorrect: !correct
            ? [...state.answeredRegions.incorrect, regionId]
            : state.answeredRegions.incorrect
        }

        // If correct and mode requires capital, wait for capital input
        const needsCapital = correct &&
                            state.currentMode === 'laender' &&
                            state.currentQuestion.location.capital

        if (needsCapital) {
          return {
            ...state,
            awaitingCapitalInput: true,
            lastAnswerCorrect: correct,
            correctLocation: state.currentQuestion.location,
            answeredRegions: updatedAnsweredRegions,
            currentSession: {
              ...state.currentSession,
              score: state.currentSession.score + 1, // Point for location
              answers: [...state.currentSession.answers, answer as Answer]
            }
          }
        } else {
          // No capital needed, move to next question
          return moveToNextQuestion({
            ...state,
            lastAnswerCorrect: correct,
            correctLocation: state.currentQuestion.location,
            answeredRegions: updatedAnsweredRegions,
            currentSession: {
              ...state.currentSession,
              score: correct ? state.currentSession.score + 1 : state.currentSession.score,
              answers: [...state.currentSession.answers, answer as Answer]
            }
          })
        }
      })
    },

    submitCapitalAnswer: (userAnswer: string) => {
      update(state => {
        if (!state.currentQuestion || !state.currentSession) return state

        const correctCapital = state.currentQuestion.location.capital!
        const correct = compareText(userAnswer, correctCapital)

        // Update the last answer with capital result
        const answers = [...state.currentSession.answers]
        const lastAnswer = answers[answers.length - 1]
        lastAnswer.capitalCorrect = correct
        lastAnswer.userCapitalAnswer = userAnswer

        return moveToNextQuestion({
          ...state,
          awaitingCapitalInput: false,
          lastAnswerCorrect: correct,
          currentSession: {
            ...state.currentSession,
            score: correct ? state.currentSession.score + 1 : state.currentSession.score,
            answers
          }
        })
      })
    },

    endSession: () => {
      update(state => {
        if (!state.currentSession) return state

        const endedSession: GameSession = {
          ...state.currentSession,
          endTime: Date.now()
        }

        return {
          ...initialState,
          currentSession: endedSession
        }
      })
    },

    clearSession: () => {
      set(initialState)
    }
  }
}

function moveToNextQuestion(state: GameState): GameState {
  if (state.questionQueue.length === 0) {
    // Session complete
    return {
      ...state,
      currentQuestion: null,
      currentSession: state.currentSession ? {
        ...state.currentSession,
        endTime: Date.now()
      } : null
    }
  }

  const nextQuestion = state.questionQueue[0]
  return {
    ...state,
    currentQuestion: nextQuestion,
    questionQueue: state.questionQueue.slice(1)
    // Keep lastAnswerCorrect and correctLocation from previous answer
  }
}

function generateQuestions(mode: GameMode): Question[] {
  let locations: (Location | River)[] = []
  let sampleSize: number

  switch (mode) {
    case 'laender':
      locations = [...federalStates, ...neighboringCountries]
      sampleSize = 10
      break
    case 'orte':
      // Mix cities and rivers
      const allOrte = [...cities, ...rivers as any[]]
      locations = allOrte
      sampleSize = 15
      break
  }

  // Shuffle and sample locations
  locations = shuffle(locations).slice(0, sampleSize)

  // Create questions
  const questions: Question[] = locations.map(location => ({
    location: location as Location,
    type: 'location',
    mode
  }))

  return questions
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function isClickNearCity(
  clickPosition: { x: number; y: number },
  city: { coordinates: { x: number; y: number } }
): boolean {
  const threshold = 30 // pixels
  const dx = clickPosition.x - city.coordinates.x
  const dy = clickPosition.y - city.coordinates.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= threshold
}

export const gameState = createGameStateStore()

// Derived stores for convenient access
export const currentMode = derived(gameState, $state => $state.currentMode)
export const currentQuestion = derived(gameState, $state => $state.currentQuestion)
export const currentScore = derived(gameState, $state => $state.currentSession?.score ?? 0)
export const isSessionActive = derived(gameState, $state =>
  $state.currentSession !== null && $state.currentQuestion !== null
)
export const answeredRegions = derived(gameState, $state => $state.answeredRegions)
