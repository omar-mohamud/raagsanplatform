'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNav() {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/projects/') && pathname !== '/projects';
  const isHomePage = pathname === '/';

  return (
    <nav className="chapter-nav" aria-label="Chapters">
      <div className="container nav-inner">
        <Link href="https://raagsan.com" className="nav-logo" aria-label="Raagsan homepage" target="_blank" rel="noopener noreferrer">
          <img src="https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/Raagsan-logo" alt="Raagsan logo" width="120" height="60" className="h-8 w-auto" />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/#projects" className="nav-link">Projects</Link>
          <Link href="/#about" className="nav-link">About</Link>
          <Link href="/admin/login" className="nav-link">Login</Link>
        </div>
        <div className="nav-right">
          {isProjectPage && (
            <Link href="/" className="nav-link nav-back-link">
              ← back
            </Link>
          )}
          {!isHomePage && !isProjectPage && (
            <Link href="/" className="nav-link nav-back-link">
              ← Back to Homepage
            </Link>
          )}
          {/* Hidden admin access - only visible to those who know where to look */}
          <Link href="/admin" className="nav-link" style={{opacity: 0.1, fontSize: '0.7rem'}} title="Admin Access">
            ⚙️
          </Link>
        </div>
      </div>
    </nav>
  );
}
