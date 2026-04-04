'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { MOCK_USER, getListingsBySeller } from '@/lib/mock-data';
import ListingCard from '@/app/components/ListingCard';

interface UserProfile {
  email: string;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch real user from Supabase session
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        // Use the part before @ as the display name, or fall back to mock
        const namePart = user.email.split('@')[0];
        const displayName = namePart
          .split(/[._-]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setUserProfile({
          email: user.email,
          name: displayName,
        });
      } else {
        // Fall back to mock user for demo purposes
        setUserProfile({
          email: MOCK_USER.email,
          name: MOCK_USER.name,
        });
      }
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const displayName = userProfile?.name || MOCK_USER.name;
  const displayEmail = userProfile?.email || MOCK_USER.email;
  const myListings = getListingsBySeller(MOCK_USER.id);

  return (
    <main className="page-container">
      {/* Profile Header */}
      <div className="profile-header animate-slide-up">
        <div className="profile-card glass-card">
          <div className="profile-top">
            <div className="profile-avatar">
              {displayName.charAt(0)}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{displayName}</h1>
              <p className="profile-email">{displayEmail}</p>
              <p className="profile-joined">
                Joined{' '}
                {new Date(MOCK_USER.joinedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-num">{MOCK_USER.itemsListed}</span>
              <span className="profile-stat-label">Listed</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-num">{MOCK_USER.itemsSold}</span>
              <span className="profile-stat-label">Sold</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-num">{MOCK_USER.itemsGiven}</span>
              <span className="profile-stat-label">Given Away</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact banner */}
      <div className="profile-impact glass-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="profile-impact-inner">
          <span className="profile-impact-emoji">💚</span>
          <div className="profile-impact-text">
            <strong>Impact:</strong> You&apos;ve helped {MOCK_USER.itemsGiven} items find a new home!
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <button className="btn btn-secondary profile-action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
        <button
          className="btn btn-danger profile-action-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? 'Logging out…' : 'Log Out'}
        </button>
      </div>

      {/* My Listings */}
      <div className="profile-listings animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <h2 className="profile-listings-title">My Listings</h2>
        {myListings.length > 0 ? (
          <div className="profile-listings-grid">
            {myListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="profile-listings-empty glass-card">
            <span style={{ fontSize: 36 }}>📦</span>
            <p>You haven&apos;t posted any listings yet.</p>
            <a href="/post" className="btn btn-primary" style={{ marginTop: 8 }}>
              Post Your First Item
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-header {
          margin-bottom: 20px;
        }
        .profile-card {
          padding: 28px;
        }
        .profile-card:hover {
          transform: none;
        }
        .profile-top {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }
        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .profile-name {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .profile-email {
          font-size: 13px;
          color: var(--foreground-secondary);
          margin: 0;
        }
        .profile-joined {
          font-size: 12px;
          color: var(--foreground-muted);
          margin: 0;
        }
        .profile-stats {
          display: flex;
          gap: 0;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .profile-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .profile-stat-num {
          font-size: 22px;
          font-weight: 700;
        }
        .profile-stat-label {
          font-size: 11px;
          color: var(--foreground-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .profile-impact {
          padding: 16px 20px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, rgba(0, 196, 140, 0.08), rgba(0, 230, 138, 0.04));
          border-color: rgba(0, 196, 140, 0.15);
        }
        .profile-impact:hover {
          transform: none;
        }
        .profile-impact-inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-impact-emoji {
          font-size: 24px;
        }
        .profile-impact-text {
          font-size: 14px;
          color: var(--foreground-secondary);
        }
        .profile-impact-text strong {
          color: var(--success);
        }
        .profile-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
        }
        .profile-action-btn {
          flex: 1;
        }
        .profile-listings-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        .profile-listings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .profile-listings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .profile-listings-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--foreground-muted);
          font-size: 14px;
        }
        .profile-listings-empty:hover {
          transform: none;
        }
      `}</style>
    </main>
  );
}
