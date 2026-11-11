/**
 * buildSearchUrl — constructs the Open Library search URL.
 *
 * Returns null for empty queries so useFetch knows to skip the request.
 *
 * @param {string} query - The user's search term.
 * @param {number} limit - Max results to return (default 20).
 * @returns {string | null}
 */
export function buildSearchUrl(query, limit = 20) {
  const trimmed = query.trim()
  if (!trimmed) return null
  return `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=${limit}`
}

/**
 * getCoverUrl — builds an Open Library cover image URL.
 *
 * @param {number | undefined} coverId - The cover_i value from the API.
 * @param {'S'|'M'|'L'} size - Cover size suffix (default 'M').
 * @returns {string | null}
 */
export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

/**
 * normaliseBook — maps a raw Open Library doc to a consistent shape.
 *
 * @param {object} doc - A single item from the API `docs` array.
 * @returns {object}
 */
export function normaliseBook(doc) {
  return {
    key: doc.key || '',
    title: doc.title || 'Untitled',
    author: doc.author_name ? doc.author_name[0] : 'Unknown author',
    year: doc.first_publish_year || null,
    coverUrl: getCoverUrl(doc.cover_i),
    coverId: doc.cover_i || null,
  }
}

/**
 * extractWorkId — strips the work ID from an Open Library key string.
 *
 * Search results return keys like "/works/OL123W".
 * The details API endpoint needs just "OL123W".
 *
 * @param {string} key - e.g. "/works/OL123W"
 * @returns {string} e.g. "OL123W"
 */
export function extractWorkId(key) {
  // key is typically "/works/OL…W" — take the last segment
  if (!key) return ''
  const parts = key.split('/')
  return parts[parts.length - 1]
}

/**
 * buildWorksUrl — constructs the Works API URL for the detail page.
 *
 * @param {string} workId - e.g. "OL123W"
 * @returns {string}
 */
export function buildWorksUrl(workId) {
  if (!workId) return null
  return `https://openlibrary.org/works/${workId}.json`
}
