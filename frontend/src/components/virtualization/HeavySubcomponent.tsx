import { useEffect, useState } from 'react';

// Simulating a heavy third-party library or complex chart
const HeavySubcomponent = () => {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    // Simulate complex calculation or heavy render
    const heavyWork = Array.from({ length: 50 }, () => Math.random() * 100);
    setData(heavyWork);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100px', // MUST precisely match Suspense fallback height
      background: 'var(--color-bg-secondary)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
        {data.map((val, i) => (
          <div 
            key={i} 
            style={{ 
              width: '4px', 
              height: `${val}%`, 
              background: 'var(--accent-color)',
              opacity: 0.7 
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default HeavySubcomponent;
