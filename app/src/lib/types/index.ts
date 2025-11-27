export type GameMode = 'federalState' | 'neighbor' | 'city'

export interface Location {
  id: string
  name: string
  capital?: string
  svgPathId: string
}

export interface FederalState extends Location {
  capital: string
}

export interface Country extends Location {
  capital: string
}

export interface City extends Location {
  stateId: string
  coordinates: { x: number; y: number }
}

export interface Question {
  location: Location
  type: 'location' | 'capital'
  mode: GameMode
}

export interface Answer {
  question: Question
  locationCorrect: boolean
  capitalCorrect?: boolean
  userLocationClick?: { x: number; y: number }
  userCapitalAnswer?: string
  timestamp: number
}

export interface GameSession {
  mode: GameMode
  score: number
  totalQuestions: number
  answers: Answer[]
  startTime: number
  endTime?: number
}

export interface ModeStatistics {
  sessionsPlayed: number
  totalQuestions: number
  correctAnswers: number
  successRate: number
  bestScore: number
}

export interface Statistics {
  totalSessions: number
  byMode: {
    federalState: ModeStatistics
    neighbor: ModeStatistics
    city: ModeStatistics
  }
  weakAreas: Array<{ locationId: string; locationName: string; successRate: number }>
}

export interface Settings {
  timerEnabled: boolean
  timerDuration: number // seconds
}

export interface GameState {
  currentMode: GameMode | null
  currentSession: GameSession | null
  currentQuestion: Question | null
  questionQueue: Question[]
  awaitingCapitalInput: boolean
  lastAnswerCorrect: boolean | null
  correctLocation: Location | null
}
