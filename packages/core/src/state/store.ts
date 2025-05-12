import {
  Store,
  Reducer,
  Middleware,
  Dispatch,
  GetState,
  CreateStoreOptions,
  Subscription,
  Action
} from './types';

/**
 * Creates a Redux-like store for state management
 */
export function createStore<State>(
  reducer: Reducer<State>,
  options: CreateStoreOptions<State> = {}
): Store<State> {
  // Initialize state
  let state = options.initialState !== undefined 
    ? options.initialState 
    : reducer(undefined as unknown as State, { type: '@@INIT' });
  
  // Active subscriptions
  const subscriptions: Subscription[] = [];
  
  // Basic store implementation
  const store: Store<State> = {
    getState: () => state,
    
    dispatch: (action: Action) => {
      // Update the state
      state = reducer(state, action);
      
      // Notify all active subscribers
      subscriptions.forEach(subscription => {
        if (subscription.active) {
          subscription.listener();
        }
      });
      
      return action;
    },
    
    subscribe: (listener: () => void) => {
      // Add the new subscription
      const subscription: Subscription = { listener, active: true };
      subscriptions.push(subscription);
      
      // Return an unsubscribe function
      return () => {
        subscription.active = false;
      };
    }
  };
  
  // Apply middlewares if provided
  if (options.middlewares && options.middlewares.length > 0) {
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: Action) => store.dispatch(action)
    };
    
    // Create a chain of middlewares
    const chain = options.middlewares.map(middleware => middleware(middlewareAPI));
    
    // Create enhanced dispatch function
    const dispatch = chain.reduce(
      (prevDispatch, middleware) => middleware(prevDispatch),
      store.dispatch
    );
    
    // Replace the store's dispatch with the enhanced version
    store.dispatch = dispatch;
  }
  
  // Initialize the store with an initial action
  store.dispatch({ type: '@@INIT' });
  
  return store;
}

/**
 * Combines multiple reducers into a single reducer
 */
export function combineReducers<State extends Record<string, any>>(
  reducers: Record<keyof State, Reducer<any>>
): Reducer<State> {
  return (state: State = {} as State, action: Action) => {
    const nextState: Partial<State> = {};
    let hasChanged = false;
    
    // Call each reducer with its own state slice
    Object.entries(reducers).forEach(([key, reducer]) => {
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      
      nextState[key as keyof State] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });
    
    // Return the old state if nothing changed, or the new state otherwise
    return hasChanged ? nextState as State : state;
  };
}

/**
 * Thunk middleware for handling async actions
 */
export function thunkMiddleware<State>(): Middleware<State> {
  return ({ dispatch, getState }) => next => action => {
    // If the action is a function, call it with dispatch and getState
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    
    // Otherwise, pass it to the next middleware or the reducer
    return next(action);
  };
}