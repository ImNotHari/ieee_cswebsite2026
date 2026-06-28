import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isLightMode, setIsLightMode] = useState(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return savedTheme === 'light' || (!savedTheme && systemLight);
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        localStorage.setItem('theme', 'light');
      } else {
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
    <label className="bloom-switch" aria-label="Toggle night mode">
      <input 
        type="checkbox" 
        checked={!isLightMode} 
        onChange={toggleTheme} 
      />
      <span className="bloom-switch__track">
        <span className="bloom-switch__star bloom-switch__star--1"></span>
        <span className="bloom-switch__star bloom-switch__star--2"></span>
        <span className="bloom-switch__star bloom-switch__star--3"></span>
        <span className="bloom-switch__thumb">
          <svg className="bloom-switch__sun" viewBox="0 0 256 256" aria-hidden="true">
            <path
              fill="currentColor"
              d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"
            ></path>
          </svg>
          <svg className="bloom-switch__moon" viewBox="0 0 256 256" aria-hidden="true">
            <path
              fill="currentColor"
              d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z"
            ></path>
          </svg>
        </span>
      </span>
    </label>
  );
};

export default ThemeToggle;
