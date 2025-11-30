import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(LoadingSpinner)

    expect(screen.getByText('Laden...')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(LoadingSpinner, {
      props: { message: 'Custom loading message' }
    })

    expect(screen.getByText('Custom loading message')).toBeInTheDocument()
  })

  it('should have spinner element', () => {
    const { container } = render(LoadingSpinner)

    const spinner = container.querySelector('.spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('should have spinner container', () => {
    const { container } = render(LoadingSpinner)

    const spinnerContainer = container.querySelector('.spinner-container')
    expect(spinnerContainer).toBeInTheDocument()
  })

  it('should display message in paragraph element', () => {
    render(LoadingSpinner, {
      props: { message: 'Test message' }
    })

    const paragraph = screen.getByText('Test message')
    expect(paragraph.tagName).toBe('P')
  })
})
