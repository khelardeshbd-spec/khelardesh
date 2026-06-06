'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'paper' | 'night';
const STORAGE_KEY = 'field-theme';
const DEFAULT_THEME: Theme = 'paper';

/**
 * useTheme — Section 6 / 10.3
 * Reads from localStorage on mount, defaults to 'paper'.
 * Sets data-theme on <html> and persists to localStorage on change.
 */
export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  // On mount: read localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? DEFAULT_THEME;
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  return [theme, setTheme];
}
