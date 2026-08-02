'use client';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={12 + Math.cos(rad) * 6.2}
                y1={12 + Math.sin(rad) * 6.2}
                x2={12 + Math.cos(rad) * 8.6}
                y2={12 + Math.sin(rad) * 8.6}
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15.2 4.4A8.5 8.5 0 1 0 19.6 15 7 7 0 0 1 15.2 4.4Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
