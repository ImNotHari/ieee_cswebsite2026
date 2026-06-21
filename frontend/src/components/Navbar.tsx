import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  return (
    <nav className="navbar glass-panel animate-fade-in-up">
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div className="nav-logo" style={{ zIndex: 1001 }}>
          <a href="#" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px', minWidth: '44px' }}>
            <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-img" />
          </a>
        </div>
        
        <div className="nav-links desktop-links">
          <a href="#" className="nav-btn">Home</a>
          <a href="#about" className="nav-btn">About</a>
          <a href="#achievements" className="nav-btn">Achievements</a>
          <a href="#excecom" className="nav-btn">Excecom</a>
          <a href="#/events" className="nav-btn">Events</a>
          <a href="#/blog" className="nav-btn">Blog</a>
        </div>
      </div>
      
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1001 }}>
        <a href="#/login" className="nav-login-btn" style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>Login</a>
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className="hamburger-box">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </button>
      </div>

      <div 
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      >
        <div 
          className="mobile-menu-content glass-panel" 
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
          tabIndex={-1}
        >
          <a href="#" className="nav-btn" onClick={closeMenu}>Home</a>
          <a href="#about" className="nav-btn" onClick={closeMenu}>About</a>
          <a href="#achievements" className="nav-btn" onClick={closeMenu}>Achievements</a>
          <a href="#excecom" className="nav-btn" onClick={closeMenu}>Excecom</a>
          <a href="#/events" className="nav-btn" onClick={closeMenu}>Events</a>
          <a href="#/blog" className="nav-btn" onClick={closeMenu}>Blog</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
