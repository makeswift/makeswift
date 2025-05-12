import React, { createContext, useContext } from 'react';
import { ReactRuntime } from './runtime';

/**
 * Context for providing the ReactRuntime instance to components
 */
const ReactRuntimeContext = createContext<ReactRuntime | null>(null);

/**
 * Props for the ReactRuntimeProvider component
 */
interface ReactRuntimeProviderProps {
  /** The ReactRuntime instance */
  runtime: ReactRuntime;
  
  /** React children */
  children: React.ReactNode;
}

/**
 * Provider component for the ReactRuntime
 */
export function ReactRuntimeProvider({
  runtime,
  children,
}: ReactRuntimeProviderProps) {
  return (
    <ReactRuntimeContext.Provider value={runtime}>
      {children}
    </ReactRuntimeContext.Provider>
  );
}

/**
 * Hook to access the ReactRuntime instance
 */
export function useReactRuntime(): ReactRuntime {
  const runtime = useContext(ReactRuntimeContext);
  
  if (runtime === null) {
    throw new Error(
      'useReactRuntime must be used within a ReactRuntimeProvider'
    );
  }
  
  return runtime;
}