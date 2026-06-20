import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AnimatedFace from '../components/AnimatedFace';

const HomePage = () => {
  return (
    <div className="home-container">
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="achievements" className="section-container">
        <h2 className="section-title gradient-text animate-fade-in-up stagger-1">Our Achievements</h2>
        <AnimatedFace />
      </div>
      <div id="excecom" className="section-container">
        <h2 className="section-title gradient-text animate-fade-in-up stagger-1">EXCECOM</h2>
        <AnimatedFace />
      </div>
    </div>
  );
};

export default HomePage;
