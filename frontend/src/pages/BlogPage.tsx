import AnimatedFace from '../components/AnimatedFace';

const BlogPage = () => {
  return (
    <div className="page-container" style={{ padding: 'calc(var(--nav-height) + 4rem) 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text animate-fade-in-up stagger-1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Blog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="animate-fade-in-up stagger-2">
          Stories, tutorials, and insights from our community.
        </p>
      </div>
      <div style={{ transform: 'scale(0.8)', margin: '4rem auto' }}>
        <AnimatedFace />
      </div>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginTop: '-2rem' }} className="animate-fade-in-up stagger-2">Coming Soon...</p>
    </div>
  );
};

export default BlogPage;
