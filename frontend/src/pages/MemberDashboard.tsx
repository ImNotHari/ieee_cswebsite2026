import { useState, useEffect } from 'react';
import AnimatedFace from '../components/AnimatedFace';
import { supabase } from '../lib/supabase';
import './MemberDashboard.css';
import '../components/Navbar.css';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  
  // Form State
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Events List State
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleEditClick = (event: any) => {
    setTitle(event.title || '');
    setEventDate(event.date || '');
    setTime(event.time || '');
    setLocation(event.location || '');
    setDescription(event.description || '');
    setSelectedFile(null);
    setEditingEventId(event.id);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setTitle('');
    setEventDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setSelectedFile(null);
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDate(e.target.value); // type="date" automatically gives YYYY-MM-DD
  };

  const handlePublish = async () => {
    setMessage({ text: '', type: '' });

    // Force a session check before doing anything
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsAuthenticated(false);
      return;
    }
    
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = 'Event Title is required';
    if (!eventDate) newErrors.eventDate = 'Date is required';
    if (!time) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }
    setErrors({});

    // type="date" already ensures the format is YYYY-MM-DD
    const dbDate = eventDate;
    
    // Validate that it's a real calendar date
    const parsedDate = new Date(dbDate);
    if (isNaN(parsedDate.getTime())) {
      setMessage({ text: 'Invalid calendar date.', type: 'error' });
      return;
    }

    setLoading(true);
    let posterPath = null;

    // Upload Image
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posters')
        .upload(fileName, selectedFile);

      if (uploadError) {
        setMessage({ text: `Image upload failed: ${uploadError.message}`, type: 'error' });
        setLoading(false);
        return;
      }
      posterPath = uploadData.path;
    }

    // Insert or Update Event
    if (editingEventId) {
      const updateData: any = {
        title,
        date: dbDate,
        time,
        location,
        description,
        is_published: true
      };
      if (posterPath) {
        updateData.poster_path = posterPath;
      }
      
      const { error: updateError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', editingEventId);

      if (updateError) {
        setMessage({ text: `Failed to update event: ${updateError.message}`, type: 'error' });
      } else {
        setMessage({ text: 'Event updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        handleCancelEdit();
      }
    } else {
      const { error: insertError } = await supabase.from('events').insert({
        title,
        date: dbDate,
        time,
        location,
        description,
        poster_path: posterPath,
        is_published: true // auto-publish for now
      });

      if (insertError) {
        setMessage({ text: `Failed to save event: ${insertError.message}`, type: 'error' });
      } else {
        setMessage({ text: 'Event published successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        // Reset form
        setTitle('');
        setEventDate('');
        setTime('');
        setLocation('');
        setDescription('');
        setSelectedFile(null);
      }
    }
    setLoading(false);
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
          <img src="/ieee-logo-geci.png" alt="Logo" className="dashboard-logo-img" />
        </div>
        <div className="dashboard-nav-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
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
            <>
              <div className="dashboard-header-row">
                <h1 className="gradient-text">{activeTab === 'edit' ? 'Edit Event' : 'Add New Event'}</h1>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', marginTop: '1rem' }}>
                
                <div className="form-section">
                  <h3 className="dashboard-section-title">Basic Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">Event Title <span style={{ color: '#ff6b6b' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter the event title..." 
                      value={title} 
                      onChange={e => { 
                        setTitle(e.target.value); 
                        if (!e.target.value.trim()) {
                          setErrors(prev => ({...prev, title: 'Event Title is required'}));
                        } else {
                          setErrors(prev => ({...prev, title: ''}));
                        }
                      }} 
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setErrors(prev => ({...prev, title: 'Event Title is required'}));
                        }
                      }}
                      className={`form-input ${errors.title ? 'error' : ''}`} 
                    />
                    {errors.title && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.title}</span>}
                  </div>
                </div>
                
                <div className="form-section">
                  <h3 className="dashboard-section-title">Schedule</h3>
                  <div className="form-row">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label className="form-label">Date <span style={{ color: '#ff6b6b' }}>*</span></label>
                      <input 
                        type="date" 
                        value={eventDate} 
                        onChange={e => { 
                          handleDateChange(e); 
                          if (!e.target.value) {
                            setErrors(prev => ({...prev, eventDate: 'Date is required'}));
                          } else {
                            setErrors(prev => ({...prev, eventDate: ''}));
                          }
                        }} 
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setErrors(prev => ({...prev, eventDate: 'Date is required'}));
                          }
                        }}
                        className={`form-input ${errors.eventDate ? 'error' : ''}`} 
                      />
                      {errors.eventDate && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.eventDate}</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label className="form-label">Time <span style={{ color: '#ff6b6b' }}>*</span></label>
                      <input 
                        type="time" 
                        step="60" 
                        value={time} 
                        onChange={e => { 
                          setTime(e.target.value); 
                          if (!e.target.value) {
                            setErrors(prev => ({...prev, time: 'Time is required'}));
                          } else {
                            setErrors(prev => ({...prev, time: ''}));
                          }
                        }} 
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setErrors(prev => ({...prev, time: 'Time is required'}));
                          }
                        }}
                        className={`form-input ${errors.time ? 'error' : ''}`} 
                      />
                      {errors.time && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.time}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="dashboard-section-title">Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="form-label">Location (Optional)</label>
                      <input type="text" placeholder="e.g. Main Auditorium" value={location} onChange={e => setLocation(e.target.value)} className="form-input" />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="form-label">Event Description</label>
                      <textarea placeholder="Write something about the event..." value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ minHeight: '150px' }} />
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3 className="dashboard-section-title">Media</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">Event Cover Image</label>
                    <label className="custom-file-upload" htmlFor="file" style={{ padding: selectedFile ? '0' : '1.5rem', overflow: 'hidden' }}>
                    {selectedFile ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                          <span style={{ color: 'white', fontWeight: 500 }}>Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="var(--sky-aqua)" viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clipRule="evenodd" fillRule="evenodd"></path>
                          </svg>
                        </div>
                        <div className="text">
                          <span>Click or drag image here</span>
                        </div>
                      </>
                    )}
                    <input type="file" id="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="publish-btn primary-cta" 
                    onClick={handlePublish} 
                    disabled={loading || !title.trim() || !eventDate || !time}
                    style={{ opacity: (!title.trim() || !eventDate || !time) ? 0.5 : 1, cursor: (!title.trim() || !eventDate || !time) ? 'not-allowed' : 'pointer', flex: 1 }}
                  >
                    {loading ? (activeTab === 'edit' ? 'Updating...' : 'Publishing...') : (activeTab === 'edit' ? 'Update Event' : 'Publish Event')}
                  </button>
                  {activeTab === 'edit' && (
                    <button 
                      type="button" 
                      className="publish-btn" 
                      onClick={handleCancelEdit} 
                      style={{ marginTop: '1rem', padding: '1rem', flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </>
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
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
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
