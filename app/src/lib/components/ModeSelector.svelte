<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { GameMode } from '$lib/types'

  export let currentMode: GameMode | null = null
  export let disabled: boolean = false

  const dispatch = createEventDispatcher<{
    modeSelect: { mode: GameMode }
  }>()

  const modes: Array<{ id: GameMode; label: string; description: string }> = [
    {
      id: 'laender',
      label: 'Länder',
      description: 'Bundesländer plus die 9 Nachbarländer Deutschlands'
    },
    {
      id: 'orte',
      label: 'Orte',
      description: 'Finde deutsche Städte und Flüsse auf der Karte'
    }
  ]

  function selectMode(mode: GameMode) {
    if (!disabled) {
      dispatch('modeSelect', { mode })
    }
  }
</script>

<div class="mode-selector">
  <h2>Wähle einen Modus:</h2>
  <div class="mode-buttons">
    {#each modes as mode}
      <button
        class="mode-button"
        class:active={currentMode === mode.id}
        class:disabled
        on:click={() => selectMode(mode.id)}
        {disabled}
      >
        <div class="mode-label">{mode.label}</div>
        <div class="mode-description">{mode.description}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .mode-selector {
    padding: 2rem;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .mode-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .mode-button {
    padding: 1.5rem;
    min-width: 250px;
    background-color: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover:not(.disabled) {
    border-color: #1976d2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .mode-button.active {
    border-color: #1976d2;
    background-color: #e3f2fd;
  }

  .mode-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mode-label {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .mode-description {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
</style>
