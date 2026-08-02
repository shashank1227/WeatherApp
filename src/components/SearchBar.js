'use client';

import { useEffect, useRef, useState } from 'react';
import { searchLocations } from '@/lib/weather';

export default function SearchBar({ onSelect, onUseLocation, locating }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return undefined;
    }

    let active = true;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const places = await searchLocations(query);
        if (active) {
          setResults(places);
          setOpen(true);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function choose(place) {
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelect(place);
  }

  return (
    <div className="search" ref={wrapRef}>
      <div className="search__row">
        <label className="search__field">
          <span className="sr-only">Search city</span>
          <svg className="search__glyph" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.75"
              fill="none"
            />
            <path
              d="M16 16l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search city"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          className="search__locate"
          onClick={onUseLocation}
          disabled={locating}
          aria-label="Use current location"
          title="Use current location"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.75"
              fill="none"
            />
            <path
              d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.75"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {open && (results.length > 0 || searching) && (
        <ul className="search__results" role="listbox">
          {searching && results.length === 0 && (
            <li className="search__empty">Searching…</li>
          )}
          {results.map((place) => {
            const subtitle = [place.admin1, place.country]
              .filter(Boolean)
              .join(', ');
            return (
              <li key={place.id}>
                <button type="button" onClick={() => choose(place)}>
                  <span className="search__name">{place.name}</span>
                  {subtitle && <span className="search__meta">{subtitle}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
