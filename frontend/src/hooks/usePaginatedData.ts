import { useState, useRef, useCallback, useEffect } from 'react';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const TOTAL_ITEMS = 10000;
const PAGE_SIZE = 100;

// Mock API Call
const mockFetchPage = async (pageIndex: number, signal: AbortSignal): Promise<DataItem[]> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }
      
      const startIndex = pageIndex * PAGE_SIZE;
      const items: DataItem[] = [];
      const end = Math.min(startIndex + PAGE_SIZE, TOTAL_ITEMS);
      
      for (let i = startIndex; i < end; i++) {
        items.push({
          id: `item-${i}`,
          title: `Virtualized Item #${i}`,
          description: `This is the description for item ${i}. It is rendered inside a highly performant virtualized list.`,
          // Generate a predictable but varied image URL based on index
          imageUrl: `https://picsum.photos/seed/${i}/100/100`
        });
      }
      resolve(items);
    }, 400); // Simulate network latency
    
    signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
  });
};

export function usePaginatedData() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  
  // Strict lock for synchronous race-condition prevention
  const isFetchingRef = useRef(false);
  const pageIndexRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadMoreItems = useCallback(async () => {
    // 1. Synchronous lock check prevents duplicate concurrent calls
    if (isFetchingRef.current || !hasNextPage) return;
    
    isFetchingRef.current = true;
    setIsNextPageLoading(true);

    // 2. Abort Controller to mathematically prevent stale overwrites
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const newItems = await mockFetchPage(pageIndexRef.current, abortControllerRef.current.signal);
      
      setItems((prev) => [...prev, ...newItems]);
      pageIndexRef.current += 1;
      
      if (pageIndexRef.current * PAGE_SIZE >= TOTAL_ITEMS) {
        setHasNextPage(false);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load items:', error);
      }
    } finally {
      // Release lock
      isFetchingRef.current = false;
      setIsNextPageLoading(false);
    }
  }, [hasNextPage]);

  // Initial load
  useEffect(() => {
    loadMoreItems();
    
    // Cleanup aborts any in-flight requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadMoreItems]);

  return { items, hasNextPage, isNextPageLoading, loadMoreItems };
}
