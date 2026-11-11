import { createContext, useContext, useState } from 'react'

/**
 * FavouritesContext — shares favourite books across the entire app.
 *
 * How Context works:
 *  1. createContext() creates an object with a Provider component and a
 *     default value. The Provider wraps our app so every child can read the
 *     context without prop drilling.
 *  2. useContext(FavouritesContext) subscribes a component to the context.
 *     Whenever the value changes every subscribed component re-renders.
 *  3. We export a custom hook (useFavourites) so consumers never import the
 *     raw context object — a common, cleaner pattern.
 */

// Create the context with a safe empty default
const FavouritesContext = createContext({
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
  isFavourite: () => false,
})

/**
 * FavouritesProvider — wraps the app and owns the favourites state.
 * Place this around <App /> (or around <Routes>) so all routes can read it.
 */
function FavouritesProvider({ children }) {
  // favourites is an array of normalised book objects: { key, title, author, year, coverUrl }
  const [favourites, setFavourites] = useState([])

  /**
   * addFavourite — adds a book if it isn't already saved.
   * Duplicate prevention: we check whether a book with the same key exists.
   */
  function addFavourite(book) {
    setFavourites((prev) => {
      const alreadySaved = prev.some((b) => b.key === book.key)
      if (alreadySaved) return prev          // return unchanged array
      return [...prev, book]                 // append the new book
    })
  }

  /**
   * removeFavourite — removes a book by its key.
   */
  function removeFavourite(bookKey) {
    setFavourites((prev) => prev.filter((b) => b.key !== bookKey))
  }

  /**
   * isFavourite — returns true if a book is already in the list.
   * Used by BookCard to show the correct button label.
   */
  function isFavourite(bookKey) {
    return favourites.some((b) => b.key === bookKey)
  }

  // The value object is what every consumer receives via useFavourites()
  const value = { favourites, addFavourite, removeFavourite, isFavourite }

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  )
}

/**
 * useFavourites — custom hook that gives any component access to favourites.
 *
 * Usage:
 *   const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites()
 */
function useFavourites() {
  return useContext(FavouritesContext)
}

export { FavouritesProvider, useFavourites }
