# 📋 INTERVIEW.md — Book Finder Project Notes

This file tracks design decisions, component responsibilities, and common
interview talking points for the Book Finder project.

---

## Project Overview

**Goal:** Build a React app where users can search for books by title or author
using the Open Library API, view details, and save favourites.

---

## Features Built

- [x] Search bar with 500ms debounce
- [x] Book result grid with cover, title, author, year
- [x] Loading, error, empty and initial states
- [x] Book detail page (title, description, subjects, cover)
- [x] Favourites with Context API
- [x] Navbar with live favourites count
- [x] Newest / oldest sort
- [x] React.memo on BookCard
- [x] useCallback for stable handlers
- [x] useMemo for sorting

---

## Key React Concepts Covered

| Concept | Where Used |
|---|---|
| `useState` | Search input, sort order |
| `useEffect` | Auto-focus input on mount; data fetching in useFetch |
| `useRef` | Focus control, render counter |
| `useMemo` | Sorted book list |
| `useCallback` | Stable toggle handler passed to BookCard |
| `React.memo` | BookCard — skips re-render when props unchanged |
| `useContext` | FavouritesContext — shared favourites state |
| Custom hooks | `useFetch`, `useDebounce` |
| React Router | Routes, useParams, NavLink |

---

## Folder Responsibilities

| Folder | Contents |
|---|---|
| `components/` | BookCard, SearchBar, Navbar |
| `pages/` | HomePage, BookDetailPage, FavouritesPage, NotFoundPage |
| `hooks/` | useFetch, useDebounce |
| `context/` | FavouritesContext |
| `utils/` | bookUtils (URL builders, normaliser, ID extractor) |

---

## API

| Endpoint | Used For |
|---|---|
| `GET https://openlibrary.org/search.json?q={query}&limit=20` | Search results |
| `GET https://openlibrary.org/works/{id}.json` | Book detail |
| `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg` | Cover images |

No API key required.

---

## Interview Questions

### 1. What causes a component to re-render? How does React.memo change that?

A component re-renders when its **state changes**, its **parent re-renders**,
or the **context it subscribes to changes**. By default React re-renders a
child even if its props are identical. `React.memo` wraps the component in a
shallow prop comparison — if none of the props changed by reference, React
reuses the previous render output and skips the function call entirely.
Props must be kept stable (e.g. with `useCallback`) for `memo` to actually
help; passing a new inline function on every render defeats it.

---

### 2. What is the dependency array for, and what goes wrong if you leave out a dependency?

The dependency array in `useEffect`, `useMemo`, and `useCallback` tells React
**when to re-run** the hook. React compares each item by reference after every
render; if any value changed, the hook runs again. If you leave out a
dependency, the hook captures a **stale closure** — it keeps reading the old
value from when it last ran, not the current one. That causes bugs like a
`useEffect` that never re-fetches after a query changes, or a `useCallback`
that calls `removeFavourite` on the wrong item.

---

### 3. What are the Rules of Hooks, and why can't hooks be called inside an if statement?

The Rules of Hooks are: only call hooks **at the top level** of a function
component or another hook — never inside `if`, loops, or nested functions.
React tracks hooks by their **call order**. On every render it expects the
same hooks in the same sequence. If you hide a hook inside an `if`, it may
be skipped on some renders, shifting every hook below it out of position.
React would then read the wrong state for the wrong hook, causing silent data
corruption or crashes. The ESLint plugin `eslint-plugin-react-hooks` catches
these mistakes automatically.

---

## Common Interview Questions (Additional)

1. **What is the difference between `state` and `props`?**
2. **Why do we use `useEffect` for data fetching?**
3. **What problem does React Router solve?**
4. **What is a custom hook and why would you create one?**
5. **What is Context API and when should you use it over prop drilling?**
6. **What is the difference between controlled and uncontrolled components?**
