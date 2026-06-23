import { useState, useEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * useResizeObserver
 * Efficiently tracks the physical dimensions of a container using native ResizeObserver.
 * Strictly avoids synchronous layout reads (getBoundingClientRect) to prevent layout thrashing.
 */
export function useResizeObserver(ref: RefObject<HTMLElement>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    // We rely solely on the ResizeObserver callback to provide dimensions, 
    // mathematically guaranteeing zero synchronous layout reads during render cycles.
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      // Only trigger re-render if dimensions actually changed
      setSize((prev) => {
        if (prev.width === width && prev.height === height) return prev;
        return { width, height };
      });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
