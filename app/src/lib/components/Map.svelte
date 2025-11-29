<script lang="ts">
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import type { GameMode } from '$lib/types'

  export let mode: GameMode | null = null
  export let highlightedRegion: string | null = null
  export let correctRegion: string | null = null
  export let incorrectClickPosition: { x: number; y: number } | null = null
  export let correctRegions: string[] = [] // Permanently highlighted correct regions
  export let incorrectRegions: string[] = [] // Permanently highlighted incorrect regions
  export let cityFeedbackItems: Array<{ coordinates: { x: number; y: number }; isCorrect: boolean }> = []

  const dispatch = createEventDispatcher<{
    regionClick: { regionId: string; svgPathId: string }
    mapClick: { x: number; y: number; svgX: number; svgY: number }
  }>()

  let svgElement: SVGSVGElement
  let mapContainer: HTMLDivElement
  let mapLoaded = false
  let cursorCircle: SVGCircleElement | null = null
  let mousePosition: { svgX: number; svgY: number } | null = null
  let cityFeedbackGroup: SVGGElement | null = null

  const CITY_CLICK_THRESHOLD = 30 // pixels - must match gameState.ts

  onMount(async () => {
    try {
      // Load SVG file
      const response = await fetch('/src/assets/germany-map.svg')
      const svgText = await response.text()

      // Insert SVG into container
      mapContainer.innerHTML = svgText
      svgElement = mapContainer.querySelector('svg')!

      // Set up click handlers
      setupClickHandlers()

      mapLoaded = true
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  })

  function setupClickHandlers() {
    // Add click handlers to all clickable regions
    const regions = svgElement.querySelectorAll('.clickable-region')

    regions.forEach(region => {
      region.addEventListener('click', handleRegionClick)
      region.addEventListener('mouseenter', handleRegionHover)
      region.addEventListener('mouseleave', handleRegionUnhover)
    })

    // Also handle clicks on the SVG itself (for city mode)
    svgElement.addEventListener('click', handleSvgClick)

    // Add mouse move handler for city mode cursor
    svgElement.addEventListener('mousemove', handleMouseMove)
    svgElement.addEventListener('mouseenter', handleMouseEnter)
    svgElement.addEventListener('mouseleave', handleMouseLeave)

    // Create cursor circle for city mode
    createCursorCircle()

    // Create city feedback group
    createCityFeedbackGroup()
  }

  function createCursorCircle() {
    cursorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    cursorCircle.setAttribute('r', CITY_CLICK_THRESHOLD.toString())
    cursorCircle.classList.add('city-cursor-circle')
    cursorCircle.style.pointerEvents = 'none'
    svgElement.appendChild(cursorCircle)
    updateCursorVisibility()
  }

  function createCityFeedbackGroup() {
    cityFeedbackGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    cityFeedbackGroup.setAttribute('id', 'city-feedback-group')
    svgElement.appendChild(cityFeedbackGroup)
  }

  function handleMouseMove(event: MouseEvent) {
    if (mode !== 'city') return

    const pt = svgElement.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    const svgP = pt.matrixTransform(svgElement.getScreenCTM()!.inverse())

    mousePosition = { svgX: svgP.x, svgY: svgP.y }
    updateCursorPosition()
  }

  function handleMouseEnter() {
    if (mode === 'city' && cursorCircle) {
      cursorCircle.style.display = 'block'
    }
  }

  function handleMouseLeave() {
    if (cursorCircle) {
      cursorCircle.style.display = 'none'
    }
    mousePosition = null
  }

  function updateCursorPosition() {
    if (cursorCircle && mousePosition) {
      cursorCircle.setAttribute('cx', mousePosition.svgX.toString())
      cursorCircle.setAttribute('cy', mousePosition.svgY.toString())
    }
  }

  function updateCursorVisibility() {
    if (cursorCircle) {
      cursorCircle.style.display = mode === 'city' ? 'block' : 'none'
    }
  }

  function handleRegionClick(event: Event) {
    event.stopPropagation()
    const target = event.target as SVGPathElement
    const regionId = target.id

    dispatch('regionClick', {
      regionId,
      svgPathId: regionId
    })
  }

  function handleSvgClick(event: MouseEvent) {
    if ((event.target as Element).classList.contains('clickable-region')) {
      return // Already handled by region click
    }

    // Get click coordinates in SVG space
    const pt = svgElement.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    const svgP = pt.matrixTransform(svgElement.getScreenCTM()!.inverse())

    dispatch('mapClick', {
      x: event.clientX,
      y: event.clientY,
      svgX: svgP.x,
      svgY: svgP.y
    })
  }

  function handleRegionHover(event: Event) {
    const target = event.target as SVGPathElement
    target.classList.add('hovered')
  }

  function handleRegionUnhover(event: Event) {
    const target = event.target as SVGPathElement
    target.classList.remove('hovered')
  }

  // React to prop changes for highlighting
  $: if (mapLoaded && svgElement) {
    // Trigger update when any highlighting prop changes
    void highlightedRegion
    void correctRegion
    void correctRegions
    void incorrectRegions
    updateHighlighting()
  }

  // React to mode changes for cursor visibility
  $: if (mapLoaded && cursorCircle) {
    void mode
    updateCursorVisibility()
  }

  // React to cityFeedbackItems changes
  $: if (mapLoaded && cityFeedbackGroup) {
    void cityFeedbackItems
    updateCityFeedbackItems()
  }

  function updateCityFeedbackItems() {
    if (!cityFeedbackGroup) return

    // Clear existing circles
    cityFeedbackGroup.innerHTML = ''

    // Add a circle for each feedback item
    cityFeedbackItems.forEach((item) => {
      if (!cityFeedbackGroup) return

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', item.coordinates.x.toString())
      circle.setAttribute('cy', item.coordinates.y.toString())
      circle.setAttribute('r', '12')
      circle.classList.add('city-feedback-circle')
      circle.classList.add(item.isCorrect ? 'correct' : 'incorrect')
      circle.style.pointerEvents = 'none'
      cityFeedbackGroup.appendChild(circle)
    })
  }

  function updateHighlighting() {
    // Remove all existing highlights
    svgElement.querySelectorAll('.clickable-region').forEach(region => {
      region.classList.remove('highlighted', 'correct', 'incorrect', 'permanent-correct', 'permanent-incorrect')
    })

    // Apply permanent highlighting for answered regions
    correctRegions.forEach(regionId => {
      const region = svgElement.querySelector(`#${regionId}`)
      region?.classList.add('permanent-correct')
    })

    incorrectRegions.forEach(regionId => {
      const region = svgElement.querySelector(`#${regionId}`)
      region?.classList.add('permanent-incorrect')
    })

    // Add highlight to specified region
    if (highlightedRegion) {
      const region = svgElement.querySelector(`#${highlightedRegion}`)
      region?.classList.add('highlighted')
    }

    // Show correct region
    if (correctRegion) {
      const region = svgElement.querySelector(`#${correctRegion}`)
      region?.classList.add('correct')
    }

    // Show incorrect click position (for city mode)
    if (incorrectClickPosition) {
      // Add a red X or circle at the click position
      // This will be implemented when we handle city mode feedback
    }
  }
</script>

<div class="map-container" class:city-mode={mode === 'city'} bind:this={mapContainer}>
  {#if !mapLoaded}
    <div class="loading">Karte wird geladen...</div>
  {/if}
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .map-container :global(svg) {
    width: 100%;
    height: 100%;
    max-width: 1000px;
    max-height: 800px;
  }

  .map-container :global(.clickable-region) {
    fill: #e0e0e0;
    stroke: #333;
    stroke-width: 1;
    cursor: pointer;
    transition: fill 0.2s ease;
  }

  .map-container :global(.clickable-region:hover),
  .map-container :global(.clickable-region.hovered) {
    fill: #ffeb3b;
  }

  .map-container :global(.clickable-region.highlighted) {
    fill: #90caf9;
  }

  .map-container :global(.clickable-region.correct) {
    fill: #66bb6a;
    animation: pulse-correct 0.5s ease;
  }

  .map-container :global(.clickable-region.incorrect) {
    fill: #ef5350;
    animation: pulse-incorrect 0.5s ease;
  }

  .map-container :global(.clickable-region.permanent-correct) {
    fill: #66bb6a;
  }

  .map-container :global(.clickable-region.permanent-incorrect) {
    fill: #ef5350;
  }

  @keyframes pulse-correct {
    0%, 100% { fill: #66bb6a; }
    50% { fill: #81c784; }
  }

  @keyframes pulse-incorrect {
    0%, 100% { fill: #ef5350; }
    50% { fill: #e57373; }
  }

  .loading {
    font-size: 1.2rem;
    color: #666;
  }

  .map-container :global(.city-cursor-circle) {
    fill: rgba(33, 150, 243, 0.15);
    stroke: #2196F3;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
    display: none;
  }

  /* In city mode, disable region clicks so clicks go to map handler */
  .map-container.city-mode :global(.clickable-region) {
    pointer-events: none;
  }

  .map-container :global(.city-feedback-circle) {
    stroke: white;
    stroke-width: 3;
  }

  .map-container :global(.city-feedback-circle.correct) {
    fill: #4CAF50;
  }

  .map-container :global(.city-feedback-circle.incorrect) {
    fill: #f44336;
  }
</style>
