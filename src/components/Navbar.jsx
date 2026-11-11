import { NavLink } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import './Navbar.css'

/**
 * Navbar — top navigation bar shown on every page.
 *
 * Uses NavLink (from React Router) instead of plain <a> tags so the active
 * route automatically gets an "active" CSS class.
 *
 * Reads the favourites count live from FavouritesContext — no props needed.
 */
function Navbar() {
  const { favourites } = useFavourites()

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand">
        📚 Book Finder
      </NavLink>

      <ul className="navbar__links">
        <li>
          <NavLink
            to="/"
            end                    /* "end" means only match exactly "/" */
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            ❤️ Favourites
            {favourites.length > 0 && (
              <span className="navbar__badge">{favourites.length}</span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
