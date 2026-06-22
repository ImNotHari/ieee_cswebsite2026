import { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AnimatedFace from '../components/AnimatedFace';
// @ts-ignore
import ProfileCard from '../components/ProfileCard';

const excecomMembers = [
  { name: "John Doe", role: "Chairperson" },
  { name: "Jane Smith", role: "Vice Chairperson" },
  { name: "Alice Johnson", role: "Secretary" },
  { name: "Bob Williams", role: "Vice Secretary" },
  { name: "Charlie Brown", role: "Technical Co-ordinator" },
  { name: "Diana Prince", role: "WIC" },
];

const HomePage = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== '#' && !hash.startsWith('#/')) {
      // The hash corresponds to an ID like #about or #excecom
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure the DOM has fully rendered the sections
    }
  }, [window.location.hash]);

  return (
    <div className="home-container">
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="achievements" className="section-container">
        <h2 className="section-title gradient-text animate-fade-in-up stagger-1">Our Achievements</h2>
        <div style={{ transform: 'scale(0.8)', margin: '2rem auto' }}><AnimatedFace /></div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-2rem' }} className="animate-fade-in-up stagger-2">Coming Soon...</p>
      </div>
      <div id="excecom" className="section-container">
        <h2 className="section-title gradient-text animate-fade-in-up stagger-1">EXCECOM</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', marginTop: '3rem' }}>
          
          {/* Chairperson Row */}
          <div className="animate-fade-in-up stagger-2" style={{ transform: 'scale(1.15)', zIndex: 2 }}>
            <ProfileCard
              name={excecomMembers[0].name}
              title={excecomMembers[0].role}
              avatarUrl={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(excecomMembers[0].name)}&backgroundColor=transparent`}
              showUserInfo={false}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowEnabled={true}
              innerGradient="linear-gradient(145deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.02) 100%)"
              behindGlowColor="rgba(255, 215, 0, 0.4)"
            />
          </div>

          {/* Rest of Excecom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
            {/* Row 2: 3 members */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              {excecomMembers.slice(1, 4).map((person, index) => (
                <div key={index} className={`animate-fade-in-up stagger-${(index % 4) + 3}`}>
                  <ProfileCard
                    name={person.name}
                    title={person.role}
                    avatarUrl={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(person.name)}&backgroundColor=transparent`}
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    behindGlowEnabled={true}
                    innerGradient="linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)"
                  />
                </div>
              ))}
            </div>
            {/* Row 3: 2 members */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              {excecomMembers.slice(4).map((person, index) => (
                <div key={index + 3} className={`animate-fade-in-up stagger-${((index + 3) % 4) + 3}`}>
                  <ProfileCard
                    name={person.name}
                    title={person.role}
                    avatarUrl={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(person.name)}&backgroundColor=transparent`}
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    behindGlowEnabled={true}
                    innerGradient="linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

