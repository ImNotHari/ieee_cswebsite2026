import { usePaginatedData } from '../hooks/usePaginatedData';
import VirtualList from '../components/virtualization/VirtualList';

const VirtualizationDemoPage = () => {
  // 1. Strict Data Layer Separation
  const { items, hasNextPage, isNextPageLoading, loadMoreItems } = usePaginatedData();

  return (
    <div className="page-container" style={{ padding: 'calc(var(--nav-height) + 2rem) 2rem 2rem 2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text animate-fade-in-up" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Performance Virtualization
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="animate-fade-in-up stagger-1">
          Rendering 10,000+ items at 60 FPS using React Window, Strict Memoization, and Intersection Observer Infinite Scrolling.
          Currently loaded: <strong style={{ color: 'var(--primary-color)' }}>{items.length}</strong> items.
        </p>
      </div>

      {/* 
        The VirtualList container MUST have a bounded height for virtualization to work.
        We use flex: 1 to fill the remaining vertical space of the screen.
      */}
      <div 
        className="animate-fade-in-up stagger-2"
        style={{ 
          flex: 1, 
          background: 'rgba(0,0,0,0.4)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <VirtualList 
          items={items}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadMoreItems={loadMoreItems}
        />
      </div>
    </div>
  );
};

export default VirtualizationDemoPage;
