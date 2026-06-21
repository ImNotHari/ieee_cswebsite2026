import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MemberDashboard from './pages/MemberDashboard';
import AnimatedFace from './components/AnimatedFace';
import EventsPage from './pages/EventsPage';
import './App.css';

const App = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (hash === '#/dashboard') {
      return <MemberDashboard />;
    }
    if (hash === '#/login') {
      return <LoginPage />;
    }
    if (hash === '#/events') {
      return <EventsPage />;
    }
    if (hash === '#/blog') {
      return (
        <div className="page-container" style={{ position: 'relative', marginTop: '120px', padding: '0 2rem 4rem 2rem', maxWidth: '1200px', margin: '120px auto 0 auto' }}>
          {/* Glow effect behind the navbar for the frosted glass */}
          <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '400px', background: 'radial-gradient(ellipse at top, rgba(50, 203, 255, 0.15), transparent 70%)', zIndex: -1, pointerEvents: 'none' }}></div>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="gradient-text animate-fade-in-up stagger-1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Blog</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="animate-fade-in-up stagger-2">
              Stories, tutorials, and insights from our community.
            </p>
          </div>
          <div style={{ transform: 'scale(0.8)', margin: '4rem auto' }}>
            <AnimatedFace />
          </div>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-2rem' }} className="animate-fade-in-up stagger-2">Coming Soon...</p>
        </div>
      );
    }
    return <HomePage />;
  };

  return (
    <div className="app-container">
      {(hash !== '#/login' && hash !== '#/dashboard') && <Navbar />}
      {renderContent()}
    </div>
  );
};

export default App;
