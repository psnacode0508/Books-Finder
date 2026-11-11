import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import { extractWorkId } from '../utils/bookUtils'
import './FavouritesPage.css'

/**
 * FavouritesPage — shows all saved books with cover, title, author,
 * a Details link, and a Remove button.
 *
 * Route: /favourites
 */
function FavouritesPage() {
  const { favourites, removeFavourite } = useFavourites()

  // ── Empty state ────────────────────────────────────────────────────
  if (favourites.length === 0) {
    return (
      <div className="fav-page">
        <h2 className="fav-page__heading">❤️ Your Favourites</h2>
        <div className="status-box status-box--initial">
          😕 You haven&apos;t saved any books yet.{' '}
          <Link to="/" className="fav-page__home-link">Search for books</Link> to get started.
        </div>
      </div>
    )
  }

  return (
    <div className="fav-page">
      <h2 className="fav-page__heading">
        ❤️ Your Favourites{' '}
        <span className="fav-page__count">({favourites.length})</span>
      </h2>

      <ul className="fav-list">
        {favourites.map((book) => {
          const { key, title, author, coverUrl } = book
          const workId = extractWorkId(key)

          return (
            <li key={key} className="fav-card">
              {/* Cover */}
              <div className="fav-card__cover">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`Cover of ${title}`}
                    className="fav-card__img"
                    loading="lazy"
                  />
                ) : (
                  <div className="fav-card__no-cover">📖</div>
                )}
              </div>

              {/* Info */}
              <div className="fav-card__info">
                <h3 className="fav-card__title">{title}</h3>
                <p className="fav-card__author">✍️ {author}</p>

                <div className="fav-card__actions">
                  {workId && (
                    <Link
                      to={`/books/${workId}`}
                      className="book-card__btn book-card__btn--details"
                    >
                      Details
                    </Link>
                  )}
                  <button
                    type="button"
                    className="book-card__btn book-card__btn--saved"
                    onClick={() => removeFavourite(key)}
                    aria-label={`Remove ${title} from favourites`}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FavouritesPage
