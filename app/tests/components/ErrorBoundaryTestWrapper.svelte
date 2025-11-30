<script lang="ts">
  import ErrorBoundary from '$lib/components/ErrorBoundary.svelte'
  export let showError = false
</script>

<ErrorBoundary>
  {#if showError}
    <div>This should cause error</div>
  {:else}
    <div data-testid="child-content">Child Content</div>
  {/if}
</ErrorBoundary>
