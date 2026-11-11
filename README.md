# 📚 Book Finder

A beginner-friendly React project that lets users search for books, view details,
and save favourites using the Open Library public API.

---

## Features

- 🔍 **Search** — debounced search (500ms) with loading, error, and empty states
- 📖 **Book Cards** — cover image, title, author, publication year with graceful fallbacks
- 📄 **Book Details** — full detail page with description, subjects, and larger cover
- ❤️ **Favourites** — save and remove books; count shown live in the Navbar
- 🗂️ **Filter & Sort** — publication year range filter, newest-first / oldest-first sort
- 🧭 **Routing** — `/`, `/books/:id`, `/favourites`, and a 404 catch-all
- ⚡ **Performance** — `React.memo`, `useCallback`, `useMemo` to minimise unnecessary renders

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Plain CSS | — | Styling (no frameworks) |
| JavaScript ES6+ | — | Language |

---

## Project Structure

```
BookFinder/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BookCard.jsx      # Memoised book card (React.memo)
│   │   ├── BookCard.css
│   │   ├── Navbar.jsx        # Nav links + live favourites badge
│   │   ├── Navbar.css
│   │   ├── SearchBar.jsx     # Controlled search input with clear button
│   │   └── SearchBar.css
│   ├── context/
│   │   └── FavouritesContext.jsx  # Context + Provider + useFavourites hook
│   ├── hooks/
│   │   ├── useFetch.js       # Generic fetch hook with AbortController
│   │   └── useDebounce.js    # Delays a value by N ms
│   ├── pages/
│   │   ├── HomePage.jsx      # Search + filter + sort
│   │   ├── HomePage.css
│   │   ├── BookDetailPage.jsx # Works API detail view
│   │   ├── BookDetailPage.css
│   │   ├── FavouritesPage.jsx # Saved books list
│   │   ├── FavouritesPage.css
│   │   ├── NotFoundPage.jsx   # 404 catch-all
│   │   └── NotFoundPage.css
│   ├── utils/
│   │   └── bookUtils.js      # URL builders, normaliser, ID extractor
│   ├── App.jsx               # Router + FavouritesProvider + Navbar + Routes
│   ├── main.jsx              # React DOM entry point
│   └── index.css             # Global styles + shared status-box / spinner
├── index.html
├── vite.config.js
└── package.json
```

---

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET https://openlibrary.org/search.json?q={query}&limit=20` | Search results |
| `GET https://openlibrary.org/works/{id}.json` | Single book details |
| `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg` | Cover image (medium) |
| `https://covers.openlibrary.org/b/id/{cover_i}-L.jpg` | Cover image (large) |

No API key required.

---

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → http://localhost:5173

# 3. Production build
npm run build

# 4. Preview production build
npm run preview
```

---

## Hooks Used

| Hook | File | Purpose |
|---|---|---|
| `useState` | Throughout | Local component state |
| `useEffect` | `useFetch`, `useDebounce`, `HomePage` | Side-effects: fetch, timer, focus |
| `useRef` | `HomePage` | Auto-focus input; render counter |
| `useMemo` | `HomePage` | Derive filtered + sorted book list |
| `useCallback` | `HomePage`, `FavouritesContext` | Stable function references for memo |
| `useContext` | `useFavourites`, `Navbar` | Read shared favourites state |
| `useParams` | `BookDetailPage` | Read `:id` from URL |

---

## Context API — How It Works

React's **Context API** lets you share state across the component tree without
passing props through every intermediate level (prop drilling).

### Three pieces

1. `createContext()` — creates the context object with a default value.
2. `<FavouritesProvider>` — owns the state; wraps the whole app inside
   `<BrowserRouter>` so every route has access.
3. `useFavourites()` — a custom hook that calls `useContext(FavouritesContext)`.
   Any component that calls it will re-render when the context value changes.

### When to choose Zustand or Redux instead

| Situation | Recommendation |
|---|---|
| Small app, 1–2 shared states | ✅ Context API is enough |
| State updates are infrequent | ✅ Context API is enough |
| Many components subscribe and cause slow re-renders | **Zustand** (no Provider, fine-grained subscriptions) |
| Need persistence to `localStorage` easily | **Zustand** (`persist` middleware, one line) |
| Complex state machine with many actions | **Redux Toolkit** (`createSlice`, `createAsyncThunk`) |
| Need DevTools / time-travel debugging | **Redux Toolkit** |
| Large team needing strict, predictable update patterns | **Redux Toolkit** |

---

## Two Situations Where useMemo Is Pointless

1. **Cheap computations** — `useMemo(() => a + b, [a, b])` costs *more* than
   just computing `a + b` inline, because React still has to run the wrapper,
   store the previous result, and compare deps on every render.

2. **Values that change every render anyway** — if the dependency (e.g. an
   object created inside the component) is recreated on every render, the memo
   cache is invalidated every time and you get zero benefit with extra overhead.

---

## Routes

| Path | Page |
|---|---|
| `/` | Search & results |
| `/books/:id` | Book details |
| `/favourites` | Saved books |
| `*` | 404 Not Found |
