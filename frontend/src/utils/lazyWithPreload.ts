import { lazy } from 'react';
import type { ComponentType } from 'react';

export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory) as any;
  Component.preload = factory;
  return Component;
}
