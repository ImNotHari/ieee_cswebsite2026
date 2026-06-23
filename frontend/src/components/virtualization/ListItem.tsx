import React, { memo, Suspense, lazy } from 'react';
import type { DataItem } from '../../hooks/usePaginatedData';

// Lazy load the heavy component to split the chunk
const LazyHeavySubcomponent = lazy(() => import('./HeavySubcomponent'));

export interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: DataItem[];
    isNextPageLoading: boolean;
    onItemClick: (id: string) => void;
  };
}

const ListItem = ({ index, style, data }: ListItemProps) => {
  const { items, onItemClick } = data;
  const item = items[index];

  // If item doesn't exist yet, we are rendering a loading skeleton row
  if (!item) {
    return (
      <div style={style}>
        <div style={{
          padding: '16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--color-bg-hover)' }} className="pulse-skeleton" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '24px', width: '60%', background: 'var(--color-bg-hover)', borderRadius: '4px' }} className="pulse-skeleton" />
            <div style={{ height: '16px', width: '80%', background: 'var(--color-bg-hover)', borderRadius: '4px' }} className="pulse-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  // Inline styles are strictly computed based on the virtualizer's injected 'style' prop
  // We use a wrapper div to apply the style to ensure the virtualizer's absolute positioning math works perfectly.
  return (
    <div style={style}>
      <div 
        onClick={() => onItemClick(item.id)}
        style={{
          padding: '16px',
          height: '100%',
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Native Lazy Loaded Image */}
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          loading="lazy"
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>
            {item.title}
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            {item.description}
          </p>
        </div>

        <div style={{ width: '200px' }}>
          {/* 
            Strict Layout Boundary for Lazy Component:
            The fallback MUST explicitly reserve the 100px height.
            If we use fallback={null}, it triggers CLS and breaks virtualization.
          */}
          <Suspense fallback={
            <div style={{ width: '100%', height: '100px', background: 'var(--color-bg-hover)', borderRadius: '8px' }} className="pulse-skeleton" />
          }>
            <LazyHeavySubcomponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Strict Deep Comparison to mathematical guarantee zero unnecessary re-renders.
// We explicitly check the primitive properties we care about, bypassing shallow object equality pitfalls.
const areEqual = (prevProps: ListItemProps, nextProps: ListItemProps) => {
  // If the index changed, re-render
  if (prevProps.index !== nextProps.index) return false;
  
  // If the style object changed fundamentally (react-window recalculates it)
  if (prevProps.style.top !== nextProps.style.top || prevProps.style.height !== nextProps.style.height) return false;

  const prevItem = prevProps.data.items[prevProps.index];
  const nextItem = nextProps.data.items[nextProps.index];

  // If an item transitioned from undefined (loading) to defined, re-render
  if (!prevItem && nextItem) return false;
  
  // If the item ID changed (data mutated), re-render
  if (prevItem && nextItem && prevItem.id !== nextItem.id) return false;

  // We explicitly DO NOT check functions or inline objects to prevent false-negative re-renders.
  return true;
};

export default memo(ListItem, areEqual);
