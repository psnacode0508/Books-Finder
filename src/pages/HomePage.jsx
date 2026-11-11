import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import { useFavourites } from '../context/FavouritesContext'
import { buildSearchUrl, normaliseBook } from '../utils/bookUtils'
import './HomePage.css'

function HomePage() {
  // ── Search state ────────────────────────────────────────────────────
  const [query, setQuery]         = useState('')
  const debouncedQuery            = useDebounce(query, 500)
  const searchUrl                 = buildSearchUrl(debouncedQuery)
  const { data, loading, error }  = useFetch(searchUrl)

  // ── Sort state ──────────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState('none') // 'none' | 'newest' | 'oldest'

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

  // ── useMemo: sort books ──────────────────────────────────────────────
  /**
   * sortedBooks is recomputed only when books or sortOrder change.
   *
   * Missing-year handling: books without a year are placed at the end
   * when sorting by newest or oldest.
   */
  const sortedBooks = useMemo(() => {
    if (sortOrder === 'newest') {
      return [...books].sort((a, b) => {
        if (a.year === null) return 1
        if (b.year === null) return -1
        return b.year - a.year
      })
    }
    if (sortOrder === 'oldest') {
      return [...books].sort((a, b) => {
        if (a.year === null) return 1
        if (b.year === null) return -1
        return a.year - b.year
      })
    }

    return books // 'none' — keep API order
  }, [books, sortOrder])

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
  const hasResults  = sortedBooks.length > 0
  const hasSearched = debouncedQuery.trim() !== ''

  return (
    <div className="home-page">
      {/* Search input */}
      <SearchBar value={query} onChange={setQuery} inputRef={searchInputRef} />

      {/* Debug render counter */}
      <p className="debug-label">
        🔄 HomePage render count: {renderCountRef.current}
      </p>

      {/* ── Sort controls — shown when there are search results ──────── */}
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

      {/* ── No results after API search ─────────────────────────────── */}
      {!loading && !error && hasSearched && books.length === 0 && data && (
        <div className="status-box status-box--empty">
          😕 No books found for &ldquo;{debouncedQuery}&rdquo;. Try a different keyword.
        </div>
      )}

      {/* ── Results list ─────────────────────────────────────────────── */}
      {!loading && !error && hasResults && (
        <>
          <p className="results-summary">
            Showing {sortedBooks.length} result{sortedBooks.length !== 1 ? 's' : ''} for&nbsp;
            &ldquo;{debouncedQuery}&rdquo;
          </p>
          <ul className="book-list" aria-label="Search results">
            {sortedBooks.map((book) => (
              <li key={book.key} className="book-list__item">
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
