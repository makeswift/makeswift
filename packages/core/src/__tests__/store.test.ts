import { Action, Middleware } from '../state/types';
import { createStore, combineReducers, thunkMiddleware } from '../state/store';

describe('Store', () => {
  describe('createStore', () => {
    it('should create a store with initial state', () => {
      const initialState = { count: 0 };
      const reducer = (state = initialState, action: Action) => {
        if (action.type === 'INCREMENT') {
          return { ...state, count: state.count + 1 };
        }
        return state;
      };
      
      const store = createStore(reducer, { initialState });
      
      expect(store.getState()).toEqual({ count: 0 });
    });
    
    it('should update state when dispatching actions', () => {
      const initialState = { count: 0 };
      const reducer = (state = initialState, action: Action) => {
        if (action.type === 'INCREMENT') {
          return { ...state, count: state.count + 1 };
        }
        return state;
      };
      
      const store = createStore(reducer, { initialState });
      
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toEqual({ count: 1 });
      
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toEqual({ count: 2 });
    });
    
    it('should notify subscribers when state changes', () => {
      const initialState = { count: 0 };
      const reducer = (state = initialState, action: Action) => {
        if (action.type === 'INCREMENT') {
          return { ...state, count: state.count + 1 };
        }
        return state;
      };
      
      const store = createStore(reducer, { initialState });
      
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);
      
      // Dispatch should trigger the listener
      store.dispatch({ type: 'INCREMENT' });
      expect(listener).toHaveBeenCalledTimes(1);
      
      // Unsubscribe should stop notifications
      unsubscribe();
      store.dispatch({ type: 'INCREMENT' });
      expect(listener).toHaveBeenCalledTimes(1); // Still just once
    });
    
    it('should apply middlewares', () => {
      const initialState = { count: 0 };
      const reducer = (state = initialState, action: Action) => {
        if (action.type === 'INCREMENT') {
          return { ...state, count: state.count + 1 };
        }
        return state;
      };
      
      // Logging middleware that tracks actions
      const actionLog: string[] = [];
      const loggingMiddleware: Middleware<{ count: number }> = () => next => action => {
        actionLog.push(action.type);
        return next(action);
      };
      
      const store = createStore(reducer, {
        initialState,
        middlewares: [loggingMiddleware],
      });
      
      store.dispatch({ type: 'INCREMENT' });
      expect(actionLog).toContain('INCREMENT');
      expect(store.getState()).toEqual({ count: 1 });
    });
  });
  
  describe('combineReducers', () => {
    it('should combine multiple reducers', () => {
      // Counter reducer
      const counterReducer = (state = { value: 0 }, action: Action) => {
        if (action.type === 'INCREMENT') {
          return { ...state, value: state.value + 1 };
        }
        return state;
      };
      
      // Todo reducer
      const todoReducer = (state = { items: [] }, action: any) => {
        if (action.type === 'ADD_TODO') {
          return { ...state, items: [...state.items, action.text] };
        }
        return state;
      };
      
      // Combined reducer
      const rootReducer = combineReducers({
        counter: counterReducer,
        todos: todoReducer,
      });
      
      const store = createStore(rootReducer);
      
      // Initial state
      expect(store.getState()).toEqual({
        counter: { value: 0 },
        todos: { items: [] },
      });
      
      // Increment counter
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toEqual({
        counter: { value: 1 },
        todos: { items: [] },
      });
      
      // Add todo
      store.dispatch({ type: 'ADD_TODO', text: 'Learn Redux' });
      expect(store.getState()).toEqual({
        counter: { value: 1 },
        todos: { items: ['Learn Redux'] },
      });
    });
  });
  
  describe('thunkMiddleware', () => {
    it('should handle async actions', async () => {
      // Reducer
      const reducer = (state = { value: 0 }, action: any) => {
        if (action.type === 'SET_VALUE') {
          return { ...state, value: action.value };
        }
        return state;
      };
      
      // Create store with thunk middleware
      const store = createStore(reducer, {
        middlewares: [thunkMiddleware()],
      });
      
      // Async action creator
      const asyncAction = (dispatch: any) => {
        // Return a Promise for testing purposes
        return new Promise<void>(resolve => {
          setTimeout(() => {
            dispatch({ type: 'SET_VALUE', value: 42 });
            resolve();
          }, 10);
        });
      };
      
      // Initial state
      expect(store.getState()).toEqual({ value: 0 });
      
      // Dispatch the async action and wait for it to resolve
      await store.dispatch(asyncAction as any);
      
      // State should be updated
      expect(store.getState()).toEqual({ value: 42 });
    });
  });
});