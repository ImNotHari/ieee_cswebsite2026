import './AboutSection.css';

// @ts-ignore
import SplitText from './SplitText';
import CountUpNumber from './CountUpNumber';

const AboutSection = () => {
  return (
    <div className="about-container section-container">
      <SplitText 
        text="About IEEE CS GECI" 
        tag="h2" 
        className="section-title accent-text animate-fade-in-up stagger-1"
        delay={50}
        duration={1}
        splitType="words, chars"
      />
      <div className="about-content glass-panel animate-fade-in-up stagger-2">
        <div className="about-text">
          <p>
            IEEE Computer Society GECI is a vibrant community of innovators, thinkers, and builders. 
            We strive to push the boundaries of technology and design by hosting 
            collaborative events, insightful workshops, and cutting-edge hackathons.
          </p>
          <p>
            Our mission is to foster a culture of continuous learning and 
            technological advancement. Whether you are a seasoned professional or 
            a passionate beginner, IEEE CS GECI provides the perfect platform to grow, 
            network, and showcase your skills.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <CountUpNumber end={50} suffix="+" className="stat-number gradient-text" />
              <span className="stat-label">Events Hosted</span>
            </div>
            <div className="stat-item">
              <CountUpNumber end={2000} suffix="+" className="stat-number gradient-text" />
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <CountUpNumber end={15} suffix="+" className="stat-number gradient-text" />
              <span className="stat-label">Industry Partners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
