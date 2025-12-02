<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'
  import type { GameSession } from '$lib/types'

  export let show: boolean = false
  export let session: GameSession | null = null

  const dispatch = createEventDispatcher<{
    close: void
  }>()

  $: maxScore = session?.mode === 'laender' ? (session.totalQuestions * 2) : session?.totalQuestions ?? 0
  $: percentage = maxScore > 0 && session ? Math.round((session.score / maxScore) * 100) : 0
  $: correctAnswers = session?.answers.filter(a => a.locationCorrect && (a.capitalCorrect === undefined || a.capitalCorrect === true)).length ?? 0
  $: incorrectAnswers = session ? session.answers.length - correctAnswers : 0

  function handleClose() {
    dispatch('close')
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      handleClose()
    }
  }
</script>

{#if show && session}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleClose}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="modal-content"
      transition:scale={{ duration: 200, start: 0.9 }}
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <h2>Sitzung beendet!</h2>

      <div class="summary-content">
        <div class="score-section">
          <div class="score-display">
            <div class="score-value">{session.score}</div>
            <div class="score-divider">/</div>
            <div class="score-max">{maxScore}</div>
          </div>
          <div class="percentage">{percentage}%</div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Fragen</div>
            <div class="stat-value">{session.totalQuestions}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Richtig</div>
            <div class="stat-value correct">{correctAnswers}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Falsch</div>
            <div class="stat-value incorrect">{incorrectAnswers}</div>
          </div>
        </div>
      </div>

      <button onclick={handleClose} class="close-button">
        Schließen
      </button>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    min-width: 400px;
    max-width: 90%;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .score-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 12px;
  }

  .score-display {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .score-value {
    font-size: 4rem;
    font-weight: 700;
    color: #1976d2;
    line-height: 1;
  }

  .score-divider {
    font-size: 2rem;
    color: #999;
  }

  .score-max {
    font-size: 2rem;
    color: #666;
  }

  .percentage {
    font-size: 1.5rem;
    color: #666;
    padding: 0.5rem 1rem;
    background-color: #e3f2fd;
    border-radius: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    font-weight: 600;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  .stat-value.correct {
    color: #4caf50;
  }

  .stat-value.incorrect {
    color: #f44336;
  }

  .close-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #1976d2;
    color: white;
  }

  .close-button:hover {
    background-color: #1565c0;
  }

  @media (max-width: 600px) {
    .modal-content {
      min-width: 90%;
      padding: 1.5rem;
    }

    .score-value {
      font-size: 3rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
