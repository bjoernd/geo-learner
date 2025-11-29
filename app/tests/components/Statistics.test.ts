import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Statistics from '$lib/components/Statistics.svelte'
import { statistics } from '$lib/stores/statistics'
import type { GameSession } from '$lib/types'

describe('Statistics Component', () => {
  beforeEach(() => {
    statistics.reset()
  })

  it('should not render when show is false', () => {
    const { container } = render(Statistics, { props: { show: false } })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(Statistics, { props: { show: true } })
    expect(screen.getByText('Statistiken')).toBeInTheDocument()
  })

  it('should show empty state when no sessions played', () => {
    render(Statistics, { props: { show: true } })
    expect(screen.getByText(/Noch keine Statistiken verfügbar/i)).toBeInTheDocument()
  })

  it('should display total sessions', () => {
    const mockSession: GameSession = {
      mode: 'laender',
      score: 10,
      totalQuestions: 16,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    render(Statistics, { props: { show: true } })
    expect(screen.getByText('Gespielte Sitzungen')).toBeInTheDocument()
    // Check that total sessions is displayed by finding the stat-card
    const { container } = render(Statistics, { props: { show: true } })
    const statCard = container.querySelector('.stat-card')
    expect(statCard).toBeInTheDocument()
  })

  it('should display mode statistics', () => {
    const mockSession: GameSession = {
      mode: 'city',
      score: 15,
      totalQuestions: 20,
      answers: [],
      startTime: Date.now(),
      endTime: Date.now()
    }

    statistics.recordSession(mockSession)

    render(Statistics, { props: { show: true } })
    expect(screen.getByText('Städte')).toBeInTheDocument()
  })

  it('should show "Noch keine Daten" for modes not played', () => {
    render(Statistics, { props: { show: true } })
    const noDatas = screen.getAllByText('Noch keine Daten')
    expect(noDatas).toHaveLength(2) // Both modes
  })
})
