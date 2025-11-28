import '@testing-library/jest-dom'

// Mock Web Animations API for Svelte transitions
Element.prototype.animate = Element.prototype.animate || function() {
  return {
    cancel: () => {},
    finish: () => {},
    onfinish: null,
    play: () => {},
    pause: () => {},
    reverse: () => {},
    playbackRate: 1,
    startTime: 0,
    currentTime: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  } as Animation
}
