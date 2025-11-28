<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let show: boolean = false
  export let locationName: string = ''
  export let correctCapital: string = ''
  export let isAnswerCorrect: boolean | null = null
  export let userAnswer: string = ''

  const dispatch = createEventDispatcher<{
    submit: { answer: string }
    close: void
  }>()

  let inputValue = ''
  let inputElement: HTMLInputElement
  let previousShow = false

  $: if (show && !previousShow && inputElement) {
    inputElement.focus()
    inputValue = ''
  }

  $: previousShow = show

  function handleSubmit() {
    if (inputValue.trim()) {
      dispatch('submit', { answer: inputValue.trim() })
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit()
    } else if (event.key === 'Escape') {
      dispatch('close')
    }
  }

  function handleClose() {
    dispatch('close')
  }

  function handleOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose()
    }
  }

  function handleContentKeydown(event: KeyboardEvent) {
    // Stop propagation to prevent overlay from handling
    event.stopPropagation()
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleClose}
    onkeydown={handleOverlayKeydown}
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
      <h2>Hauptstadt von {locationName}?</h2>

      <div class="input-group">
        <input
          bind:this={inputElement}
          bind:value={inputValue}
          onkeydown={handleKeydown}
          type="text"
          placeholder="Hauptstadt eingeben..."
          disabled={isAnswerCorrect !== null}
        />
        {#if isAnswerCorrect === null}
          <button onclick={handleSubmit} class="submit-button">
            Bestätigen
          </button>
        {/if}
      </div>

      {#if isAnswerCorrect !== null}
        <div class="feedback" class:correct={isAnswerCorrect} class:incorrect={!isAnswerCorrect}>
          {#if isAnswerCorrect}
            <div class="feedback-icon">✓</div>
            <div class="feedback-text">Richtig!</div>
          {:else}
            <div class="feedback-icon">✗</div>
            <div class="feedback-text">
              Falsch! Die richtige Antwort ist: <strong>{correctCapital}</strong>
            </div>
            <div class="user-answer">Deine Antwort: {userAnswer}</div>
          {/if}
        </div>
        <button onclick={handleClose} class="continue-button">
          Weiter
        </button>
      {/if}
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
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: #1976d2;
  }

  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .submit-button,
  .continue-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-button {
    background-color: #1976d2;
    color: white;
  }

  .submit-button:hover {
    background-color: #1565c0;
  }

  .continue-button {
    width: 100%;
    background-color: #4caf50;
    color: white;
    margin-top: 1rem;
  }

  .continue-button:hover {
    background-color: #45a049;
  }

  .feedback {
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .feedback.correct {
    background-color: #e8f5e9;
    border: 2px solid #4caf50;
  }

  .feedback.incorrect {
    background-color: #ffebee;
    border: 2px solid #f44336;
  }

  .feedback-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .feedback.correct .feedback-icon {
    color: #4caf50;
  }

  .feedback.incorrect .feedback-icon {
    color: #f44336;
  }

  .feedback-text {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .user-answer {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
  }
</style>
