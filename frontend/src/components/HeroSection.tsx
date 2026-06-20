import './HeroSection.css';
import AnimatedFace from './AnimatedFace';

const HeroSection = () => {
  return (
    <div className="hero-container section-container">
      <div className="hero-left animate-fade-in-up stagger-1">
        <h1 className="hero-main-text">
          Innovate. <br />
          <span className="gradient-text">Elevate.</span> <br />
          Inspire.
        </h1>
        <p className="hero-subtext">
          Welcome to the future of our community. Explore the boundaries of technology and design with us.
        </p>
      </div>
      
      <div className="hero-right animate-fade-in-up stagger-2 glass-panel">
        <h3 className="events-heading gradient-text">Coming Soon</h3>
        <AnimatedFace />
      </div>
    </div>
  );
};

export default HeroSection;
