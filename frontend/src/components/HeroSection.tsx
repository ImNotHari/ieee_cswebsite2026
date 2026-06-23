import './HeroSection.css';
import AnimatedFace from './AnimatedFace';
// @ts-ignore
import SplitText from './SplitText';

const HeroSection = () => {
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
        <AnimatedFace />
      </div>
    </div>
  );
};

export default HeroSection;
