import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AnimatedFace from '../components/AnimatedFace';
// @ts-ignore
import SplitText from '../components/SplitText';
// @ts-ignore
import FadeContent from '../components/FadeContent';
import Footer from '../components/Footer';
import OfficerCarousel from '../components/OfficerCarousel';
const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    let timerId: number;
    if (location.state && typeof location.state === 'object' && 'scrollTo' in location.state) {
      const id = (location.state as any).scrollTo;
      const el = document.getElementById(id);
      if (el) {
        timerId = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        // Clear the state so it doesn't trigger again on reload
        window.history.replaceState({}, document.title);
      }
    }
    return () => clearTimeout(timerId);
  }, [location.state]);

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash !== '#' && !hash.startsWith('#/')) {
      const timerId = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [location.hash]);

  return (
    <div className="home-container">
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="achievements" className="section-container">
        <SplitText 
          text="Our Achievements" 
          tag="h2" 
          className="section-title accent-text animate-fade-in-up stagger-1"
          delay={50}
          duration={1}
          splitType="words, chars"
        />
        <div style={{ transform: 'scale(0.8)', margin: '2rem auto' }}><AnimatedFace /></div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-2rem' }} className="animate-fade-in-up stagger-2">Coming Soon...</p>
      </div>
      <div id="excecom" className="section-container">
        <SplitText 
          text="EXCECOM" 
          tag="h2" 
          className="section-title accent-text animate-fade-in-up stagger-1"
          delay={50}
          duration={1}
          splitType="words, chars"
        />
        <FadeContent blur={true} duration={1000} ease="power2.out" initialOpacity={0} delay={100}>
          <OfficerCarousel />
        </FadeContent>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

