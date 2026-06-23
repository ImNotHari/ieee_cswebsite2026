import FadeContent from './FadeContent';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <FadeContent blur={true} duration={1000} ease="power2.out" initialOpacity={0} delay={200}>
        <div className="footer-content">
          {/* Column 1: Logo & Text */}
          <div className="footer-col-1">
            <div className="footer-brand">
              <div className="nav-logo-wrapper" style={{ height: '75px' }}>
                <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part circle-part" />
                <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part text-part" />
              </div>
            </div>
            <p className="footer-description">
              Fostering Computer Science & Innovation at Government Engineering College Idukki
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="footer-col-2">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>ieeecs@gecidukki.ac.in</span>
            </div>
            <div className="footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+91 9567597391</span>
            </div>
          </div>

          {/* Column 3: Follow Us */}
          <div className="footer-col-3">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="footer-socials wrapper">
              <a href="#" className="social-icon instagram" aria-label="Instagram">
                <span className="tooltip">Instagram</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
                <span className="tooltip">LinkedIn</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="social-icon whatsapp" aria-label="WhatsApp">
                <span className="tooltip">WhatsApp</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  <path d="M9.4 9.4c-.5-.5-1.3-.5-1.8 0-.4.4-.6 1-.3 1.5 1.1 2.3 3.3 4.5 5.6 5.6.5.3 1.1.1 1.5-.3.5-.5.5-1.3 0-1.8l-1.3-1.3c-.4-.4-1-.4-1.4 0l-.3.3c-.2.2-.5.2-.8.1-.9-.4-1.7-1.2-2.1-2.1-.1-.3-.1-.6.1-.8l.3-.3c.4-.4.4-1 0-1.4L9.4 9.4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} IEEE CS SBC GECI. All rights reserved.</p>
        </div>
      </FadeContent>
    </footer>
  );
};

export default Footer;
