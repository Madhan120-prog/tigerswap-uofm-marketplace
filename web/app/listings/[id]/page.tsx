'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { type Listing, formatTimeAgo } from '@/lib/supabase/types';

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

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null | undefined>(undefined); // undefined = loading
  const [images, setImages] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase
      .from('listings')
      .select(`
        *,
        seller:profiles(id, name, items_listed, items_given, created_at),
        images:listing_images(id, listing_id, image_url, display_order)
      `)
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setListing(null);
          return;
        }

        const sortedImages: string[] = data.images
          ? data.images
              .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
              .map((img: { image_url: string }) => img.image_url)
          : [];

        setImages(sortedImages);
        setListing({ ...data, cover_image: sortedImages[0] ?? null });
      });
  }, [id]);

  // --- Loading state ---
  if (listing === undefined) {
    return (
      <main className="page-container">
        <div className="detail-skeleton-layout">
          <div className="detail-skeleton-img" />
          <div className="detail-skeleton-info">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
          </div>
        </div>
        <style jsx>{`
          .detail-skeleton-layout {
            display: grid;
            gap: 28px;
          }
          @media (min-width: 768px) {
            .detail-skeleton-layout { grid-template-columns: 1fr 1fr; gap: 40px; }
          }
          .detail-skeleton-img {
            height: 320px;
            border-radius: var(--radius-xl);
            background: var(--background-card);
            border: 1px solid var(--border);
            animation: pulse 1.5s ease-in-out infinite;
          }
          .detail-skeleton-info { display: flex; flex-direction: column; gap: 16px; padding-top: 12px; }
          .skeleton-line {
            height: 16px;
            border-radius: 8px;
            background: var(--background-card);
            border: 1px solid var(--border);
            animation: pulse 1.5s ease-in-out infinite;
          }
          .skeleton-line.short { width: 40%; }
          .skeleton-line.medium { width: 65%; }
          .skeleton-line.long { width: 100%; height: 24px; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
      </main>
    );
  }

  // --- Not found ---
  if (listing === null) {
    return (
      <main className="page-container">
        <div className="detail-not-found animate-fade-in">
          <span style={{ fontSize: 48 }}>😿</span>
          <h2>Listing not found</h2>
          <p>This item may have been removed or the link is invalid.</p>
          <Link href="/feed" className="btn btn-primary">
            Back to Feed
          </Link>
        </div>
        <style jsx>{`
          .detail-not-found {
            text-align: center;
            padding: 80px 20px;
          }
          .detail-not-found h2 {
            font-size: 22px;
            margin: 12px 0 8px;
          }
          .detail-not-found p {
            color: var(--foreground-muted);
            font-size: 14px;
            margin: 0 0 24px;
          }
        `}</style>
      </main>
    );
  }

  const typeLabel =
    listing.type === 'free'
      ? 'FREE'
      : listing.type === 'trade'
        ? 'TRADE'
        : `$${listing.price}`;
  const badgeClass =
    listing.type === 'free'
      ? 'badge-free'
      : listing.type === 'trade'
        ? 'badge-trade'
        : 'badge-sell';

  const sellerName = listing.seller?.name || 'Unknown Seller';

  return (
    <main className="page-container">
      {/* Back button */}
      <Link href="/feed" className="detail-back animate-fade-in">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Feed
      </Link>

      <div className="detail-layout animate-slide-up">
        {/* Image area */}
        <div className="detail-image-section">
          <div className="detail-image glass-card">
            {images.length > 0 ? (
              <img
                src={images[activeImg]}
                alt={listing.title}
                className="detail-image-photo"
              />
            ) : (
              <span className="detail-image-emoji">
                {CATEGORY_EMOJI[listing.category] || '📦'}
              </span>
            )}
            <span className={`badge ${badgeClass} detail-badge`}>{typeLabel}</span>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((url, i) => (
                <button
                  key={i}
                  className={`detail-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={url} alt={`Photo ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-top">
            <span className={`badge ${badgeClass}`}>{typeLabel}</span>
            <span className="detail-category">{listing.category}</span>
          </div>

          <h1 className="detail-title">{listing.title}</h1>

          <div className="detail-meta">
            <span className="detail-condition">{listing.condition} condition</span>
            <span className="detail-dot">·</span>
            <span className="detail-time">Posted {formatTimeAgo(listing.created_at)}</span>
          </div>

          <p className="detail-description">{listing.description}</p>

          {/* Seller card */}
          <div className="detail-seller glass-card">
            <div className="detail-seller-top">
              <div className="detail-seller-avatar">{sellerName.charAt(0)}</div>
              <div className="detail-seller-info">
                <span className="detail-seller-name">{sellerName}</span>
                <span className="detail-seller-label">UofM Student</span>
              </div>
            </div>
            <div className="detail-seller-stats">
              <div className="detail-stat">
                <span className="detail-stat-num">{listing.seller?.items_listed ?? 0}</span>
                <span className="detail-stat-label">Listed</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-num">{listing.seller?.items_given ?? 0}</span>
                <span className="detail-stat-label">Given Away</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="detail-actions">
            <button className="btn btn-primary detail-claim-btn">
              {listing.type === 'free'
                ? '🎁 Claim This Item'
                : listing.type === 'trade'
                  ? '🔄 Propose Trade'
                  : '💰 Buy This Item'}
            </button>
            <button className="btn btn-secondary">💬 Message Seller</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--foreground-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .detail-back:hover {
          color: var(--foreground);
        }
        .detail-layout {
          display: grid;
          gap: 28px;
        }
        @media (min-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        .detail-image-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .detail-image-section {
            position: sticky;
            top: calc(var(--navbar-height) + 20px);
            align-self: start;
          }
        }
        .detail-image {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--background-elevated), var(--background-secondary));
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .detail-image {
            height: 360px;
          }
        }
        .detail-image-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }
        .detail-image-emoji {
          font-size: 80px;
          opacity: 0.8;
        }
        .detail-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 14px;
          padding: 6px 14px;
        }
        .detail-thumbnails {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .detail-thumb {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: none;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .detail-thumb.active {
          border-color: var(--primary);
        }
        .detail-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-info {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .detail-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .detail-category {
          font-size: 13px;
          color: var(--foreground-muted);
        }
        .detail-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 10px 0;
          line-height: 1.3;
        }
        .detail-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--foreground-secondary);
          margin-bottom: 16px;
        }
        .detail-dot {
          opacity: 0.4;
        }
        .detail-description {
          font-size: 15px;
          line-height: 1.7;
          color: var(--foreground-secondary);
          margin: 0 0 24px 0;
        }
        .detail-seller {
          padding: 20px;
          margin-bottom: 24px;
        }
        .detail-seller:hover {
          transform: none;
        }
        .detail-seller-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .detail-seller-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
        }
        .detail-seller-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-seller-name {
          font-size: 15px;
          font-weight: 600;
        }
        .detail-seller-label {
          font-size: 12px;
          color: var(--foreground-muted);
        }
        .detail-seller-stats {
          display: flex;
          gap: 24px;
        }
        .detail-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .detail-stat-num {
          font-size: 18px;
          font-weight: 700;
        }
        .detail-stat-label {
          font-size: 11px;
          color: var(--foreground-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .detail-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .detail-claim-btn {
          font-size: 16px;
          padding: 16px;
        }
      `}</style>
    </main>
  );
}
