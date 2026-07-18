'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { INDIAN_CITIES } from '@/data/indian-districts';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: string;
};

export default function CityPicker({
  value,
  onChange,
  placeholder = 'Search city or district...',
  required = false,
  className = '',
  id,
  name,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => INDIAN_CITIES.find((c) => c.name === value),
    [value]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return INDIAN_CITIES.slice(0, 100);
    const q = search.toLowerCase();
    return INDIAN_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    ).slice(0, 100);
  }, [search]);

  useEffect(() => {
    setHighlightedIdx(-1);
  }, [filtered.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setOpen(true);
    if (!val) {
      onChange('');
    }
  };

  const handleFocus = () => {
    setSearch(value || '');
    setOpen(true);
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setSearch(city);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIdx >= 0 && highlightedIdx < filtered.length) {
          handleSelect(filtered[highlightedIdx].name);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIdx >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIdx] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIdx]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={open ? search : (selected ? `${selected.name}, ${selected.state}` : value)}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={className || `w-full rounded-[8px] border bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--ink)] outline-none transition focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--focus)] ${
          error ? 'border-red-500' : 'border-[color:var(--border)]'
        }`}
      />

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[color:var(--muted)]">
              No cities found
            </div>
          ) : (
            filtered.map((city, idx) => (
              <button
                key={city.name + city.state}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(city.name);
                }}
                onMouseEnter={() => setHighlightedIdx(idx)}
                className={`w-full px-4 py-2.5 text-left transition ${
                  highlightedIdx === idx
                    ? 'bg-[color:var(--primary)]/10'
                    : 'hover:bg-[color:var(--surface-2)]'
                } ${value === city.name ? 'font-semibold text-[color:var(--primary)]' : 'text-[color:var(--ink)]'}`}
              >
                <div className="text-sm">{city.name}</div>
                <div className="text-[11px] text-[color:var(--muted)]">
                  {city.state} &middot; {city.zone}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>}
    </div>
  );
}
