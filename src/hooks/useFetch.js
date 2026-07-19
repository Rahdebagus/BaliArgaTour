import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Generic async data hook for the service layer.
 * Handles loading/error/data and ignores stale responses on unmount or
 * dependency change (docs/12_FUTURE_BACKEND.md — services return Promises).
 *
 * `options.initialData` seeds state synchronously so content is present on the
 * very first render — this is what lets prerendering (SSG) capture data-driven
 * markup and dynamic meta tags in the static HTML. With a real backend the sync
 * accessors return null, so it transparently falls back to the async fetch.
 *
 * Stale-while-revalidate: `loading` is true ONLY while there is no data yet.
 * When data already exists (initialData or a previous fetch), refreshes run in
 * the background and swap the content in place — existing markup is never
 * replaced by skeletons, which would flash and cause layout shift (CLS).
 *
 * @param {() => Promise<any>} fetcher function returning a Promise
 * @param {Array} deps dependency array that re-triggers the fetch
 * @param {{ initialData?: any }} [options]
 */
export function useFetch(fetcher, deps = [], { initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialData == null);
  const [error, setError] = useState(null);

  // Mirror `data` in a ref so `run` can check it without re-creating itself
  // (which would re-trigger the effect) every time data changes.
  const hasDataRef = useRef(initialData != null);
  hasDataRef.current = data != null;

  const run = useCallback(() => {
    let active = true;
    setError(null);
    // Only surface a loading state when there is nothing to show yet.
    if (!hasDataRef.current) setLoading(true);

    Promise.resolve()
      .then(fetcher)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { data, loading, error, refetch: run };
}
