/**
 * Core types for state management
 */

/**
 * Base action type for all actions
 */
export interface Action {
  type: string;
}

/**
 * Function that dispatches an action
 */
export type Dispatch = (action: Action) => Action;

/**
 * Function that returns the current state
 */
export type GetState<State> = () => State;

/**
 * A reducer is a function that takes the current state and an action,
 * and returns a new state
 */
export type Reducer<State> = (state: State, action: Action) => State;

/**
 * A middleware adds extra functionality to the dispatch process
 */
export type Middleware<State> = (
  store: { getState: GetState<State>; dispatch: Dispatch }
) => (next: Dispatch) => (action: Action) => Action;

/**
 * A store holds the application state and provides methods to interact with it
 */
export interface Store<State> {
  /** Gets the current state */
  getState: GetState<State>;
  
  /** Dispatches an action to update the state */
  dispatch: Dispatch;
  
  /** Adds a listener that will be called when the state changes */
  subscribe: (listener: () => void) => () => void;
}

/**
 * Options for creating a store
 */
export interface CreateStoreOptions<State> {
  /** Initial state for the store */
  initialState?: State;
  
  /** Middlewares to apply to the store */
  middlewares?: Middleware<State>[];
  
  /** Whether to enable Redux DevTools Extension if available */
  devTools?: boolean;
}

/**
 * Type for tracking subscriptions to the store
 */
export interface Subscription {
  /** The listener function to call */
  listener: () => void;
  
  /** Whether the subscription is active */
  active: boolean;
}