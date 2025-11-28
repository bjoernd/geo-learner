<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { settings } from '$lib/stores/settings'
  import { fade, slide } from 'svelte/transition'

  export let show: boolean = false

  const dispatch = createEventDispatcher<{
    close: void
    resetProgress: void
    viewStatistics: void
  }>()

  let showResetConfirm = false

  function handleClose() {
    dispatch('close')
  }

  function handleResetProgress() {
    showResetConfirm = true
  }

  function confirmReset() {
    dispatch('resetProgress')
    showResetConfirm = false
  }

  function cancelReset() {
    showResetConfirm = false
  }

  function handleViewStatistics() {
    dispatch('viewStatistics')
  }
</script>

{#if show}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="modal-content"
      transition:slide={{ duration: 200 }}
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="modal-header">
        <h2>Einstellungen</h2>
        <button class="close-button" onclick={handleClose}>✕</button>
      </div>

      <div class="settings-section">
        <h3>Timer</h3>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              bind:checked={$settings.timerEnabled}
              onchange={() => settings.setTimerEnabled($settings.timerEnabled)}
            />
            Timer aktivieren
          </label>
        </div>

        {#if $settings.timerEnabled}
          <div class="setting-item" transition:slide={{ duration: 200 }}>
            <label for="timer-duration">
              Zeitlimit: {$settings.timerDuration} Sekunden
            </label>
            <input
              id="timer-duration"
              type="range"
              min="10"
              max="120"
              step="5"
              bind:value={$settings.timerDuration}
              onchange={() => settings.setTimerDuration($settings.timerDuration)}
            />
            <div class="range-labels">
              <span>10s</span>
              <span>120s</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="settings-section">
        <h3>Statistiken</h3>
        <button class="action-button" onclick={handleViewStatistics}>
          Statistiken anzeigen
        </button>
      </div>

      <div class="settings-section danger-zone">
        <h3>Zurücksetzen</h3>
        <p class="warning-text">
          Dies löscht alle gespeicherten Fortschritte und Statistiken.
        </p>

        {#if !showResetConfirm}
          <button class="danger-button" onclick={handleResetProgress}>
            Fortschritt zurücksetzen
          </button>
        {:else}
          <div class="confirm-box" transition:slide={{ duration: 200 }}>
            <p class="confirm-text">Wirklich alle Daten löschen?</p>
            <div class="confirm-buttons">
              <button class="danger-button" onclick={confirmReset}>
                Ja, löschen
              </button>
              <button class="cancel-button" onclick={cancelReset}>
                Abbrechen
              </button>
            </div>
          </div>
        {/if}
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
    min-width: 500px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  h2 {
    margin: 0;
    color: #333;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.25rem;
    line-height: 1;
  }

  .close-button:hover {
    color: #333;
  }

  .settings-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .settings-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #555;
    font-size: 1.2rem;
  }

  .setting-item {
    margin-bottom: 1.5rem;
  }

  .setting-item:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    cursor: pointer;
  }

  input[type="checkbox"] {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  input[type="range"] {
    width: 100%;
    margin-top: 0.5rem;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #999;
    margin-top: 0.25rem;
  }

  .action-button,
  .danger-button,
  .cancel-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button {
    background-color: #1976d2;
    color: white;
  }

  .action-button:hover {
    background-color: #1565c0;
  }

  .danger-button {
    background-color: #f44336;
    color: white;
  }

  .danger-button:hover {
    background-color: #d32f2f;
  }

  .cancel-button {
    background-color: #e0e0e0;
    color: #333;
  }

  .cancel-button:hover {
    background-color: #d0d0d0;
  }

  .danger-zone {
    background-color: #fff3f3;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ffcdd2;
  }

  .warning-text {
    color: #d32f2f;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .confirm-box {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #f44336;
  }

  .confirm-text {
    font-weight: 600;
    color: #d32f2f;
    margin-bottom: 1rem;
  }

  .confirm-buttons {
    display: flex;
    gap: 1rem;
  }
</style>
