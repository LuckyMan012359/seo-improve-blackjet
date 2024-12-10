import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value.
 *
 * @param {any} value The value to debounce
 * @param {number} delay The amount of time to debounce in milliseconds
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup function to clear timer on unmount or dependency change
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
