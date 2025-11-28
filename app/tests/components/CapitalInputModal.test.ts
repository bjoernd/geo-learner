import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import CapitalInputModal from '$lib/components/CapitalInputModal.svelte'

describe('CapitalInputModal Component', () => {
  it('should not render when show is false', () => {
    const { container } = render(CapitalInputModal, {
      props: { show: false, locationName: 'Bayern', correctCapital: 'München' }
    })
    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('should render when show is true', () => {
    render(CapitalInputModal, {
      props: { show: true, locationName: 'Bayern', correctCapital: 'München' }
    })
    expect(screen.getByText(/Hauptstadt von Bayern/i)).toBeInTheDocument()
  })

  it('should have input field and submit button', async () => {
    render(CapitalInputModal, {
      props: { show: true, locationName: 'Bayern', correctCapital: 'München' }
    })

    const input = screen.getByPlaceholderText(/Hauptstadt eingeben/i)
    expect(input).toBeInTheDocument()
    expect(input).not.toBeDisabled()

    const button = screen.getByText('Bestätigen')
    expect(button).toBeInTheDocument()

    // Can type in input
    await fireEvent.input(input, { target: { value: 'München' } })
    expect(input).toHaveValue('München')

    // Button is clickable
    await fireEvent.click(button)
  })

  it('should show correct feedback', () => {
    render(CapitalInputModal, {
      props: {
        show: true,
        locationName: 'Bayern',
        correctCapital: 'München',
        isAnswerCorrect: true
      }
    })
    expect(screen.getByText('Richtig!')).toBeInTheDocument()
  })

  it('should show incorrect feedback with correct answer', () => {
    render(CapitalInputModal, {
      props: {
        show: true,
        locationName: 'Bayern',
        correctCapital: 'München',
        isAnswerCorrect: false,
        userAnswer: 'Berlin'
      }
    })
    expect(screen.getByText(/Falsch/i)).toBeInTheDocument()
    expect(screen.getByText(/München/i)).toBeInTheDocument()
  })
})
