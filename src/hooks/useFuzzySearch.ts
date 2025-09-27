import Fuse from "fuse.js";
import { useMemo, useState, useEffect } from "react";
import { debounce } from "lodash";

interface SearchOptions {
  keys: string[];
  threshold?: number;
  debounceTime?: number;
  minSearchLength?: number;
}

export function useFuzzySearch<T>(
  data: T[],
  searchTerm: string,
  options: SearchOptions
): T[] {
  const {
    keys,
    threshold = 0.3,
    debounceTime = 300,
    minSearchLength = 2,
  } = options;

  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedTerm(searchTerm);
    }, debounceTime);

    handler();
    return () => handler.cancel();
  }, [searchTerm, debounceTime]);

  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys,
      threshold,
      includeScore: true,
      shouldSort: true,
    });
  }, [data, keys, threshold]);

  return useMemo(() => {
    const trimmedTerm = debouncedTerm.trim();

    if (!trimmedTerm || trimmedTerm.length < minSearchLength) {
      return data;
    }

    try {
      const results = fuse.search(trimmedTerm);
      return results.map(result => result.item);
    } catch (error) {
      console.error("Search error:", error);
      return data;
    }
  }, [fuse, debouncedTerm, data, minSearchLength]);
}
