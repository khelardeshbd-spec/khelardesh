'use client';

import { useTheme, type Theme } from '@/hooks/useTheme';

/**
 * ThemeToggle — Section 10.3 / 6
 * Three 14px circles: Light / Paper / Night
 * Active circle gets 1.5px --ink ring
 * Saves to localStorage('field-theme')
 */

const THEMES: { id: Theme; fill: string; border: string; label: string }[] = [
  { id: 'light', fill: '#FAFAF8', border: '#D4D2CB', label: 'Light theme' },
  { id: 'paper', fill: '#F8F1E3', border: '#C8BAA0', label: 'Paper theme' },
  { id: 'night', fill: '#141412', border: '#555555', label: 'Night theme' },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Reading theme"
    >
      {THEMES.map(({ id, fill, border, label }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            id={`theme-btn-${id}`}
            onClick={() => setTheme(id)}
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: fill,
              border: isActive
                ? `1.5px solid var(--ink)`
                : `1px solid ${border}`,
              padding: 0,
              cursor: 'pointer',
              transition: 'border 0.15s ease',
              boxShadow: isActive ? '0 0 0 1px var(--ink)' : 'none',
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}
