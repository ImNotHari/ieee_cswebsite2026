import AnimatedFace from '../components/AnimatedFace';

const GalleryPage = () => {
  return (
    <div className="page-container" style={{ padding: 'calc(var(--nav-height) + 4rem) 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title gradient-text animate-fade-in-up stagger-1">Gallery</h1>
        <p className="animate-fade-in-up stagger-2" style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-1rem', marginBottom: '4rem' }}>
          Explore our memorable moments.
        </p>
      </div>
      <div style={{ transform: 'scale(0.8)', margin: '4rem auto' }}>
        <AnimatedFace />
      </div>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-2rem' }} className="animate-fade-in-up stagger-2">Coming Soon...</p>
    </div>
  );
};

export default GalleryPage;
