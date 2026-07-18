// Thin transport layer. Today it resolves dummy data with a simulated network
// delay; when a real backend arrives (docs/12_FUTURE_BACKEND.md) only this file
// changes — swap `simulate()` internals for fetch/axios and keep the same
// service signatures.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = !API_BASE; // no backend configured -> use dummy data

const DEFAULT_DELAY = 250; // ms, mimics latency so loaders/skeletons show

class ApiError extends Error {
  constructor(message, status = 404) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Resolve dummy data as if it came from an API.
 * @param {() => any} resolver returns the data (or throws for not-found)
 */
function mock(resolver, delay = DEFAULT_DELAY) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(resolver());
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}

/**
 * Real HTTP GET — used automatically once VITE_API_BASE_URL is set.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }
  return res.json();
}

export { mock, request, ApiError, USE_MOCK };
