import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import ErrorBoundaryTestWrapper from './ErrorBoundaryTestWrapper.svelte'

describe('ErrorBoundary', () => {
  let consoleErrorSpy: any
  let windowReloadSpy: any

  beforeEach(() => {
    // Suppress console.error during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock window.location.reload
    windowReloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: windowReloadSpy }
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should render child content when no error occurs', () => {
    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('should show error UI when window error event is triggered', async () => {
    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    // Trigger a window error event
    const errorEvent = new ErrorEvent('error', {
      message: 'Test error message',
      error: new Error('Test error')
    })
    window.dispatchEvent(errorEvent)

    // Wait for the error boundary to update
    await vi.waitFor(() => {
      expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
    })

    // Error UI should be visible
    expect(screen.getByText('😕 Etwas ist schiefgelaufen')).toBeInTheDocument()
    expect(screen.getByText('Die Anwendung ist auf einen Fehler gestoßen.')).toBeInTheDocument()
    expect(screen.getByText('Fehlerdetails')).toBeInTheDocument()
  })

  it('should display error message in details', async () => {
    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    const errorMessage = 'Specific test error message'
    const errorEvent = new ErrorEvent('error', {
      message: errorMessage,
      error: new Error(errorMessage)
    })
    window.dispatchEvent(errorEvent)

    await vi.waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should reload page when reload button is clicked', async () => {
    const user = userEvent.setup()

    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    // Trigger error
    const errorEvent = new ErrorEvent('error', {
      message: 'Test error',
      error: new Error('Test error')
    })
    window.dispatchEvent(errorEvent)

    await vi.waitFor(() => {
      expect(screen.getByText('😕 Etwas ist schiefgelaufen')).toBeInTheDocument()
    })

    // Click reload button
    const reloadButton = screen.getByRole('button', { name: /neu laden/i })
    await user.click(reloadButton)

    expect(windowReloadSpy).toHaveBeenCalledTimes(1)
  })

  it('should log error to console', async () => {
    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    const error = new Error('Test error')
    const errorEvent = new ErrorEvent('error', {
      message: 'Test error message',
      error: error
    })
    window.dispatchEvent(errorEvent)

    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught:', error)
    })
  })

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should have details element that can be expanded', async () => {
    render(ErrorBoundaryTestWrapper, {
      props: { showError: false }
    })

    // Trigger error
    const errorEvent = new ErrorEvent('error', {
      message: 'Detailed error message',
      error: new Error('Detailed error message')
    })
    window.dispatchEvent(errorEvent)

    await vi.waitFor(() => {
      expect(screen.getByText('Fehlerdetails')).toBeInTheDocument()
    })

    const details = screen.getByText('Fehlerdetails').closest('details')
    expect(details).toBeInTheDocument()
  })
})
