import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ModeSelector from '$lib/components/ModeSelector.svelte'

describe('ModeSelector Component', () => {
  it('should render all three modes', () => {
    render(ModeSelector)
    expect(screen.getByText('Bundesländer')).toBeInTheDocument()
    expect(screen.getByText('Nachbarländer')).toBeInTheDocument()
    expect(screen.getByText('Städte')).toBeInTheDocument()
  })

  it('should have clickable mode buttons', async () => {
    const { container } = render(ModeSelector)

    const button = screen.getByText('Bundesländer')
    expect(button).not.toBeDisabled()

    // Verify button is clickable (doesn't throw)
    await fireEvent.click(button)

    // Verify all mode buttons exist and are clickable
    const allButtons = container.querySelectorAll('.mode-button')
    expect(allButtons).toHaveLength(3)
    for (const btn of allButtons) {
      expect(btn).not.toHaveAttribute('disabled')
    }
  })

  it('should show active mode', () => {
    const { container } = render(ModeSelector, {
      props: { currentMode: 'neighbor' }
    })

    const buttons = container.querySelectorAll('.mode-button')
    expect(buttons[1]).toHaveClass('active')
  })

  it('should disable buttons when disabled prop is true', async () => {
    const { container } = render(ModeSelector, {
      props: { disabled: true }
    })

    const buttons = container.querySelectorAll('.mode-button')
    for (const button of buttons) {
      expect(button).toHaveAttribute('disabled')
      expect(button).toHaveClass('disabled')
    }
  })
})
