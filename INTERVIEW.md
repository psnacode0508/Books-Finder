# 📋 INTERVIEW.md — Book Finder Project Notes

This file tracks design decisions, component responsibilities, and common
interview talking points for the Book Finder project.

---

## Project Overview

**Goal:** Build a React app where users can search for books by title or author
using a public API (e.g., Open Library API).

---

## Planned Features (to be built incrementally)

- [ ] Search bar to query books by title / author
- [ ] Display a list of search results with cover images
- [ ] Book detail page (click a result to see more info)
- [ ] Loading and error states
- [ ] Favourites / wishlist (using Context API)

---

## Key React Concepts Covered

| Concept | Where Used |
|---|---|
| `useState` | Search input, results list, loading flag |
| `useEffect` | Fetching data when query changes |
| `useContext` | Sharing favourites state app-wide |
| Custom hooks | `useBookSearch` — encapsulates fetch logic |
| React Router | Navigating between Search and Detail pages |
| Props | Passing book data into BookCard component |
| Conditional rendering | Loading spinner, empty state, error message |

---

## Folder Responsibilities

| Folder | Contents |
|---|---|
| `components/` | BookCard, SearchBar, Navbar, Spinner |
| `pages/` | HomePage, BookDetailPage |
| `hooks/` | useBookSearch (custom data-fetching hook) |
| `context/` | FavouritesContext |
| `utils/` | formatBookData, truncateText helpers |

---

## API

Using the [Open Library Search API](https://openlibrary.org/developers/api):

```
GET https://openlibrary.org/search.json?q=<query>&limit=10
```

No API key required.

---

## Common Interview Questions

1. **What is the difference between `state` and `props`?**
2. **Why do we use `useEffect` for data fetching?**
3. **What problem does React Router solve?**
4. **What is a custom hook and why would you create one?**
5. **What is Context API and when should you use it over prop drilling?**
6. **What is the difference between controlled and uncontrolled components?**
