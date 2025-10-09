'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function GlobalNav() {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/projects/') && pathname !== '/projects';
  const isHomePage = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="chapter-nav" aria-label="Chapters">
      <div className="container nav-inner">
        <Link href="https://raagsan.com" className="nav-logo" aria-label="Raagsan homepage" target="_blank" rel="noopener noreferrer">
          <img src="https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/Raagsan-logo" alt="Raagsan logo" width="120" height="60" className="h-8 w-auto" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link href="/#projects" className={`nav-link ${pathname === '/projects' ? 'active' : ''}`}>Projects</Link>
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
          <Link href="/admin" className="nav-link admin-link" title="Admin Access">
            ⚙️
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/#projects" className={`mobile-nav-link ${pathname === '/projects' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/#about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/admin/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
