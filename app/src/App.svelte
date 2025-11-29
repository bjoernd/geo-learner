<script lang="ts">
  import { onMount } from 'svelte'
  import Map from '$lib/components/Map.svelte'
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte'
  import ModeSelector from '$lib/components/ModeSelector.svelte'
  import CapitalInputModal from '$lib/components/CapitalInputModal.svelte'
  import Timer from '$lib/components/Timer.svelte'
  import Settings from '$lib/components/Settings.svelte'
  import Statistics from '$lib/components/Statistics.svelte'
  import { gameState, isSessionActive, answeredRegions } from '$lib/stores/gameState'
  import { settings } from '$lib/stores/settings'
  import { statistics } from '$lib/stores/statistics'
  import type { GameMode } from '$lib/types'

  let showSettings = false
  let showStatistics = false
  let timerComponent: any

  $: currentMode = $gameState.currentMode
  $: currentQuestion = $gameState.currentQuestion
  $: currentSession = $gameState.currentSession
  $: awaitingCapitalInput = $gameState.awaitingCapitalInput
  $: lastAnswerCorrect = $gameState.lastAnswerCorrect
  $: correctLocation = $gameState.correctLocation

  // Modal state for capital input
  let showCapitalModal = false
  let capitalModalLocationName = ''
  let capitalModalCorrectAnswer = ''
  let capitalModalIsCorrect: boolean | null = null
  let capitalModalUserAnswer = ''

  // Map highlighting
  let highlightedRegion: string | null = null
  let correctRegionHighlight: string | null = null
  let cityFeedbackItems: Array<{ coordinates: { x: number; y: number }; isCorrect: boolean }> = []

  $: {
    // Show capital modal when awaiting input
    if (awaitingCapitalInput && currentQuestion) {
      showCapitalModal = true
      capitalModalLocationName = currentQuestion.location.name
      capitalModalCorrectAnswer = currentQuestion.location.capital!
      capitalModalIsCorrect = null
      capitalModalUserAnswer = ''
    }
  }

  function handleModeSelect(event: CustomEvent<{ mode: GameMode }>) {
    if ($isSessionActive) {
      const confirmed = confirm('Dies beendet die aktuelle Sitzung. Fortfahren?')
      if (!confirmed) return
    }

    gameState.startNewSession(event.detail.mode)
    resetMapHighlights()
    cityFeedbackItems = [] // Clear city feedback for new session
    if (timerComponent) {
      timerComponent.reset()
    }
  }

  function handleRegionClick(event: CustomEvent<{ regionId: string; svgPathId: string }>) {
    if (!$isSessionActive || awaitingCapitalInput) return

    const clickedRegionId = event.detail.svgPathId

    // Submit answer
    gameState.submitLocationAnswer(clickedRegionId)

    // Show feedback
    if (lastAnswerCorrect === false) {
      showIncorrectFeedback()
    }
  }

  function handleMapClick(event: CustomEvent<{ x: number; y: number; svgX: number; svgY: number }>) {
    // For city mode, handle clicks on the map
    if (!$isSessionActive || currentMode !== 'city' || awaitingCapitalInput) return

    const clickPosition = { x: event.detail.svgX, y: event.detail.svgY }
    gameState.submitLocationAnswer(null, clickPosition)

    // Wait for reactive state to update, then add feedback
    setTimeout(() => {
      // Add city feedback marker to the permanent list
      if (correctLocation && 'coordinates' in correctLocation) {
        cityFeedbackItems = [...cityFeedbackItems, {
          coordinates: (correctLocation as any).coordinates,
          isCorrect: lastAnswerCorrect === true
        }]
      }

      // Move to next question after showing feedback
      setTimeout(() => {
        resetMapHighlights()
      }, lastAnswerCorrect ? 1000 : 2000)
    }, 0)
  }

  function handleCapitalSubmit(event: CustomEvent<{ answer: string }>) {
    const userAnswer = event.detail.answer
    capitalModalUserAnswer = userAnswer

    // Submit answer to game state
    gameState.submitCapitalAnswer(userAnswer)

    // Show feedback - get updated state after submission
    const updatedState = $gameState
    capitalModalIsCorrect = updatedState.lastAnswerCorrect

    // After showing feedback, close modal and continue
    setTimeout(() => {
      showCapitalModal = false
      capitalModalIsCorrect = null

      if (updatedState.lastAnswerCorrect === false) {
        showIncorrectFeedback()
      } else {
        resetMapHighlights()
      }
    }, 2000)
  }

  function handleCapitalModalClose() {
    // Only allow closing if feedback has been shown
    if (capitalModalIsCorrect !== null) {
      showCapitalModal = false
      capitalModalIsCorrect = null
      resetMapHighlights()
    }
  }

  function showIncorrectFeedback() {
    if (correctLocation) {
      correctRegionHighlight = correctLocation.svgPathId
      setTimeout(() => {
        resetMapHighlights()
      }, 2000)
    }
  }

  function resetMapHighlights() {
    highlightedRegion = null
    correctRegionHighlight = null
  }

  function handleTimerTimeout() {
    // Treat timeout as incorrect answer
    if ($isSessionActive && !awaitingCapitalInput) {
      gameState.submitLocationAnswer(null)
      showIncorrectFeedback()
    }
  }

  function handleSettingsClose() {
    showSettings = false
  }

  function handleViewStatistics() {
    showSettings = false
    showStatistics = true
  }

  function handleStatisticsClose() {
    showStatistics = false
  }

  function handleResetProgress() {
    statistics.reset()
    gameState.clearSession()
    showSettings = false
    alert('Alle Fortschritte wurden zurückgesetzt.')
  }

  // Watch for session end
  $: if (currentSession && !currentQuestion && currentSession.endTime) {
    // Session ended, record statistics
    statistics.recordSession(currentSession)
    setTimeout(() => {
      const playAgain = confirm(
        `Sitzung beendet!\nPunktzahl: ${currentSession.score}/${currentSession.totalQuestions * 2}\n\nNoch eine Runde spielen?`
      )
      if (playAgain && currentMode) {
        gameState.startNewSession(currentMode)
      } else {
        gameState.clearSession()
      }
    }, 500)
  }
</script>

<main>
  <header>
    <h1>Erdkunde</h1>
    <div class="header-actions">
      <button class="icon-button" on:click={() => (showStatistics = true)} title="Statistiken" aria-label="Statistiken anzeigen">
        📊
      </button>
      <button class="icon-button" on:click={() => (showSettings = true)} title="Einstellungen" aria-label="Einstellungen öffnen">
        ⚙️
      </button>
    </div>
  </header>

  {#if !$isSessionActive}
    <div class="mode-selection">
      <ModeSelector
        currentMode={currentMode}
        on:modeSelect={handleModeSelect}
      />
    </div>
  {:else}
    <div class="game-container">
      <div class="game-sidebar">
        <ScoreDisplay session={currentSession} />

        {#if $settings.timerEnabled}
          <Timer
            bind:this={timerComponent}
            duration={$settings.timerDuration}
            enabled={$settings.timerEnabled && $isSessionActive}
            paused={awaitingCapitalInput}
            on:timeout={handleTimerTimeout}
          />
        {/if}

        {#if currentQuestion}
          <div class="question-display">
            <h2>Finde:</h2>
            <p class="question-text">{currentQuestion.location.name}</p>
          </div>
        {/if}

        <button class="end-session-button" on:click={() => gameState.endSession()}>
          Sitzung beenden
        </button>
      </div>

      <div class="map-area">
        <Map
          mode={currentMode}
          highlightedRegion={highlightedRegion}
          correctRegion={correctRegionHighlight}
          correctRegions={$answeredRegions.correct}
          incorrectRegions={$answeredRegions.incorrect}
          cityFeedbackItems={cityFeedbackItems}
          on:regionClick={handleRegionClick}
          on:mapClick={handleMapClick}
        />
      </div>
    </div>
  {/if}

  {#key currentQuestion?.location.id}
    <CapitalInputModal
      show={showCapitalModal}
      locationName={capitalModalLocationName}
      correctCapital={capitalModalCorrectAnswer}
      isAnswerCorrect={capitalModalIsCorrect}
      userAnswer={capitalModalUserAnswer}
      on:submit={handleCapitalSubmit}
      on:close={handleCapitalModalClose}
    />
  {/key}

  <Settings
    show={showSettings}
    on:close={handleSettingsClose}
    on:viewStatistics={handleViewStatistics}
    on:resetProgress={handleResetProgress}
  />

  <Statistics
    show={showStatistics}
    on:close={handleStatisticsClose}
  />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background-color: #1976d2;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .icon-button:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .mode-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .game-container {
    flex: 1;
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  .game-sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .question-display {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .question-display h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .question-text {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }

  .end-session-button {
    padding: 0.75rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .end-session-button:hover {
    background-color: #d32f2f;
  }

  .map-area {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .game-container {
      flex-direction: column;
    }

    .game-sidebar {
      width: 100%;
    }

    .map-area {
      min-height: 400px;
    }
  }
</style>
