# 📚 Book Finder

A beginner-friendly React project that lets users search for books using an open API.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router DOM | Client-side routing |
| Plain CSS | Styling |
| JavaScript (ES6+) | Language |

## Project Structure

```
BookFinder/
├── public/
├── src/
│   ├── components/    # Reusable UI components (Navbar, BookCard, SearchBar)
│   ├── pages/         # Route-level page components
│   ├── hooks/         # Custom React hooks (useFetch, useDebounce)
│   ├── context/       # React Context providers (FavouritesContext)
│   ├── utils/         # Helper / utility functions (bookUtils)
│   ├── App.jsx        # Root component with Router + Routes
│   ├── main.jsx       # React DOM entry point
│   └── index.css      # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Routes

| Path | Page |
|---|---|
| `/` | Search page |
| `/books/:id` | Book details |
| `/favourites` | Saved books |
| `*` | 404 Not Found |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

- Dev server runs at: http://localhost:5173

---

## Context API — How It Works & When to Upgrade

### What is Context API?

React's built-in **Context API** lets you share state across your component
tree without passing props through every intermediate component (a problem
called *prop drilling*).

In this project `FavouritesContext` holds the favourites list. Any component
anywhere in the tree — `Navbar`, `BookCard`, `FavouritesPage` — can read and
write it by calling `useFavourites()`.

**Three pieces:**
1. `createContext()` — creates the context object.
2. `<FavouritesProvider>` — owns the state and passes it via `value` prop.
3. `useContext(FavouritesContext)` (wrapped in `useFavourites`) — subscribes
   a component to updates.

### When to prefer Zustand or Redux?

| Situation | Recommendation |
|---|---|
| Small app, 1–2 shared states | ✅ Context API is enough |
| State updates are infrequent | ✅ Context API is enough |
| Many components subscribe to the same state and re-renders become slow | Consider **Zustand** |
| Complex state with many actions, need dev-tools / time-travel debugging | Consider **Redux Toolkit** |
| State needs to be shared across browser tabs or persisted to localStorage easily | **Zustand** (built-in middleware) |
| Team is large; need strict, predictable update patterns | **Redux Toolkit** |

**Zustand** is the most popular lightweight alternative today — minimal
boilerplate, no Provider needed, and easy to add middleware like `persist`.
**Redux Toolkit** is best for large-scale apps with complex state logic.

