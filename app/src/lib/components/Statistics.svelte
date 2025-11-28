<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { statistics } from '$lib/stores/statistics'
  import { fade, slide } from 'svelte/transition'
  import type { GameMode } from '$lib/types'

  export let show: boolean = false

  const dispatch = createEventDispatcher<{
    close: void
  }>()

  const modeLabels: Record<GameMode, string> = {
    federalState: 'Bundesländer',
    neighbor: 'Nachbarländer',
    city: 'Städte'
  }

  function handleClose() {
    dispatch('close')
  }

  function formatSuccessRate(rate: number): string {
    return rate.toFixed(1) + '%'
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
        <h2>Statistiken</h2>
        <button class="close-button" onclick={handleClose}>✕</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{$statistics.totalSessions}</div>
          <div class="stat-label">Gespielte Sitzungen</div>
        </div>
      </div>

      <div class="mode-stats">
        {#each Object.entries($statistics.byMode) as [mode, stats]}
          <div class="mode-card">
            <h3>{modeLabels[mode as GameMode]}</h3>
            <div class="mode-details">
              <div class="detail-row">
                <span class="detail-label">Sitzungen:</span>
                <span class="detail-value">{stats.sessionsPlayed}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fragen:</span>
                <span class="detail-value">{stats.totalQuestions}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Richtig:</span>
                <span class="detail-value">{stats.correctAnswers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Erfolgsquote:</span>
                <span class="detail-value success-rate">
                  {formatSuccessRate(stats.successRate)}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Beste Punktzahl:</span>
                <span class="detail-value best-score">{stats.bestScore}</span>
              </div>
            </div>
            {#if stats.sessionsPlayed === 0}
              <div class="no-data">Noch keine Daten</div>
            {/if}
          </div>
        {/each}
      </div>

      {#if $statistics.weakAreas.length > 0}
        <div class="weak-areas">
          <h3>Verbesserungspotenzial</h3>
          <p class="weak-areas-description">
            Hier sind die Regionen, bei denen du noch üben kannst:
          </p>
          <div class="weak-areas-list">
            {#each $statistics.weakAreas.slice(0, 5) as area}
              <div class="weak-area-item">
                <span class="weak-area-name">{area.locationName}</span>
                <div class="weak-area-bar">
                  <div
                    class="weak-area-fill"
                    style="width: {area.successRate}%"
                  ></div>
                </div>
                <span class="weak-area-rate">
                  {formatSuccessRate(area.successRate)}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if $statistics.totalSessions === 0}
        <div class="empty-state">
          <p>Noch keine Statistiken verfügbar.</p>
          <p>Spiele ein paar Runden, um deine Fortschritte zu sehen!</p>
        </div>
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
    min-width: 600px;
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

  .stats-overview {
    margin-bottom: 2rem;
  }

  .stat-card {
    background-color: #e3f2fd;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
  }

  .stat-value {
    font-size: 3rem;
    font-weight: 700;
    color: #1976d2;
  }

  .stat-label {
    font-size: 1rem;
    color: #666;
    margin-top: 0.5rem;
  }

  .mode-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .mode-card {
    background-color: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    position: relative;
  }

  .mode-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.2rem;
  }

  .mode-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    color: #666;
    font-size: 0.9rem;
  }

  .detail-value {
    font-weight: 600;
    color: #333;
  }

  .success-rate {
    color: #4caf50;
  }

  .best-score {
    color: #ff9800;
  }

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-style: italic;
    font-size: 0.9rem;
  }

  .weak-areas {
    background-color: #fff9e6;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px solid #ffe0b2;
  }

  .weak-areas h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #f57c00;
  }

  .weak-areas-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .weak-areas-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .weak-area-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    align-items: center;
  }

  .weak-area-name {
    font-weight: 600;
    color: #333;
  }

  .weak-area-bar {
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .weak-area-fill {
    height: 100%;
    background: linear-gradient(to right, #f44336, #ff9800, #4caf50);
    transition: width 0.3s ease;
  }

  .weak-area-rate {
    font-weight: 600;
    color: #666;
    min-width: 50px;
    text-align: right;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #999;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }
</style>
