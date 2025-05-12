/**
 * Redux store setup for Makeswift React runtime
 */

/**
 * Creates the Redux store for the runtime
 */
export function createStore() {
  // This is a stub - in a real implementation, this would create a Redux store
  // with the appropriate reducers and middleware
  return {
    getState: () => ({}),
    dispatch: (action: any) => action,
    subscribe: (listener: () => void) => {
      return () => {};
    },
  };
}