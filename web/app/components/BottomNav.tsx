'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    label: 'Feed',
    href: '/feed',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Post',
    href: '/post',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on login page
  if (pathname === '/login') return null;

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-nav-tab ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </Link>
        );
      })}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottomnav-height);
          background: var(--background-secondary);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          padding-bottom: env(safe-area-inset-bottom, 0);
          backdrop-filter: blur(20px);
        }
        @media (min-width: 768px) {
          .bottom-nav {
            display: none;
          }
        }
        .bottom-nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: var(--foreground-muted);
          transition: color 0.2s ease;
          padding: 6px 16px;
          min-width: 64px;
        }
        .bottom-nav-tab.active {
          color: var(--primary);
        }
        .bottom-nav-tab.active .bottom-nav-icon {
          color: var(--primary);
        }
        .bottom-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: transform 0.2s ease;
        }
        .bottom-nav-tab.active .bottom-nav-icon {
          transform: scale(1.1);
        }
        .bottom-nav-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
      `}</style>
    </nav>
  );
}
