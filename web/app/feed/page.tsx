'use client';

import { useState } from 'react';
import { MOCK_LISTINGS, CATEGORIES, type Category } from '@/lib/mock-data';
import ListingCard from '@/app/components/ListingCard';
import CategoryFilter from '@/app/components/CategoryFilter';

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [freeFirst, setFreeFirst] = useState(false);

  // Filter listings
  let filtered = MOCK_LISTINGS;

  if (selectedCategory !== 'All') {
    filtered = filtered.filter((l) => l.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    );
  }

  // Sort: free first if toggled
  if (freeFirst) {
    filtered = [...filtered].sort((a, b) => {
      if (a.type === 'free' && b.type !== 'free') return -1;
      if (a.type !== 'free' && b.type === 'free') return 1;
      return 0;
    });
  }

  return (
    <main className="page-container">
      {/* Page Header */}
      <div className="feed-header animate-fade-in">
        <h1 className="feed-title">Marketplace</h1>
        <p className="feed-subtitle">
          {MOCK_LISTINGS.length} items from UofM Tigers 🐯
        </p>
      </div>

      {/* Search Bar */}
      <div className="feed-search animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="feed-search-wrapper">
          <svg
            className="feed-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input feed-search-input"
          />
        </div>
      </div>

      {/* Category Filter + Free Toggle */}
      <div className="feed-filters animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        <button
          className={`feed-free-toggle ${freeFirst ? 'active' : ''}`}
          onClick={() => setFreeFirst(!freeFirst)}
        >
          🆓 Free First
        </button>
      </div>

      {/* Results count */}
      {selectedCategory !== 'All' || searchQuery.trim() ? (
        <p className="feed-results-count">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {searchQuery.trim() ? ` for "${searchQuery}"` : ''}
        </p>
      ) : null}

      {/* Listing Grid */}
      {filtered.length > 0 ? (
        <div className="feed-grid">
          {filtered.map((listing, i) => (
            <div
              key={listing.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <div className="feed-empty animate-fade-in">
          <span className="feed-empty-emoji">🔍</span>
          <h3>No listings found</h3>
          <p>Try a different category or search term.</p>
        </div>
      )}

      <style jsx>{`
        .feed-header {
          margin-bottom: 20px;
        }
        .feed-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 4px 0;
        }
        .feed-subtitle {
          font-size: 14px;
          color: var(--foreground-secondary);
          margin: 0;
        }
        .feed-search {
          margin-bottom: 16px;
        }
        .feed-search-wrapper {
          position: relative;
        }
        .feed-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--foreground-muted);
          pointer-events: none;
        }
        .feed-search-input {
          padding-left: 42px;
        }
        .feed-filters {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .feed-free-toggle {
          flex-shrink: 0;
          padding: 8px 14px;
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
        .feed-free-toggle:hover {
          border-color: var(--free-green);
          color: var(--free-green);
        }
        .feed-free-toggle.active {
          background: rgba(0, 230, 138, 0.12);
          border-color: var(--free-green);
          color: var(--free-green);
        }
        .feed-results-count {
          font-size: 13px;
          color: var(--foreground-muted);
          margin: 0 0 16px 0;
        }
        .feed-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .feed-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .feed-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .feed-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--foreground-muted);
        }
        .feed-empty-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }
        .feed-empty h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--foreground-secondary);
          margin: 0 0 8px 0;
        }
        .feed-empty p {
          font-size: 14px;
          margin: 0;
        }
      `}</style>
    </main>
  );
}
