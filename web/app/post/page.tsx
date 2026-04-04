'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { CATEGORIES, type Category, type ListingType, type Condition } from '@/lib/supabase/types';

const CONDITIONS: Condition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

interface PhotoPreview {
  file: File;
  url: string;
}

export default function PostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<Condition | ''>('');
  const [listingType, setListingType] = useState<ListingType>('sell');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Photo selection helpers ──────────────────────────────────
  function addFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 5 - photos.length); // max 5 images total
    const previews: PhotoPreview[] = valid.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...prev, ...previews]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos.length]
  );

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createBrowserSupabaseClient();

    // 1. Make sure user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // 2. Insert the listing row
    const { data: listingRow, error: listingErr } = await supabase
      .from('listings')
      .insert({
        seller_id: user.id,
        title: title.trim(),
        description: description.trim(),
        type: listingType,
        price: listingType === 'sell' ? parseFloat(price) : null,
        category,
        condition,
      })
      .select()
      .single();

    if (listingErr || !listingRow) {
      setError(listingErr?.message || 'Failed to create listing. Please try again.');
      setSubmitting(false);
      return;
    }

    // 3. Upload photos to Supabase Storage
    const imageInserts: { listing_id: string; image_url: string; display_order: number }[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const ext = photo.file.name.split('.').pop();
      const path = `${user.id}/${listingRow.id}/${i}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('listing-images')
        .upload(path, photo.file, { upsert: true });

      if (uploadErr) continue; // skip failed uploads — don't block the listing

      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(path);

      imageInserts.push({
        listing_id: listingRow.id,
        image_url: urlData.publicUrl,
        display_order: i,
      });
    }

    // 4. Insert image rows
    if (imageInserts.length > 0) {
      await supabase.from('listing_images').insert(imageInserts);
    }

    // 5. Increment items_listed on profile
    await supabase.rpc('increment_items_listed', { user_id: user.id });

    setSubmitting(false);
    router.push('/feed');
  }

  return (
    <main className="page-container">
      <div className="post-header animate-fade-in">
        <h1 className="post-title">Post a Listing</h1>
        <p className="post-subtitle">Share an item with fellow Tigers 🐯</p>
      </div>

      {error && (
        <div className="post-error animate-slide-up">{error}</div>
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
          <label htmlFor="post-title" className="label">Title</label>
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
          <label htmlFor="post-desc" className="label">Description</label>
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
            <label htmlFor="post-category" className="label">Category</label>
            <select
              id="post-category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="post-section post-half">
            <label htmlFor="post-condition" className="label">Condition</label>
            <select
              id="post-condition"
              className="select"
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              required
            >
              <option value="" disabled>Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price (only for sell) */}
        {listingType === 'sell' && (
          <div className="post-section animate-fade-in">
            <label htmlFor="post-price" className="label">Price ($)</label>
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

        {/* Photo upload */}
        <div className="post-section">
          <label className="label">
            Photos
            <span className="post-photo-hint"> (up to 5 images)</span>
          </label>

          {/* Drop zone */}
          {photos.length < 5 && (
            <div
              className={`post-photo-area ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => addFiles(e.target.files)}
              />
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
                <span>
                  {dragOver ? 'Drop photos here' : 'Click or drag photos here'}
                </span>
                <span className="post-photo-subhint">JPG, PNG, WEBP up to 10MB each</span>
              </div>
            </div>
          )}

          {/* Preview grid */}
          {photos.length > 0 && (
            <div className="post-photo-grid">
              {photos.map((photo, i) => (
                <div key={i} className="post-photo-thumb">
                  <img src={photo.url} alt={`Photo ${i + 1}`} />
                  <button
                    type="button"
                    className="post-photo-remove"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                  {i === 0 && <span className="post-photo-cover-label">Cover</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary post-submit"
          disabled={submitting}
          id="post-submit-btn"
        >
          {submitting ? (
            <span className="post-spinner">
              <span className="post-spinner-dot" />
              <span className="post-spinner-dot" />
              <span className="post-spinner-dot" />
              Posting…
            </span>
          ) : (
            '🚀 Post Listing'
          )}
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
        .post-error {
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: rgba(255, 77, 106, 0.1);
          border: 1px solid rgba(255, 77, 106, 0.2);
          color: var(--danger);
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
          color: #6b9fff;
        }
        .post-type-btn.active.type-trade {
          background: rgba(255, 176, 32, 0.1);
          border-color: var(--warning);
          color: var(--warning);
        }
        .post-photo-hint {
          font-size: 12px;
          color: var(--foreground-muted);
          font-weight: 400;
          margin-left: 6px;
        }
        .post-photo-area {
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .post-photo-area:hover,
        .post-photo-area.drag-over {
          border-color: var(--primary);
          background: rgba(0, 48, 135, 0.05);
        }
        .post-photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--foreground-muted);
          font-size: 13px;
          pointer-events: none;
        }
        .post-photo-subhint {
          font-size: 11px;
          color: var(--foreground-muted);
          opacity: 0.6;
        }
        .post-photo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 480px) {
          .post-photo-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .post-photo-thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .post-photo-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .post-photo-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          font-size: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .post-photo-remove:hover {
          background: var(--danger);
        }
        .post-photo-cover-label {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(0, 48, 135, 0.85);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .post-submit {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          margin-top: 8px;
        }
        .post-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .post-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .post-spinner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: bounce 0.6s infinite alternate;
        }
        .post-spinner-dot:nth-child(2) { animation-delay: 0.15s; }
        .post-spinner-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.6; }
          to { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
