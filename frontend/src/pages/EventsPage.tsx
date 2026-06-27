import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AnimatedFace from '../components/AnimatedFace';
import Masonry from 'react-masonry-css';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ padding: 'calc(var(--nav-height) + 4rem) 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text animate-fade-in-up stagger-1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Events</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="animate-fade-in-up stagger-2">
          Join us for our latest workshops, talks, and community gatherings.
        </p>
      </div>

      {loading ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No events at the moment. Stay tuned!</p>
          <div style={{ transform: 'scale(0.7)', marginTop: '-50px' }}>
            <AnimatedFace />
          </div>
        </div>
      ) : (
        <Masonry
          breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
          className="my-masonry-grid animate-fade-in-up stagger-1"
          columnClassName="my-masonry-grid_column"
        >
          {events.map(event => (
            <div key={event.id} className="event-card">
              {event.poster_path ? (
                <img 
                  className="event-card-img"
                  src={`${supabase.storage.from('posters').getPublicUrl(event.poster_path).data.publicUrl}`} 
                  alt={event.title} 
                />
              ) : (
                <svg className="placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
              )}
              <div className="event-card__content">
                <p className="event-card__title">{event.title}</p>
                <div className="event-card__meta">
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time.slice(0, 5)}</span>
                  {event.location && <span>{event.location}</span>}
                </div>
                {event.description && (
                  <p className="event-card__description">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default EventsPage;
