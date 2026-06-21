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
        <div className="page-container" style={{ marginTop: '120px' }}>
          <AnimatedFace />
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
