import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Store, createStore } from '@makeswift/core';
import { StoreProvider, useSelector, useDispatch, usePrevious } from '../state/hooks';

// Simple counter reducer
const counterReducer = (state = { count: 0 }, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

describe('State Hooks', () => {
  let store: Store<{ count: number }>;
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = createStore(counterReducer, { initialState: { count: 0 } });
  });
  
  describe('useSelector', () => {
    it('should select state from the store', () => {
      // Component that uses useSelector
      const TestComponent = () => {
        const count = useSelector<{ count: number }, number>(state => state.count);
        return <div data-testid="count">{count}</div>;
      };
      
      render(
        <StoreProvider store={store}>
          <TestComponent />
        </StoreProvider>
      );
      
      // Check that the initial state is rendered
      expect(screen.getByTestId('count')).toHaveTextContent('0');
      
      // Dispatch an action to update the state
      store.dispatch({ type: 'INCREMENT' });
      
      // Check that the component re-renders with the new state
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });
  
  describe('useDispatch', () => {
    it('should dispatch actions to the store', () => {
      // Component that uses useDispatch and useSelector
      const TestComponent = () => {
        const count = useSelector<{ count: number }, number>(state => state.count);
        const dispatch = useDispatch();
        
        return (
          <div>
            <div data-testid="count">{count}</div>
            <button data-testid="increment" onClick={() => dispatch({ type: 'INCREMENT' })}>
              Increment
            </button>
            <button data-testid="decrement" onClick={() => dispatch({ type: 'DECREMENT' })}>
              Decrement
            </button>
          </div>
        );
      };
      
      render(
        <StoreProvider store={store}>
          <TestComponent />
        </StoreProvider>
      );
      
      // Check initial state
      expect(screen.getByTestId('count')).toHaveTextContent('0');
      
      // Click the increment button
      fireEvent.click(screen.getByTestId('increment'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      
      // Click the decrement button
      fireEvent.click(screen.getByTestId('decrement'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
  
  describe('usePrevious', () => {
    it('should remember the previous value', () => {
      // Component that uses usePrevious
      const TestComponent = () => {
        const count = useSelector<{ count: number }, number>(state => state.count);
        const prevCount = usePrevious(count);
        const dispatch = useDispatch();
        
        return (
          <div>
            <div data-testid="count">{count}</div>
            <div data-testid="prev-count">{prevCount ?? 'undefined'}</div>
            <button data-testid="increment" onClick={() => dispatch({ type: 'INCREMENT' })}>
              Increment
            </button>
          </div>
        );
      };
      
      render(
        <StoreProvider store={store}>
          <TestComponent />
        </StoreProvider>
      );
      
      // Initially, prevCount should be undefined
      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(screen.getByTestId('prev-count')).toHaveTextContent('undefined');
      
      // After increment, prevCount should be 0
      fireEvent.click(screen.getByTestId('increment'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('prev-count')).toHaveTextContent('0');
      
      // After another increment, prevCount should be 1
      fireEvent.click(screen.getByTestId('increment'));
      expect(screen.getByTestId('count')).toHaveTextContent('2');
      expect(screen.getByTestId('prev-count')).toHaveTextContent('1');
    });
  });
  
  describe('StoreProvider', () => {
    it('should throw an error when hooks are used outside provider', () => {
      // Suppress console.error for this test
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Component that uses useSelector outside StoreProvider
      const TestComponent = () => {
        const count = useSelector<{ count: number }, number>(state => state.count);
        return <div>{count}</div>;
      };
      
      // Render should throw
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useStore must be used within a StoreProvider');
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
});