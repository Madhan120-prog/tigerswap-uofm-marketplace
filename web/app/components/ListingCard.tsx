'use client';

import Link from 'next/link';
import { Listing, formatTimeAgo } from '@/lib/mock-data';

// Emoji placeholders per category (since we don't have real images yet)
const CATEGORY_EMOJI: Record<string, string> = {
  Textbooks: '📚',
  Electronics: '💻',
  Furniture: '🪑',
  Kitchen: '🍳',
  Clothing: '👕',
  'Dorm Essentials': '🏠',
  Sports: '⚽',
  Other: '📦',
};

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const typeLabel =
    listing.type === 'free' ? 'FREE' : listing.type === 'trade' ? 'TRADE' : `$${listing.price}`;
  const badgeClass =
    listing.type === 'free'
      ? 'badge-free'
      : listing.type === 'trade'
        ? 'badge-trade'
        : 'badge-sell';

  return (
    <Link href={`/listings/${listing.id}`} className="listing-card-link">
      <article className="listing-card glass-card">
        <div className="listing-card-image">
          <span className="listing-card-emoji">
            {CATEGORY_EMOJI[listing.category] || '📦'}
          </span>
          <span className={`badge ${badgeClass} listing-card-badge`}>{typeLabel}</span>
        </div>

        <div className="listing-card-body">
          <h3 className="listing-card-title">{listing.title}</h3>
          <div className="listing-card-meta">
            <span className="listing-card-condition">{listing.condition}</span>
            <span className="listing-card-dot">·</span>
            <span className="listing-card-time">{formatTimeAgo(listing.createdAt)}</span>
          </div>
          <div className="listing-card-seller">
            <span className="listing-card-avatar">
              {listing.seller.name.charAt(0)}
            </span>
            <span className="listing-card-seller-name">{listing.seller.name}</span>
          </div>
        </div>
      </article>

      <style jsx>{`
        .listing-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .listing-card {
          overflow: hidden;
          cursor: pointer;
          animation: fadeIn 0.4s ease forwards;
        }
        .listing-card-image {
          position: relative;
          height: 160px;
          background: linear-gradient(135deg, var(--background-elevated), var(--background-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border);
        }
        .listing-card-emoji {
          font-size: 48px;
          opacity: 0.8;
        }
        .listing-card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .listing-card-body {
          padding: 14px;
        }
        .listing-card-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .listing-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--foreground-secondary);
          margin-bottom: 10px;
        }
        .listing-card-dot {
          opacity: 0.4;
        }
        .listing-card-seller {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .listing-card-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .listing-card-seller-name {
          font-size: 12px;
          color: var(--foreground-secondary);
        }
      `}</style>
    </Link>
  );
}
