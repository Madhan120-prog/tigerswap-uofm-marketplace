'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const [userInitial, setUserInitial] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }
    });
  }, []);

  // Hide navbar on login page
  if (pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/feed" className="navbar-brand">
          <span className="navbar-logo">🐯</span>
          <span className="navbar-title">TigerSwap</span>
        </Link>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link
              href="/feed"
              className={`navbar-link ${pathname === '/feed' ? 'active' : ''}`}
            >
              Feed
            </Link>
            <Link
              href="/post"
              className={`navbar-link ${pathname === '/post' ? 'active' : ''}`}
            >
              Post
            </Link>
            <Link
              href="/profile"
              className={`navbar-link ${pathname === '/profile' ? 'active' : ''}`}
            >
              Profile
            </Link>
          </div>

          {userInitial && (
            <Link href="/profile" className="navbar-avatar">
              {userInitial}
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--navbar-height);
          background: linear-gradient(135deg, var(--tiger-blue-dark), var(--tiger-blue));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 100;
          backdrop-filter: blur(20px);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
        }
        .navbar-logo {
          font-size: 28px;
          line-height: 1;
        }
        .navbar-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .navbar-links {
          display: none;
          gap: 4px;
        }
        @media (min-width: 768px) {
          .navbar-links {
            display: flex;
          }
        }
        .navbar-link {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .navbar-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .navbar-link.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.15);
        }
        .navbar-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }
        .navbar-avatar:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </nav>
  );
}
