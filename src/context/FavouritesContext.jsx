import { createContext, useContext, useState, useCallback } from 'react'

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
 *
 * useCallback on handlers:
 *   addFavourite and removeFavourite are wrapped with useCallback so they get
 *   a stable reference across renders. Without this, every Provider re-render
 *   would produce new function references, defeating React.memo on consumers.
 */

const FavouritesContext = createContext({
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
  isFavourite: () => false,
})

function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([])

  /**
   * addFavourite — adds a book if it isn't already saved.
   * useCallback with [] deps: the function reference is created once and
   * never changes. The functional updater form of setFavourites means we
   * don't need `favourites` in the dependency array.
   */
  const addFavourite = useCallback((book) => {
    setFavourites((prev) => {
      const alreadySaved = prev.some((b) => b.key === book.key)
      if (alreadySaved) return prev
      return [...prev, book]
    })
  }, [])

  /**
   * removeFavourite — removes a book by its key.
   * Same reasoning: functional updater, stable [] deps.
   */
  const removeFavourite = useCallback((bookKey) => {
    setFavourites((prev) => prev.filter((b) => b.key !== bookKey))
  }, [])

  /**
   * isFavourite — returns true if a book is already saved.
   * This cannot use [] deps because it reads `favourites` synchronously.
   * It is intentionally NOT memoised with useCallback because:
   *   - It is not passed as a prop to memoised children directly
   *   - HomePage calls it inline to derive `isSaved` before passing to BookCard
   */
  function isFavourite(bookKey) {
    return favourites.some((b) => b.key === bookKey)
  }

  const value = { favourites, addFavourite, removeFavourite, isFavourite }

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  )
}

function useFavourites() {
  return useContext(FavouritesContext)
}

export { FavouritesProvider, useFavourites }
