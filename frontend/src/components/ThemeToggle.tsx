import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemLight)) {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      }
      // Dispatch synchronous custom event for the canvas
      window.dispatchEvent(new CustomEvent('themeChange'));
      return newMode;
    });
  };

  // Respect the Vite environment flag to completely hide the toggle if Light Mode is disabled
  if (import.meta.env.VITE_ENABLE_LIGHT_MODE === 'false') {
    return null;
  }

  return (
    <label htmlFor="theme-switch" className="switch" aria-label="Toggle theme">
      <input 
        id="theme-switch" 
        type="checkbox" 
        checked={isLightMode} 
        onChange={toggleTheme} 
      />
      <span className="slider"></span>
      <span className="decoration"></span>
    </label>
  );
};

export default ThemeToggle;
