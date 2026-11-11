import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import { useFavourites } from '../context/FavouritesContext'
import { buildSearchUrl, normaliseBook } from '../utils/bookUtils'
import './HomePage.css'

/**
 * HomePage — search interface for Book Finder.
 *
 * Performance notes
 * ─────────────────
 * useMemo:
 *   `filteredSortedBooks` is re-derived only when `books`, `sortOrder`,
 *   `minYear`, or `maxYear` change — not on every keystroke or unrelated
 *   state update.
 *
 * useCallback:
 *   `makeToggleHandler` is memoised per book key so each BookCard receives
 *   the same function reference on re-renders where only *other* books'
 *   favourite status changed. This keeps BookCard's React.memo effective.
 *
 * React.memo (in BookCard):
 *   Only re-renders when its own `book`, `isSaved`, or `onToggleFavourite`
 *   prop changes — prevents the full list from re-painting on a single save.
 */
function HomePage() {
  // ── Search state ────────────────────────────────────────────────────
  const [query, setQuery]         = useState('')
  const debouncedQuery            = useDebounce(query, 500)
  const searchUrl                 = buildSearchUrl(debouncedQuery)
  const { data, loading, error }  = useFetch(searchUrl)

  // ── Filter / sort state ─────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState('none')   // 'none' | 'newest' | 'oldest'
  const [minYear, setMinYear]     = useState('')        // empty string = no lower bound
  const [maxYear, setMaxYear]     = useState('')        // empty string = no upper bound

  // ── Refs ────────────────────────────────────────────────────────────
  const searchInputRef = useRef(null)
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus()
  }, [])

  // Counts how many times HomePage itself re-renders (not just BookCard)
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  // ── Favourites (read from context at this level only) ────────────────
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()

  // ── Derive base book list from raw API data ─────────────────────────
  const books = useMemo(() => {
    if (!data || !Array.isArray(data.docs)) return []
    return data.docs.map(normaliseBook)
  }, [data])

  // ── useMemo: filter then sort ────────────────────────────────────────
  /**
   * filteredSortedBooks is recomputed only when books, sortOrder,
   * minYear, or maxYear change — not on every render of the parent.
   *
   * Missing-year handling: books without a year are kept in the list but
   * sorted to the bottom so they don't confuse the ordering.
   */
  const filteredSortedBooks = useMemo(() => {
    const min = minYear !== '' ? Number(minYear) : null
    const max = maxYear !== '' ? Number(maxYear) : null

    // 1. Filter by year range
    const filtered = books.filter((book) => {
      if (!book.year) return true       // keep books with unknown year
      if (min !== null && book.year < min) return false
      if (max !== null && book.year > max) return false
      return true
    })

    // 2. Sort
    if (sortOrder === 'newest') {
      return [...filtered].sort((a, b) => {
        if (a.year === null) return 1   // push unknown-year books to end
        if (b.year === null) return -1
        return b.year - a.year
      })
    }
    if (sortOrder === 'oldest') {
      return [...filtered].sort((a, b) => {
        if (a.year === null) return 1
        if (b.year === null) return -1
        return a.year - b.year
      })
    }

    return filtered   // 'none' — keep API order
  }, [books, sortOrder, minYear, maxYear])

  // ── useCallback: stable per-book toggle handler ──────────────────────
  /**
   * makeToggleHandler returns a memoised function for each book.
   *
   * We use useCallback with [addFavourite, removeFavourite, isFavourite]
   * as deps. Because addFavourite and removeFavourite are themselves
   * stabilised with useCallback([]) in FavouritesContext, this function
   * reference only changes when the favourites list changes (via isFavourite).
   *
   * This means BookCard only re-renders when its own isSaved status changes.
   */
  const makeToggleHandler = useCallback(
    (book) => () => {
      if (isFavourite(book.key)) {
        removeFavourite(book.key)
      } else {
        addFavourite(book)
      }
    },
    [addFavourite, removeFavourite, isFavourite]
  )

  // ── Derived flags ───────────────────────────────────────────────────
  const hasResults  = filteredSortedBooks.length > 0
  const hasSearched = debouncedQuery.trim() !== ''
  const totalRaw    = books.length
  const totalShown  = filteredSortedBooks.length

  return (
    <div className="home-page">
      {/* Search input */}
      <SearchBar value={query} onChange={setQuery} inputRef={searchInputRef} />

      {/* Debug render counter */}
      <p className="debug-label">
        🔄 HomePage render count: {renderCountRef.current}
      </p>

      {/* ── Filter & sort controls — only shown when there are results ── */}
      {!loading && hasResults && (
        <div className="controls">
          <fieldset className="controls__group">
            <legend className="controls__legend">Sort</legend>
            <select
              className="controls__select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
            >
              <option value="none">Default</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </fieldset>

          <fieldset className="controls__group">
            <legend className="controls__legend">Year range</legend>
            <input
              type="number"
              className="controls__input"
              placeholder="From"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              min="1000"
              max="2100"
              aria-label="Minimum publication year"
            />
            <span className="controls__sep">–</span>
            <input
              type="number"
              className="controls__input"
              placeholder="To"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              min="1000"
              max="2100"
              aria-label="Maximum publication year"
            />
          </fieldset>
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="status-box status-box--loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Searching for &ldquo;{debouncedQuery}&rdquo;…
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="status-box status-box--error" role="alert">
          ⚠️ {error}. Please check your connection and try again.
        </div>
      )}

      {/* ── No results after API ─────────────────────────────────────── */}
      {!loading && !error && hasSearched && totalRaw === 0 && data && (
        <div className="status-box status-box--empty">
          😕 No books found for &ldquo;{debouncedQuery}&rdquo;. Try a different keyword.
        </div>
      )}

      {/* ── All filtered out by year range ──────────────────────────── */}
      {!loading && !error && totalRaw > 0 && totalShown === 0 && (
        <div className="status-box status-box--empty">
          😕 No books match the selected year range. Try widening the filter.
        </div>
      )}

      {/* ── Results list ─────────────────────────────────────────────── */}
      {!loading && !error && hasResults && (
        <>
          <p className="results-summary">
            Showing {totalShown} of {totalRaw} result{totalRaw !== 1 ? 's' : ''} for&nbsp;
            &ldquo;{debouncedQuery}&rdquo;
          </p>
          <ul className="book-list" aria-label="Search results">
            {filteredSortedBooks.map((book) => (
              <li key={book.key} className="book-list__item">
                {/*
                  isSaved and onToggleFavourite are computed here (in the
                  parent), not inside BookCard. This means BookCard itself
                  does not subscribe to FavouritesContext — React.memo can
                  short-circuit correctly.
                */}
                <BookCard
                  book={book}
                  isSaved={isFavourite(book.key)}
                  onToggleFavourite={makeToggleHandler(book)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ── Initial state ─────────────────────────────────────────────── */}
      {!hasSearched && !loading && (
        <div className="status-box status-box--initial">
          👋 Type a book title, author, or keyword above to get started.
        </div>
      )}
    </div>
  )
}

export default HomePage
