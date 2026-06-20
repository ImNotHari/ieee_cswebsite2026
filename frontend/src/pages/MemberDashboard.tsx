import { useState } from 'react';
import AnimatedFace from '../components/AnimatedFace';
import './MemberDashboard.css';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-navbar glass-panel">
        <div className="dashboard-logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>
          <img src="/ieee-logo-geci.png" alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
        </div>
        <div className="dashboard-nav-right">
          <img src="https://ui-avatars.com/api/?name=Member&background=32cbff&color=fff&rounded=true" alt="Profile" className="profile-icon" />
          <a href="#/login" className="logout-btn">Logout</a>
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
          {activeTab === 'add' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="gradient-text">Add New Event</h1>
                <button type="button" className="logout-btn" style={{ background: 'var(--sky-aqua)', color: 'var(--graphite)', border: 'none' }}>Publish Event</button>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', marginTop: '1rem' }}>
                <input type="text" placeholder="Event Title" style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--text-primary)', color: 'white', fontSize: '1rem' }} />
                <input type="date" style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--text-primary)', color: 'white', fontSize: '1rem' }} />
                
                <label htmlFor="file" className="custum-file-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', background: 'var(--bg-color)', border: '1px dashed var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>
                  <div className="text" style={{ fontSize: '1.2rem', color: 'white' }}>
                    <span>&#128194; Click to upload image</span>
                  </div>
                  <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                </label>

                <textarea placeholder="Event Description" style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--text-primary)', color: 'white', fontSize: '1rem', minHeight: '150px' }} />
              </form>
            </>
          )}
          {activeTab === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h1 className="gradient-text" style={{ alignSelf: 'flex-start' }}>Edit Event</h1>
              <p style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>Select an event from your list to start editing.</p>
              <div style={{ transform: 'scale(0.7)', marginTop: '-50px' }}>
                <AnimatedFace />
              </div>
            </div>
          )}
          {activeTab === 'view' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h1 className="gradient-text" style={{ alignSelf: 'flex-start' }}>My Events</h1>
              <p style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>You haven't published any events yet.</p>
              <div style={{ transform: 'scale(0.7)', marginTop: '-50px' }}>
                <AnimatedFace />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
