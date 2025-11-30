<script lang="ts">
  import { currentScore } from '$lib/stores/gameState'
  import type { GameSession } from '$lib/types'

  export let session: GameSession | null = null

  $: displayScore = session?.score ?? $currentScore
  $: totalQuestions = session?.totalQuestions ?? 0
  $: maxScore = session?.mode === 'laender' ? totalQuestions * 2 : totalQuestions
  $: percentage = totalQuestions > 0 ? Math.round((displayScore / maxScore) * 100) : 0
</script>

<div class="score-display">
  <div class="score-main">
    <span class="score-label">Punktzahl:</span>
    <span class="score-value">{displayScore}</span>
    {#if totalQuestions > 0}
      <span class="score-total">/ {maxScore}</span>
    {/if}
  </div>
  {#if totalQuestions > 0}
    <div class="score-percentage">{percentage}%</div>
  {/if}
</div>

<style>
  .score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .score-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
  }

  .score-label {
    font-weight: 600;
    color: #666;
  }

  .score-value {
    font-weight: 700;
    font-size: 2rem;
    color: #1976d2;
  }

  .score-total {
    font-size: 1.2rem;
    color: #999;
  }

  .score-percentage {
    font-size: 1rem;
    color: #666;
    padding: 0.25rem 0.75rem;
    background-color: #e3f2fd;
    border-radius: 12px;
  }
</style>
