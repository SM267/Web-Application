import { useEffect, useState } from "react";

export function usePersistent(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable in restricted environments.
    }
  }, [key, value]);

  return [value, setValue];
}