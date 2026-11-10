import { useEffect, useState } from "react";

export function useSessionState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);

      if (saved !== null) {
        return JSON.parse(saved);
      }

      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    } catch {
      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    }
  });

  useEffect(() => {
    try {
      if (value === undefined) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // The game can still run if browser storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}
