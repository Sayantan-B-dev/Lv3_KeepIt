import { useEffect, useRef, useState } from 'react';

const useDebouncedSearch = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedSearch;
