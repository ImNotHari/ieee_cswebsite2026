import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EventsPage, LoginPage, MembershipPage, GalleryPage } from '../App';
import ThemeToggle from './ThemeToggle';
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
      navigate('/', { state: { scrollTo: id } });
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
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className="nav-logo" style={{ zIndex: 1001 }}>
          <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px', minWidth: '44px' }}>
            <div className="nav-logo-wrapper">
              <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part circle-part" />
              <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part text-part" />
            </div>
          </Link>
        </div>

        <div className="nav-links desktop-links">
          <Link to="/" className="nav-btn">Home</Link>
          <button className="nav-btn" onClick={() => scrollToSection('about')}>About</button>
          <button className="nav-btn" onClick={() => scrollToSection('achievements')}>Achievements</button>
          <button className="nav-btn" onClick={() => scrollToSection('excecom')}>Excecom</button>
          <Link to="/events" className="nav-btn" {...getPrefetchHandlers(EventsPage)}>Events</Link>
          <Link to="/gallery" className="nav-btn" {...getPrefetchHandlers(GalleryPage)}>Gallery</Link>
          <Link to="/membership" className="nav-btn" {...getPrefetchHandlers(MembershipPage)}>Membership</Link>
        </div>
      </div>

      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 1001 }}>
        <ThemeToggle />
        <Link to="/login" className="fancy-btn" style={{ textDecoration: 'none' }} {...getPrefetchHandlers(LoginPage)}>
          <span className="btn-text">Login</span>
          <span className="shine"></span>
          <span className="border tl"></span>
          <span className="border tr"></span>
          <span className="border bl"></span>
          <span className="border br"></span>
        </Link>
        <label className="burger">
          <input 
            type="checkbox" 
            checked={isOpen} 
            onChange={toggleMenu} 
            aria-label="Toggle navigation menu"
          />
          <span></span>
          <span></span>
          <span></span>
        </label>
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
          <button className="nav-btn" onClick={() => scrollToSection('about')}>About</button>
          <button className="nav-btn" onClick={() => scrollToSection('achievements')}>Achievements</button>
          <button className="nav-btn" onClick={() => scrollToSection('excecom')}>Excecom</button>
          <Link to="/events" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(EventsPage)}>Events</Link>
          <Link to="/gallery" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(GalleryPage)}>Gallery</Link>
          <Link to="/membership" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(MembershipPage)}>Membership</Link>
          <Link to="/login" className="nav-btn" onClick={closeMenu} {...getPrefetchHandlers(LoginPage)}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
