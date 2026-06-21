import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel animate-fade-in-up">
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div className="nav-logo">
          <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-img" />
          </a>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-btn">Home</a>
          <a href="#about" className="nav-btn">About</a>
          <a href="#achievements" className="nav-btn">Achievements</a>
          <a href="#excecom" className="nav-btn">Excecom</a>
          <a href="#/events" className="nav-btn">Events</a>
          <a href="#/blog" className="nav-btn">Blog</a>
        </div>
      </div>
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
        <a href="#/login" className="nav-login-btn">Login</a>
      </div>
    </nav>
  );
};

export default Navbar;
