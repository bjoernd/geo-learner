<script lang="ts">
  import { onMount } from 'svelte'

  let hasError = false
  let errorMessage = ''

  onMount(() => {
    const handleError = (event: ErrorEvent) => {
      hasError = true
      errorMessage = event.message
      console.error('Error caught:', event.error)
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  })

  function reload() {
    hasError = false
    window.location.reload()
  }
</script>

{#if hasError}
  <div class="error-boundary">
    <div class="error-content">
      <h1>😕 Etwas ist schiefgelaufen</h1>
      <p>Die Anwendung ist auf einen Fehler gestoßen.</p>
      <details>
        <summary>Fehlerdetails</summary>
        <pre>{errorMessage}</pre>
      </details>
      <button on:click={reload}>Neu laden</button>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
  }

  .error-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 600px;
  }

  h1 {
    color: #f44336;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }

  details {
    text-align: left;
    margin: 1rem 0;
  }

  summary {
    cursor: pointer;
    color: #1976d2;
  }

  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background-color: #1565c0;
  }
</style>
