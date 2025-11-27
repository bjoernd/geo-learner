import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Map from '$lib/components/Map.svelte'

describe('Map Component', () => {
  beforeEach(() => {
    // Mock fetch to prevent SVG loading errors in tests
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('SVG not available in test environment'))
    )
    // Suppress console.error for expected fetch failures
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should render loading state initially', () => {
    render(Map)
    expect(screen.getByText(/Karte wird geladen/i)).toBeInTheDocument()
  })

  it('should accept mode prop', () => {
    const { component } = render(Map, { props: { mode: 'federalState' } })
    expect(component).toBeTruthy()
  })

  it('should accept highlightedRegion prop', () => {
    const { component } = render(Map, {
      props: {
        mode: 'federalState',
        highlightedRegion: 'DE-BY'
      }
    })
    expect(component).toBeTruthy()
  })
})
