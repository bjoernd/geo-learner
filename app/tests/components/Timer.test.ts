import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/svelte'
import Timer from '$lib/components/Timer.svelte'

describe('Timer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not render when disabled', () => {
    const { container } = render(Timer, {
      props: { enabled: false, duration: 30 }
    })
    expect(container.querySelector('.timer')).not.toBeInTheDocument()
  })

  it('should render when enabled', () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 30 }
    })
    expect(container.querySelector('.timer')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('should countdown when enabled', async () => {
    render(Timer, {
      props: { enabled: true, duration: 30, autoStart: true }
    })

    expect(screen.getByText('30')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)
    await waitFor(() => expect(screen.getByText('25')).toBeInTheDocument())

    vi.advanceTimersByTime(5000)
    await waitFor(() => expect(screen.getByText('20')).toBeInTheDocument())
  })

  it('should countdown close to zero', async () => {
    render(Timer, {
      props: { enabled: true, duration: 3, autoStart: true }
    })

    expect(screen.getByText('3')).toBeInTheDocument()

    vi.advanceTimersByTime(2000)
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
  })

  it('should apply low class when under 10 seconds', async () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 15, autoStart: true }
    })

    vi.advanceTimersByTime(6000)
    await waitFor(() => expect(container.querySelector('.timer')).toHaveClass('low'))
  })

  it('should apply critical class when under 5 seconds', async () => {
    const { container } = render(Timer, {
      props: { enabled: true, duration: 10, autoStart: true }
    })

    vi.advanceTimersByTime(6000)
    await waitFor(() => expect(container.querySelector('.timer')).toHaveClass('critical'))
  })

  it('should not start when autoStart is false', () => {
    render(Timer, {
      props: { enabled: true, duration: 30, autoStart: false }
    })

    expect(screen.getByText('30')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)
    expect(screen.getByText('30')).toBeInTheDocument()
  })
})
