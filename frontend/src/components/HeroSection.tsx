import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import './HeroSection.css';
import AnimatedFace from './AnimatedFace';
// @ts-ignore
import SplitText from './SplitText';
import ErrorBoundary from './ErrorBoundary';

const HeroSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('start_timestamp', now)
        .order('start_timestamp', { ascending: true })
        .limit(3);
        
      if (!error && data) {
        setUpcomingEvents(data);
      }
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hero-container section-container">
      <div className="hero-left animate-fade-in-up stagger-1">
        <h1 className="hero-main-text">
          <SplitText text="Innovate." tag="span" delay={30} duration={1} splitType="chars" /> <br />
          <SplitText text="Elevate." tag="span" className="accent-text" delay={30} duration={1} splitType="chars" /> <br />
          <SplitText text="Inspire." tag="span" delay={30} duration={1} splitType="chars" />
        </h1>
        <p className="hero-subtext">
          Welcome to the future of our community. Explore the boundaries of technology and design with us.
        </p>
        <a href="#/membership" className="fancy-btn" style={{ textDecoration: 'none', display: 'inline-block', alignSelf: 'flex-start' }}>
          <span className="btn-text">Become a member now</span>
          <span className="shine"></span>
          <span className="border tl"></span>
          <span className="border tr"></span>
          <span className="border bl"></span>
          <span className="border br"></span>
        </a>
      </div>
      
      <div className="hero-right animate-fade-in-up stagger-2 glass-panel">
        <SplitText 
          text="Coming Soon" 
          tag="h3" 
          className="events-heading accent-text"
          delay={50}
          duration={1}
          splitType="words, chars"
        />
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="upcoming-events-list">
            {upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className={`upcoming-event-card ${flippedCardId === event.id ? 'flipped' : ''}`}
                onClick={() => setFlippedCardId(flippedCardId === event.id ? null : event.id)}
              >
                <div className="upcoming-event-card-inner">
                  {/* FRONT OF CARD */}
                  <div className="upcoming-event-card-front">
                    {event.poster_path ? (
                      <img src={`${supabase.storage.from('posters').getPublicUrl(event.poster_path).data.publicUrl}`} alt={event.title} className="upcoming-event-img" />
                    ) : (
                      <div className="upcoming-event-placeholder"></div>
                    )}
                    <div className="upcoming-event-info">
                      <h4>{event.title}</h4>
                      <p className="upcoming-event-time">Starts {formatDistanceToNow(new Date(event.start_timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                  
                  {/* BACK OF CARD */}
                  <div className="upcoming-event-card-back">
                    <h4>{event.title}</h4>
                    <p className="upcoming-event-desc">
                      {event.description || "No description available for this event."}
                    </p>
                    <span className="flip-back-hint">Click to flip back ⟲</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ErrorBoundary>
            <AnimatedFace />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
