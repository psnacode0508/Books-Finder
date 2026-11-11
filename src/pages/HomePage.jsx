import { useState, useEffect, useRef } from 'react'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import { buildSearchUrl, normaliseBook } from '../utils/bookUtils'
import './HomePage.css'

/**
 * HomePage — search interface for Book Finder.
 *
 * useRef usage:
 *  1. searchInputRef  → passed to SearchBar so we can call .focus() on mount.
 *  2. renderCountRef  → a mutable counter that increments on every render of
 *                       the results list. Unlike state, mutating a ref does NOT
 *                       trigger a re-render, so it's perfect for tracking how
 *                       many times a subtree has painted without causing loops.
 */
function HomePage() {
  // Raw text the user types — updates on every keystroke
  const [query, setQuery] = useState('')

  // Debounced value — only updates 500 ms after the user stops typing
  const debouncedQuery = useDebounce(query, 500)

  // Build the URL only when there is a non-empty debounced query
  // buildSearchUrl returns null for empty strings → useFetch skips the call
  const searchUrl = buildSearchUrl(debouncedQuery)

  // useFetch handles the actual network request + AbortController cleanup
  const { data, loading, error } = useFetch(searchUrl)

  // Ref 1: auto-focus the search input when the page first loads
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, []) // empty deps → runs once after the initial render

  // Ref 2: count how many times the results list section has rendered
  // We use a ref (not state) so counting itself never causes extra renders
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  // Derive the list of books from the raw API response
  const books =
    data && Array.isArray(data.docs)
      ? data.docs.map(normaliseBook)
      : []

  const hasResults = books.length > 0
  const hasSearched = debouncedQuery.trim() !== ''

  return (
    <div className="home-page">
      {/* Search input — receives the ref so it can be focused programmatically */}
      <SearchBar
        value={query}
        onChange={setQuery}
        inputRef={searchInputRef}
      />

      {/* Debug render counter — small label below the search bar */}
      <p className="debug-label">
        🔄 Results section render count: {renderCountRef.current}
      </p>

      {/* ── State: Loading ─────────────────────────────────────────── */}
      {loading && (
        <div className="status-box status-box--loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Searching for &ldquo;{debouncedQuery}&rdquo;…
        </div>
      )}

      {/* ── State: Error ───────────────────────────────────────────── */}
      {!loading && error && (
        <div className="status-box status-box--error" role="alert">
          ⚠️ {error}. Please check your connection and try again.
        </div>
      )}

      {/* ── State: No results (searched but API returned 0 docs) ───── */}
      {!loading && !error && hasSearched && !hasResults && data && (
        <div className="status-box status-box--empty">
          😕 No books found for &ldquo;{debouncedQuery}&rdquo;. Try a different keyword.
        </div>
      )}

      {/* ── State: Results list ────────────────────────────────────── */}
      {!loading && !error && hasResults && (
        <>
          <p className="results-summary">
            Showing {books.length} result{books.length !== 1 ? 's' : ''} for&nbsp;
            &ldquo;{debouncedQuery}&rdquo;
          </p>
          <ul className="book-list" aria-label="Search results">
            {books.map((book) => (
              <li key={book.key} className="book-list__item">
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ── State: Initial (nothing searched yet) ─────────────────── */}
      {!hasSearched && !loading && (
        <div className="status-box status-box--initial">
          👋 Type a book title, author, or keyword above to get started.
        </div>
      )}
    </div>
  )
}

export default HomePage
