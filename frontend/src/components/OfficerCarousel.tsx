import React, { useState, useEffect, useRef, useCallback } from 'react';
import './OfficerCarousel.css';

const cards = [
  { name: "Dr. Sarah Connor", role: "Chapter Advisor", tagClass: "tag-adviser" },
  { name: "John Doe", role: "Chairperson", tagClass: "tag-chairperson" },
  { name: "Jane Smith", role: "Vice Chairperson", tagClass: "tag-vice-chair" },
  { name: "Alice Johnson", role: "Secretary", tagClass: "tag-secretary" },
  { name: "Bob Williams", role: "Vice Secretary", tagClass: "tag-vice-sec" },
  { name: "Charlie Brown", role: "Technical Co-ordinator", tagClass: "tag-tech" },
  { name: "Diana Prince", role: "WIC", tagClass: "tag-wic" },
];

const POSITIONS = ['big', 'pos-right1', 'pos-right2', 'pos-right3', 'hidden', 'pos-left3', 'pos-left2', 'pos-left1'];

const OfficerCarousel = () => {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const N = cards.length;

  const rotate = useCallback((dir: number) => {
    setActive(prev => (prev + dir + N) % N);
  }, [N]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') rotate(-1);
      if (e.key === 'ArrowRight') rotate(1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [rotate]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => rotate(1), 1500);
    return () => clearInterval(timer);
  }, [isHovered, rotate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) rotate(dx < 0 ? 1 : -1);
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-nav-btn prev" onClick={() => rotate(-1)}>&#8592;</button>
      <button className="carousel-nav-btn next" onClick={() => rotate(1)}>&#8594;</button>

      <div 
        className="carousel-track" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {cards.map((data, i) => {
          const offset = (i - active + N) % N;
          const posClass = POSITIONS[offset] ?? 'hidden';
          const isBigSlot = posClass === 'big';
          const dist = Math.min(offset, N - offset);
          const zIndex = isBigSlot ? 10 : (5 - dist);
          
          return (
            <div 
              key={i}
              className={`card ${isBigSlot ? 'big' : 'small'} ${posClass}`}
              style={{ zIndex }}
              onClick={() => {
                const clickOffset = (i - active + N) % N;
                if (clickOffset !== 0) rotate(clickOffset <= N / 2 ? clickOffset : clickOffset - N);
              }}
            >
              <div className="card-image" style={{
                backgroundImage: `url(https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=e68a35)`
              }}></div>
              <div className="card-content">
                <div className="card-name">{data.name}</div>
                <div className={`position-tag ${data.tagClass}`}>{data.role}</div>
                <div className="card-socials">
                  <a href="#" aria-label="Email" onClick={e => e.stopPropagation()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </a>
                  <a href="#" aria-label="Instagram" onClick={e => e.stopPropagation()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" onClick={e => e.stopPropagation()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dots">
        {cards.map((_, i) => (
          <div 
            key={i}
            className={`dot ${i === active ? 'active' : ''}`}
            onClick={() => {
              const clickOffset = (i - active + N) % N;
              if (clickOffset !== 0) rotate(clickOffset <= N / 2 ? clickOffset : clickOffset - N);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default OfficerCarousel;
