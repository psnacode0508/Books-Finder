import { useState, useEffect } from 'react'

/**
 * useDebounce — delays updating a value until the user stops changing it.
 *
 * @param {string} value - The raw value to debounce (e.g. search input text).
 * @param {number} delay - Milliseconds to wait before committing the value.
 * @returns {string} The debounced value.
 *
 * How it works:
 *  1. Every time `value` changes, a setTimeout is scheduled for `delay` ms.
 *  2. If `value` changes again before the timer fires, the cleanup function
 *     runs first (clearTimeout), cancelling the previous timer.
 *  3. Only when the user stops typing for `delay` ms does setDebouncedValue
 *     actually run, which triggers useFetch with the stabilised query.
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clear the previous timer whenever value or delay changes
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
