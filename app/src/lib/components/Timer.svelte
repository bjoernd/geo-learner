<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createEventDispatcher } from 'svelte'

  export let duration: number = 30 // seconds
  export let enabled: boolean = false
  export let paused: boolean = false
  export let autoStart: boolean = true

  const dispatch = createEventDispatcher<{
    timeout: void
    tick: { remaining: number }
  }>()

  let remaining = duration
  let intervalId: number | null = null
  let startTime: number | null = null
  let pausedTime: number = 0

  $: percentage = (remaining / duration) * 100
  $: isLow = remaining <= 10
  $: isCritical = remaining <= 5

  $: if (enabled && autoStart && !intervalId) {
    start()
  }

  $: if (!enabled && intervalId) {
    stop()
  }

  $: if (paused && intervalId) {
    pause()
  } else if (!paused && enabled && !intervalId) {
    resume()
  }

  function start() {
    remaining = duration
    startTime = Date.now()
    pausedTime = 0
    startInterval()
  }

  function startInterval() {
    if (intervalId) return

    intervalId = window.setInterval(() => {
      if (!startTime) return

      const elapsed = Math.floor((Date.now() - startTime - pausedTime) / 1000)
      remaining = Math.max(0, duration - elapsed)

      dispatch('tick', { remaining })

      if (remaining === 0) {
        stop()
        dispatch('timeout')
      }
    }, 100)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    startTime = null
    pausedTime = 0
  }

  function pause() {
    if (intervalId && startTime) {
      clearInterval(intervalId)
      intervalId = null
      pausedTime = Date.now() - startTime
    }
  }

  function resume() {
    if (!intervalId && startTime) {
      startTime = Date.now() - pausedTime
      startInterval()
    }
  }

  export function reset() {
    stop()
    if (enabled && autoStart) {
      start()
    }
  }

  onDestroy(() => {
    stop()
  })
</script>

{#if enabled}
  <div class="timer" class:low={isLow} class:critical={isCritical}>
    <div class="timer-display">
      <svg class="timer-circle" viewBox="0 0 100 100">
        <circle
          class="timer-bg"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          class="timer-progress"
          cx="50"
          cy="50"
          r="45"
          style="stroke-dashoffset: {283 - (283 * percentage) / 100}"
        />
      </svg>
      <div class="timer-text">
        <span class="timer-seconds">{remaining}</span>
        <span class="timer-label">s</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .timer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-display {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .timer-circle {
    transform: rotate(-90deg);
  }

  .timer-bg {
    fill: none;
    stroke: #e0e0e0;
    stroke-width: 8;
  }

  .timer-progress {
    fill: none;
    stroke: #1976d2;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 0.1s linear, stroke 0.3s ease;
  }

  .timer.low .timer-progress {
    stroke: #ff9800;
  }

  .timer.critical .timer-progress {
    stroke: #f44336;
    animation: pulse 0.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      stroke-width: 8;
    }
    50% {
      stroke-width: 10;
    }
  }

  .timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .timer-seconds {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  .timer.low .timer-seconds {
    color: #ff9800;
  }

  .timer.critical .timer-seconds {
    color: #f44336;
  }

  .timer-label {
    font-size: 1rem;
    color: #666;
  }
</style>
