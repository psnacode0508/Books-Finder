import { Link } from 'react-router-dom'
import './NotFoundPage.css'

/**
 * NotFoundPage — rendered for any URL that doesn't match a defined route.
 *
 * Route: *  (catch-all in React Router)
 */
function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h2 className="not-found__title">Page Not Found</h2>
      <p className="not-found__message">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="not-found__link">← Back to Home</Link>
    </div>
  )
}

export default NotFoundPage
