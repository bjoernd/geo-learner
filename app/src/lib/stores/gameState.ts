import { writable, get, derived } from 'svelte/store'
import type { GameState, GameMode, Question, Answer, Location, GameSession } from '$lib/types'
import { federalStates } from '$lib/data/federalStates'
import { neighboringCountries } from '$lib/data/neighboringCountries'
import { cities } from '$lib/data/cities'

const initialState: GameState = {
  currentMode: null,
  currentSession: null,
  currentQuestion: null,
  questionQueue: [],
  awaitingCapitalInput: false,
  lastAnswerCorrect: null,
  correctLocation: null
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
        correctLocation: null
      }))
    },

    submitLocationAnswer: (clickedRegionId: string | null, clickPosition?: { x: number; y: number }) => {
      update(state => {
        if (!state.currentQuestion || !state.currentSession) return state

        const correct = clickedRegionId === state.currentQuestion.location.svgPathId ||
                       (state.currentQuestion.mode === 'city' && clickPosition !== undefined &&
                        isClickNearCity(clickPosition, state.currentQuestion.location as any))

        const answer: Partial<Answer> = {
          question: state.currentQuestion,
          locationCorrect: correct,
          userLocationClick: clickPosition,
          timestamp: Date.now()
        }

        // If correct and mode requires capital, wait for capital input
        const needsCapital = correct &&
                            (state.currentMode === 'federalState' || state.currentMode === 'neighbor') &&
                            state.currentQuestion.location.capital

        if (needsCapital) {
          return {
            ...state,
            awaitingCapitalInput: true,
            lastAnswerCorrect: correct,
            correctLocation: state.currentQuestion.location,
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
        const correct = compareCapitalAnswer(userAnswer, correctCapital)

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
  let locations: Location[] = []

  switch (mode) {
    case 'federalState':
      locations = [...federalStates]
      break
    case 'neighbor':
      locations = [...federalStates, ...neighboringCountries]
      break
    case 'city':
      locations = [...cities]
      break
  }

  // Shuffle locations
  locations = shuffle(locations)

  // Create questions
  const questions: Question[] = locations.map(location => ({
    location,
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

function compareCapitalAnswer(userAnswer: string, correctAnswer: string): boolean {
  // Normalize both strings - convert umlauts to standard forms
  const normalize = (str: string) =>
    str.toLowerCase()
      .trim()
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ä/g, 'a')
      .replace(/ß/g, 'ss')

  return normalize(userAnswer) === normalize(correctAnswer)
}

export const gameState = createGameStateStore()

// Derived stores for convenient access
export const currentMode = derived(gameState, $state => $state.currentMode)
export const currentQuestion = derived(gameState, $state => $state.currentQuestion)
export const currentScore = derived(gameState, $state => $state.currentSession?.score ?? 0)
export const isSessionActive = derived(gameState, $state =>
  $state.currentSession !== null && $state.currentQuestion !== null
)
