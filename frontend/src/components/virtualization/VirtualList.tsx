import { useRef, useMemo, useCallback } from 'react';
import { List } from 'react-window';
import ListItem from './ListItem';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import type { DataItem } from '../../hooks/usePaginatedData';

interface VirtualListProps {
  items: DataItem[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadMoreItems: () => void;
}

const ITEM_HEIGHT = 140; // Rigid deterministic height

const VirtualList = ({ items, hasNextPage, isNextPageLoading, loadMoreItems }: VirtualListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Resize Handling is natively handled by List component in v2
  // 2. Infinite Scroll Trigger via onRowsRendered
  const handleRowsRendered = useCallback(({ stopIndex }: { stopIndex: number }) => {
    if (stopIndex >= items.length - 5) {
      loadMoreItems();
    }
  }, [items.length, loadMoreItems]);

  const handleItemClick = useCallback((id: string) => {
    console.log(`Clicked virtual item: ${id}`);
  }, []);

  const rowProps = useMemo(() => ({
    items,
    isNextPageLoading,
    onItemClick: handleItemClick
  }), [items, isNextPageLoading, handleItemClick]);

  const rowCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <List
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT}
        rowProps={rowProps}
        rowComponent={ListItem}
        onRowsRendered={handleRowsRendered}
        overscanCount={5}
        style={{ overflowX: 'hidden' }}
      />
    </div>
  );
};

export default VirtualList;
