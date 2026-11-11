import { useParams, Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { useFavourites } from '../context/FavouritesContext'
import { buildWorksUrl, getCoverUrl } from '../utils/bookUtils'
import './BookDetailPage.css'

/**
 * BookDetailPage — fetches and displays full details for one book.
 *
 * Route: /books/:id  (e.g. /books/OL45804W)
 *
 * useParams() reads the ":id" segment from the URL so this page works
 * correctly even on a direct browser refresh — the id comes from the URL,
 * not from in-memory state.
 *
 * The Open Library Works API returns:
 *   title, description (string OR { value: string }), subjects[], covers[]
 */
function BookDetailPage() {
  // Pull the work ID out of the URL (e.g. "OL45804W")
  const { id } = useParams()

  const worksUrl = buildWorksUrl(id)
  const { data, loading, error } = useFetch(worksUrl)

  const { addFavourite, removeFavourite, isFavourite } = useFavourites()

  // ── Derive display values from raw API data ────────────────────────
  const title = data?.title || 'Untitled'

  // Description can be a plain string or an object with a "value" key
  const rawDesc = data?.description
  const description =
    typeof rawDesc === 'string'
      ? rawDesc
      : typeof rawDesc === 'object' && rawDesc?.value
      ? rawDesc.value
      : null

  // Subjects — array of strings; show first 8 to avoid clutter
  const subjects = Array.isArray(data?.subjects) ? data.subjects.slice(0, 8) : []

  // Cover — works API returns a "covers" array of cover IDs
  const coverId = Array.isArray(data?.covers) ? data.covers[0] : null
  const coverUrl = getCoverUrl(coverId, 'L')   // Large size for detail page

  // Build a minimal book object for favouriting (we may not have author/year here)
  const bookForFav = {
    key: `/works/${id}`,
    title,
    author: 'See details',
    year: null,
    coverUrl: getCoverUrl(coverId, 'M'),
    coverId,
  }
  const bookKey = `/works/${id}`
  const saved = isFavourite(bookKey)

  function handleFavouriteClick() {
    if (saved) {
      removeFavourite(bookKey)
    } else {
      addFavourite(bookForFav)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="detail-page">
      {/* Always show back link */}
      <Link to="/" className="detail-page__back">← Back to Search</Link>

      {/* Loading state */}
      {loading && (
        <div className="status-box status-box--loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading book details…
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="status-box status-box--error" role="alert">
          ⚠️ {error}. The book may not exist or the API is unavailable.
        </div>
      )}

      {/* Success state */}
      {!loading && !error && data && (
        <div className="detail-page__content">
          {/* Cover */}
          <div className="detail-page__cover">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`Cover of ${title}`}
                className="detail-page__img"
              />
            ) : (
              <div className="detail-page__no-cover">📖</div>
            )}
          </div>

          {/* Info panel */}
          <div className="detail-page__info">
            <h2 className="detail-page__title">{title}</h2>

            {/* Description */}
            {description ? (
              <p className="detail-page__description">{description}</p>
            ) : (
              <p className="detail-page__description detail-page__description--missing">
                No description available for this book.
              </p>
            )}

            {/* Subjects */}
            {subjects.length > 0 && (
              <div className="detail-page__subjects">
                <h3 className="detail-page__subjects-title">Subjects</h3>
                <ul className="detail-page__subject-list">
                  {subjects.map((subject) => (
                    <li key={subject} className="detail-page__subject-tag">
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Favourite toggle */}
            <button
              type="button"
              className={`detail-page__fav-btn ${saved ? 'detail-page__fav-btn--saved' : ''}`}
              onClick={handleFavouriteClick}
            >
              {saved ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookDetailPage
