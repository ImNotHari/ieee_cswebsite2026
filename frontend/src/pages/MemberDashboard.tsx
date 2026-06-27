import { useState, useEffect, useRef, useCallback } from 'react';
import AnimatedFace from '../components/AnimatedFace';
import ThemeToggle from '../components/ThemeToggle';
import AddEventPanel from '../components/AddEventPanel';
import { supabase } from '../lib/supabase';
import './MemberDashboard.css';
import '../components/Navbar.css';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setIsAuthenticated(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // UI State
  const [message, setMessage] = useState({ text: '', type: '' });
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!message.text) return;
    const id = setTimeout(() => {
      if (isMounted.current) {
        setMessage({ text: '', type: '' });
      }
    }, 5000);
    return () => clearTimeout(id);
  }, [message.text]);

  const safeSetState = useCallback((fn: () => void) => {
    if (isMounted.current) fn();
  }, []);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sidebarOpen] = useState(true);
  
  // Events List State
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleEditClick = (event: any) => {
    setEditingEventId(event.id);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setActiveTab('view');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setLoadingEvents(true);
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      setMessage({ text: `Failed to delete event: ${error.message}`, type: 'error' });
    } else {
      setMessage({ text: 'Event deleted successfully!', type: 'success' });
      fetchEvents();
    }
    setLoadingEvents(false);
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setEvents(data);
    }
    setLoadingEvents(false);
  };

  return (
    <>
      {!isAuthenticated && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Session Expired</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please log in to access the Member Area.</p>
            <a href="#/login" className="publish-btn" style={{ textDecoration: 'none' }}>Go to Login</a>
          </div>
        </div>
      )}
      {message.text && (
        <div className={`toast ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="dashboard-layout">
        <nav className="dashboard-navbar">
        <div className="dashboard-logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="nav-logo-wrapper">
            <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part circle-part" />
            <img src="/ieee-logo-geci.png" alt="IEEE CS GECI" className="nav-logo-part text-part" />
          </div>
        </div>
        <div className="dashboard-nav-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          
          {/* Desktop View */}
          <img src="https://ui-avatars.com/api/?name=Member&background=cc7b2f&color=fff&rounded=true" alt="Profile" className="profile-icon desktop-only" />
          <button 
            className="fancy-btn desktop-only" 
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.hash = '';
            }}
          >
            <span className="btn-text">Logout</span>
            <span className="shine"></span>
            <span className="border tl"></span>
            <span className="border tr"></span>
            <span className="border bl"></span>
            <span className="border br"></span>
          </button>

          {/* Mobile View */}
          <button 
            className="mobile-only"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="https://ui-avatars.com/api/?name=Member&background=32cbff&color=fff&rounded=true" alt="Profile" className="profile-icon" />
          </button>
          
          {profileDropdownOpen && (
            <div className="profile-dropdown mobile-only" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem', zIndex: 1000, minWidth: '150px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <button 
                className="logout-btn" 
                style={{ width: '100%', justifyContent: 'flex-start', color: '#ff6b6b' }}
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.hash = '';
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="dashboard-container animate-fade-in-up">
        <aside className={`dashboard-sidebar glass-panel ${!sidebarOpen ? 'closed' : ''}`}>
          <h2 className="gradient-text">Member Area</h2>
          <ul className="sidebar-links">
            <li className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}>Add Event</li>
            <li className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>Edit Event</li>
            <li className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>My Events</li>
          </ul>
        </aside>
        <main className="dashboard-main glass-panel">
          {(activeTab === 'add' || (activeTab === 'edit' && editingEventId)) && (
            <AddEventPanel 
              onSuccess={() => {
                fetchEvents();
                if (activeTab === 'add') {
                  setActiveTab('view');
                } else if (activeTab === 'edit') {
                  handleCancelEdit();
                }
              }}
              editingEvent={events.find(e => e.id === editingEventId)}
              onCancelEdit={handleCancelEdit}
              activeTab={activeTab}
            />
          )}
          {(activeTab === 'edit' && !editingEventId) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h1 className="gradient-text" style={{ alignSelf: 'flex-start' }}>Edit Event</h1>
              <p style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>Select an event from your list to start editing.</p>
              <div style={{ transform: 'scale(0.7)', marginTop: '-50px' }}>
                <AnimatedFace />
              </div>
            </div>
          )}
          {activeTab === 'view' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="dashboard-header-row">
                <h1 className="gradient-text">My Events</h1>
                <button className="publish-btn" onClick={fetchEvents} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Refresh</button>
              </div>
              
              {loadingEvents ? (
                <div className="animate-fade-in-up" style={{ position: 'relative', height: '200px', width: '100%', marginTop: '2rem' }}>
                  <div className="banter-loader">
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                    <div className="banter-loader__box"></div>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>You haven't published any events yet.</p>
                  <div style={{ transform: 'scale(0.7)', marginTop: '-50px' }}>
                    <AnimatedFace />
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {events.map(event => (
                    <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {event.poster_path && (
                        <img 
                          src={`${supabase.storage.from('posters').getPublicUrl(event.poster_path).data.publicUrl}`} 
                          alt={event.title} 
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                      )}
                      <div>
                        <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{event.title}</h3>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time.slice(0, 5)}</span>
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </div>
                      {event.description && (
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                          {event.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button className="publish-btn" onClick={() => handleEditClick(event)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>Edit</button>
                        <button className="publish-btn" onClick={() => handleDelete(event.id)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      </div>
    </>
  );
};

export default MemberDashboard;
