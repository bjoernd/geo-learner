import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import ScoreDisplay from '$lib/components/ScoreDisplay.svelte'
import type { GameSession } from '$lib/types'

describe('ScoreDisplay Component', () => {
  it('should render score of 0 initially', () => {
    render(ScoreDisplay, { props: { session: null } })
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should render session score', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 15,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('/ 32')).toBeInTheDocument()
  })

  it('should display percentage', () => {
    const mockSession: GameSession = {
      mode: 'federalState',
      score: 16,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
