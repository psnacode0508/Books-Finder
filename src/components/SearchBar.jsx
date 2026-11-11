import './SearchBar.css'

/**
 * SearchBar — controlled search input.
 *
 * Props:
 *  - value       : current input value (string)
 *  - onChange    : handler called with the new string on every keystroke
 *  - inputRef    : ref forwarded to the <input> so the parent can focus it
 */
function SearchBar({ value, onChange, inputRef }) {
  function handleChange(e) {
    onChange(e.target.value)
  }

  return (
    <div className="search-bar">
      <label htmlFor="book-search" className="search-bar__label">
        Search for a book
      </label>
      <div className="search-bar__wrapper">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="book-search"
          type="search"
          className="search-bar__input"
          placeholder="Enter title, author, or keyword…"
          value={value}
          onChange={handleChange}
          ref={inputRef}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
