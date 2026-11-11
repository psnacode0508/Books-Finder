import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import { extractWorkId } from '../utils/bookUtils'
import './BookCard.css'

/**
 * BookCard — displays a single book result.
 *
 * Props:
 *  - book: { key, title, author, year, coverUrl, coverId }
 *
 * Now includes:
 *  - A "Details" link to /books/:id
 *  - An Add / Remove favourite button wired to FavouritesContext
 */
function BookCard({ book }) {
  const { title, author, year, coverUrl, key } = book
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()

  // Extract the work ID from the key string (e.g. "/works/OL123W" → "OL123W")
  const workId = extractWorkId(key)
  const saved = isFavourite(key)

  function handleFavouriteClick() {
    if (saved) {
      removeFavourite(key)
    } else {
      addFavourite(book)
    }
  }

  return (
    <article className="book-card">
      <div className="book-card__cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            className="book-card__img"
            loading="lazy"
          />
        ) : (
          <div className="book-card__no-cover" aria-label="No cover available">
            📖
          </div>
        )}
      </div>

      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">✍️ {author}</p>
        {year && <p className="book-card__year">📅 {year}</p>}

        <div className="book-card__actions">
          {/* Link to the Book Details page */}
          {workId && (
            <Link to={`/books/${workId}`} className="book-card__btn book-card__btn--details">
              Details
            </Link>
          )}

          {/* Add / Remove favourite toggle */}
          <button
            type="button"
            className={`book-card__btn ${saved ? 'book-card__btn--saved' : 'book-card__btn--fav'}`}
            onClick={handleFavouriteClick}
            aria-label={saved ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
          >
            {saved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default BookCard
