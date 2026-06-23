import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EventsPage, LoginPage, MembershipPage, BlogPage } from '../App';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToSection = (id: string) => {
    closeMenu();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPrefetchHandlers = (Component: any) => ({
    onMouseEnter: () => Component.preload?.(),
    onTouchStart: () => Component.preload?.(),
    onFocus: () => Component.preload?.(),
  });

  return (
    <nav className={`navbar animate-fade-in-up ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div className="nav-logo" style={{ zIndex: 1001 }}>
          <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px', minWidth: '44px' }}>
            <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-img" />
          </Link>
        </div>

        <div className="nav-links desktop-links">
          <Link to="/" className="nav-btn">Home</Link>
          <button className="nav-btn" onClick={() => scrollToSection('about')}>About</button>
          <button className="nav-btn" onClick={() => scrollToSection('achievements')}>Achievements</button>
          <button className="nav-btn" onClick={() => scrollToSection('excecom')}>Excecom</button>
          <Link to="/events" className="nav-btn" {...getPrefetchHandlers(EventsPage)}>Events</Link>
          <Link to="/blog" className="nav-btn" {...getPrefetchHandlers(BlogPage)}>Blog</Link>
          <Link to="/membership" className="nav-btn" {...getPrefetchHandlers(MembershipPage)}>Membership</Link>
        </div>
      </div>

      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1001 }}>
        <Link to="/login" className="fancy-btn" style={{ textDecoration: 'none' }} {...getPrefetchHandlers(LoginPage)}>
          <span className="btn-text">Login</span>
          <span className="shine"></span>
          <span className="border tl"></span>
          <span className="border tr"></span>
          <span className="border bl"></span>
          <span className="border br"></span>
        </Link>
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
          className="mobile-menu-content"
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
          tabIndex={-1}
        >
          <Link to="/" className="nav-btn" onClick={closeMenu}>Home</Link>
          <button className="nav-btn" onClick={() => scrollToSection('about')} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '1rem', width: '100%' }}>About</button>
          <button className="nav-btn" onClick={() => scrollToSection('achievements')} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '1rem', width: '100%' }}>Achievements</button>
          <button className="nav-btn" onClick={() => scrollToSection('excecom')} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '1rem', width: '100%' }}>Excecom</button>
          <Link to="/events" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(EventsPage)}>Events</Link>
          <Link to="/blog" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(BlogPage)}>Blog</Link>
          <Link to="/membership" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(MembershipPage)}>Membership</Link>
          <Link to="/login" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(LoginPage)}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
