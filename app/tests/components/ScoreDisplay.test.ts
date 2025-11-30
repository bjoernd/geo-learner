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
      mode: 'laender',
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
      mode: 'laender',
      score: 16,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should calculate max score correctly for orte mode', () => {
    const mockSession: GameSession = {
      mode: 'orte',
      score: 10,
      totalQuestions: 15,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('/ 15')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('should calculate max score correctly for laender mode', () => {
    const mockSession: GameSession = {
      mode: 'laender',
      score: 10,
      totalQuestions: 10,
      answers: [],
      startTime: Date.now()
    }

    render(ScoreDisplay, { props: { session: mockSession } })
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('/ 20')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
