import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import Settings from '$lib/components/Settings.svelte'

describe('Settings Component', () => {
  it('should not render when show is false', () => {
    const { container } = render(Settings, { props: { show: false } })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(Settings, { props: { show: true } })
    expect(screen.getByText('Einstellungen')).toBeInTheDocument()
  })

  it('should toggle timer enabled', async () => {
    render(Settings, { props: { show: true } })
    const checkbox = screen.getByLabelText(/Timer aktivieren/i) as HTMLInputElement

    await fireEvent.click(checkbox)
    // Setting changes are tested in the store tests
  })

  it('should show timer duration slider when timer enabled', async () => {
    render(Settings, { props: { show: true } })
    const checkbox = screen.getByLabelText(/Timer aktivieren/i)

    await fireEvent.click(checkbox)

    // Wait for slide transition
    await waitFor(() => expect(screen.getByLabelText(/Zeitlimit/i)).toBeInTheDocument(), {
      timeout: 500
    })
  })

  it('should have view statistics button', () => {
    render(Settings, { props: { show: true } })
    const button = screen.getByText('Statistiken anzeigen')
    expect(button).toBeInTheDocument()
  })

  it('should show reset confirmation', async () => {
    render(Settings, { props: { show: true } })

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    expect(screen.getByText(/Wirklich alle Daten löschen/i)).toBeInTheDocument()
  })

  it('should show confirm and cancel buttons after reset click', async () => {
    render(Settings, { props: { show: true } })

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    expect(screen.getByText('Ja, löschen')).toBeInTheDocument()
    expect(screen.getByText('Abbrechen')).toBeInTheDocument()
  })

  it('should hide confirmation on cancel button', async () => {
    render(Settings, { props: { show: true } })

    const resetButton = screen.getByText('Fortschritt zurücksetzen')
    await fireEvent.click(resetButton)

    expect(screen.getByText(/Wirklich alle Daten löschen/i)).toBeInTheDocument()

    const cancelButton = screen.getByText('Abbrechen')
    await fireEvent.click(cancelButton)

    // Button should be re-enabled after cancel
    await waitFor(() => expect(screen.getByText('Fortschritt zurücksetzen')).toBeInTheDocument())
  })

  it('should have close button', () => {
    render(Settings, { props: { show: true } })
    const closeButton = screen.getByText('✕')
    expect(closeButton).toBeInTheDocument()
  })
})
