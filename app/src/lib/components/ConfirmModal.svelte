<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let show: boolean = false
  export let title: string = 'Bestätigung'
  export let message: string = ''
  export let confirmText: string = 'Ja'
  export let cancelText: string = 'Abbrechen'

  const dispatch = createEventDispatcher<{
    confirm: void
    cancel: void
  }>()

  let confirmButton: HTMLButtonElement

  $: if (show && confirmButton) {
    setTimeout(() => confirmButton?.focus(), 100)
  }

  function handleConfirm() {
    dispatch('confirm')
  }

  function handleCancel() {
    dispatch('cancel')
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleCancel()
    }
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleCancel}
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
      <h2>{title}</h2>
      <p class="message">{message}</p>

      <div class="button-group">
        <button onclick={handleCancel} class="cancel-button">
          {cancelText}
        </button>
        <button bind:this={confirmButton} onclick={handleConfirm} class="confirm-button">
          {confirmText}
        </button>
      </div>
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
    margin-bottom: 1rem;
  }

  .message {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .confirm-button,
  .cancel-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .confirm-button {
    background-color: #1976d2;
    color: white;
  }

  .confirm-button:hover {
    background-color: #1565c0;
  }

  .cancel-button {
    background-color: #e0e0e0;
    color: #333;
  }

  .cancel-button:hover {
    background-color: #d0d0d0;
  }

  @media (max-width: 600px) {
    .modal-content {
      min-width: 90%;
    }

    .button-group {
      flex-direction: column;
    }
  }
</style>
