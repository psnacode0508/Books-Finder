import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavouritesProvider } from './context/FavouritesContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import BookDetailPage from './pages/BookDetailPage'
import FavouritesPage from './pages/FavouritesPage'
import NotFoundPage from './pages/NotFoundPage'
import './index.css'

/**
 * App — root component.
 *
 * FavouritesProvider wraps everything inside BrowserRouter so both the Navbar
 * and every page can read/write the favourites list via useFavourites().
 *
 * Routes:
 *   /                 → HomePage      (search)
 *   /books/:id        → BookDetailPage (details for one work)
 *   /favourites       → FavouritesPage
 *   *                 → NotFoundPage  (404 catch-all)
 */
function App() {
  return (
    <BrowserRouter>
      <FavouritesProvider>
        <div className="app">
          {/* Navbar is outside <Routes> so it shows on every page */}
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </FavouritesProvider>
    </BrowserRouter>
  )
}

export default App
