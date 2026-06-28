import React, { useState, useEffect, useRef } from 'react';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({ end, duration = 2000, suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let hasTriggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          hasTriggered = true;
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    let rafId: number;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for a nice slow-down effect at the end
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, hasAnimated]);

  return (
    <span ref={nodeRef} className={className}>
      {count}{suffix}
    </span>
  );
};

export default CountUpNumber;
