'use client';

import { useState } from 'react';
import { CATEGORIES, type Category, type ListingType, type Condition } from '@/lib/mock-data';

const CONDITIONS: Condition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<Condition | ''>('');
  const [listingType, setListingType] = useState<ListingType>('sell');
  const [price, setPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock submission — just show success state
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <main className="page-container">
      <div className="post-header animate-fade-in">
        <h1 className="post-title">Post a Listing</h1>
        <p className="post-subtitle">Share an item with fellow Tigers 🐯</p>
      </div>

      {submitted && (
        <div className="post-success animate-slide-up">
          ✅ Listing posted successfully! (This is a demo — no data was saved.)
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-form animate-slide-up">
        {/* Listing Type Toggle */}
        <div className="post-section">
          <label className="label">Listing Type</label>
          <div className="post-type-toggle">
            {(['free', 'sell', 'trade'] as ListingType[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`post-type-btn ${listingType === t ? 'active' : ''} ${
                  t === 'free' ? 'type-free' : t === 'trade' ? 'type-trade' : 'type-sell'
                }`}
                onClick={() => setListingType(t)}
              >
                {t === 'free' ? '🎁 Free' : t === 'sell' ? '💰 Sell' : '🔄 Trade'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="post-section">
          <label htmlFor="post-title" className="label">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            className="input"
            placeholder="e.g., TI-84 Plus Graphing Calculator"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div className="post-section">
          <label htmlFor="post-desc" className="label">
            Description
          </label>
          <textarea
            id="post-desc"
            className="textarea"
            placeholder="Describe the item — condition, what's included, pickup details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={1000}
          />
        </div>

        {/* Category + Condition row */}
        <div className="post-row">
          <div className="post-section post-half">
            <label htmlFor="post-category" className="label">
              Category
            </label>
            <select
              id="post-category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="post-section post-half">
            <label htmlFor="post-condition" className="label">
              Condition
            </label>
            <select
              id="post-condition"
              className="select"
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              required
            >
              <option value="" disabled>
                Select condition
              </option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price (only for sell) */}
        {listingType === 'sell' && (
          <div className="post-section animate-fade-in">
            <label htmlFor="post-price" className="label">
              Price ($)
            </label>
            <input
              id="post-price"
              type="number"
              className="input"
              placeholder="0.00"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        )}

        {/* Photo upload placeholder */}
        <div className="post-section">
          <label className="label">Photos</label>
          <div className="post-photo-area">
            <div className="post-photo-placeholder">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Add photos (coming soon)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary post-submit">
          🚀 Post Listing
        </button>
      </form>

      <style jsx>{`
        .post-header {
          margin-bottom: 24px;
        }
        .post-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 4px 0;
        }
        .post-subtitle {
          font-size: 14px;
          color: var(--foreground-secondary);
          margin: 0;
        }
        .post-success {
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: rgba(0, 196, 140, 0.1);
          border: 1px solid rgba(0, 196, 140, 0.2);
          color: var(--success);
          font-size: 14px;
          margin-bottom: 20px;
        }
        .post-form {
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .post-section {
          display: flex;
          flex-direction: column;
        }
        .post-row {
          display: flex;
          gap: 16px;
        }
        .post-half {
          flex: 1;
        }
        .post-type-toggle {
          display: flex;
          gap: 8px;
        }
        .post-type-btn {
          flex: 1;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--background-secondary);
          color: var(--foreground-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .post-type-btn:hover {
          border-color: var(--border-active);
        }
        .post-type-btn.active.type-free {
          background: rgba(0, 230, 138, 0.1);
          border-color: var(--free-green);
          color: var(--free-green);
        }
        .post-type-btn.active.type-sell {
          background: rgba(0, 48, 135, 0.15);
          border-color: var(--primary);
          color: #6B9FFF;
        }
        .post-type-btn.active.type-trade {
          background: rgba(255, 176, 32, 0.1);
          border-color: var(--warning);
          color: var(--warning);
        }
        .post-photo-area {
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }
        .post-photo-area:hover {
          border-color: var(--border-active);
        }
        .post-photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--foreground-muted);
          font-size: 13px;
        }
        .post-submit {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          margin-top: 8px;
        }
      `}</style>
    </main>
  );
}
