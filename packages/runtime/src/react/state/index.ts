/**
 * State management utilities for React
 */

import { useReactRuntime } from '../runtime-provider';

/**
 * Hook to access store state
 */
export function useSelector<T>(selector: (state: any) => T): T {
  const runtime = useReactRuntime();
  return selector(runtime.store.getState());
}

/**
 * Hook to access store dispatch
 */
export function useDispatch() {
  const runtime = useReactRuntime();
  return runtime.store.dispatch;
}