import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ModeSelector from '$lib/components/ModeSelector.svelte'

describe('ModeSelector Component', () => {
  it('should render both modes', () => {
    render(ModeSelector)
    expect(screen.getByText('Länder')).toBeInTheDocument()
    expect(screen.getByText('Städte')).toBeInTheDocument()
  })

  it('should have clickable mode buttons', async () => {
    const { container } = render(ModeSelector)

    const button = screen.getByText('Länder')
    expect(button).not.toBeDisabled()

    // Verify button is clickable (doesn't throw)
    await fireEvent.click(button)

    // Verify all mode buttons exist and are clickable
    const allButtons = container.querySelectorAll('.mode-button')
    expect(allButtons).toHaveLength(2)
    for (const btn of allButtons) {
      expect(btn).not.toHaveAttribute('disabled')
    }
  })

  it('should show active mode', () => {
    const { container } = render(ModeSelector, {
      props: { currentMode: 'laender' }
    })

    const buttons = container.querySelectorAll('.mode-button')
    expect(buttons[0]).toHaveClass('active')
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
