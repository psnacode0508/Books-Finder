import { memo } from 'react'
import { Link } from 'react-router-dom'
import { extractWorkId } from '../utils/bookUtils'
import './BookCard.css'

/**
 * BookCard — displays a single book result.
 *
 * Props:
 *  - book            : { key, title, author, year, coverUrl }
 *  - isSaved         : boolean — whether this book is in favourites
 *  - onToggleFavourite : stable callback (useCallback) from the parent
 *
 * Why props instead of reading context directly?
 *   React.memo prevents a re-render only when ALL props are the same reference.
 *   If BookCard called useFavourites() itself, every change to the favourites
 *   array would re-subscribe and re-render EVERY card — even ones whose
 *   favourite status didn't change.
 *
 *   By lifting context reads to the parent (HomePage) and passing only
 *   `isSaved` (a boolean) + `onToggleFavourite` (a stable useCallback),
 *   React.memo can correctly skip re-rendering cards that haven't changed.
 *
 * Why React.memo?
 *   memo() wraps the component in a higher-order component that does a
 *   shallow comparison of props before each render. If none of the props
 *   changed by reference, React reuses the previous render output entirely.
 */
const BookCard = memo(function BookCard({ book, isSaved, onToggleFavourite }) {
  const { title, author, year, coverUrl, key } = book
  const workId = extractWorkId(key)

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
          {workId && (
            <Link to={`/books/${workId}`} className="book-card__btn book-card__btn--details">
              Details
            </Link>
          )}

          <button
            type="button"
            className={`book-card__btn ${isSaved ? 'book-card__btn--saved' : 'book-card__btn--fav'}`}
            onClick={onToggleFavourite}
            aria-label={isSaved ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
          >
            {isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
      </div>
    </article>
  )
})

export default BookCard
