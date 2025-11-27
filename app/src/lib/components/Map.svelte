<script lang="ts">
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import type { GameMode } from '$lib/types'

  export let mode: GameMode | null = null
  export let highlightedRegion: string | null = null
  export let correctRegion: string | null = null
  export let incorrectClickPosition: { x: number; y: number } | null = null

  const dispatch = createEventDispatcher<{
    regionClick: { regionId: string; svgPathId: string }
    mapClick: { x: number; y: number; svgX: number; svgY: number }
  }>()

  let svgElement: SVGSVGElement
  let mapContainer: HTMLDivElement
  let mapLoaded = false

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
    updateHighlighting()
  }

  function updateHighlighting() {
    // Remove all existing highlights
    svgElement.querySelectorAll('.clickable-region').forEach(region => {
      region.classList.remove('highlighted', 'correct', 'incorrect')
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

<div class="map-container" bind:this={mapContainer}>
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
</style>
