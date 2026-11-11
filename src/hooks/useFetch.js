import { useState, useEffect } from 'react'

/**
 * useFetch — generic data-fetching hook.
 *
 * @param {string | null} url - The URL to fetch. Pass null to skip fetching.
 * @returns {{ data: any, loading: boolean, error: string | null }}
 *
 * How it works:
 *  1. Every time `url` changes, a new fetch is started inside useEffect.
 *  2. An AbortController is created for each fetch so we can cancel it.
 *  3. The effect cleanup function calls controller.abort() — this fires when
 *     the component unmounts OR when `url` changes before the previous fetch
 *     finished, ensuring stale responses never overwrite fresh ones.
 *  4. If the abort is intentional we swallow the error; any other error is
 *     stored in state and surfaced to the caller.
 */
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Skip fetch when no URL is provided
    if (!url) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    // Create a controller tied to THIS effect run
    const controller = new AbortController()

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed — status ${response.status}`)
        }

        const json = await response.json()

        // Only update state if this effect has NOT been cleaned up yet
        // (AbortController.signal.aborted is true if abort() was already called)
        if (!controller.signal.aborted) {
          setData(json)
        }
      } catch (err) {
        // AbortError is thrown when we intentionally cancel — ignore it
        if (err.name === 'AbortError') return

        setError(err.message || 'Something went wrong')
      } finally {
        // Only clear the loading flag if the request wasn't aborted
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup: abort the in-flight request when url changes or component unmounts
    return () => {
      controller.abort()
    }
  }, [url])

  return { data, loading, error }
}

export default useFetch
