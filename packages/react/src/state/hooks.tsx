import React, { useContext, useEffect, useRef, useState } from 'react';
import { Action, Store } from '@makeswift/core';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

// Create a context for the store
const StoreContext = React.createContext<Store<any> | null>(null);

/**
 * Provider component for the Redux-like store
 */
export function StoreProvider({
  store,
  children,
}: {
  store: Store<any>;
  children: React.ReactNode;
}) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/**
 * Hook to access the store
 */
export function useStore<State>(): Store<State> {
  const store = useContext(StoreContext);
  
  if (store === null) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  
  return store as Store<State>;
}

/**
 * Hook to access the dispatch function
 */
export function useDispatch<A extends Action = Action>(): (action: A) => A {
  const store = useStore();
  return store.dispatch as (action: A) => A;
}

/**
 * Hook to get the current state
 */
export function useSelector<State, Selected>(
  selector: (state: State) => Selected
): Selected {
  const store = useStore<State>();
  
  // Use external store to subscribe to changes
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

/**
 * Hook that subscribes to store changes and forces a re-render
 */
export function useStoreChanges(): void {
  const store = useStore();
  const [, setForceUpdate] = useState({});
  
  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      // Force a re-render when the store changes
      setForceUpdate({});
    });
    
    return unsubscribe;
  }, [store]);
}

/**
 * Hook to get the previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}