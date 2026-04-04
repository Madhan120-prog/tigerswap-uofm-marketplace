'use client';

import { Category, CATEGORIES } from '@/lib/supabase/types';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const allCategories: string[] = ['All', ...CATEGORIES];

  return (
    <div className="category-filter">
      {allCategories.map((cat) => (
        <button
          key={cat}
          className={`category-pill ${selected === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}

      <style jsx>{`
        .category-filter {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-filter::-webkit-scrollbar {
          display: none;
        }
        .category-pill {
          flex-shrink: 0;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: var(--background-card);
          color: var(--foreground-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .category-pill:hover {
          border-color: var(--border-active);
          color: var(--foreground);
        }
        .category-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
