import React from 'react';
import { render, screen } from '@testing-library/react';
import { ElementRenderer } from '../element/renderer';
import { ElementData, ElementReference } from '@makeswift/core';
import { ReactRuntimeProvider } from '../runtime-provider';
import { ReactRuntime } from '../runtime';

// Mock the runtime context
jest.mock('../runtime-provider', () => ({
  useReactRuntime: jest.fn(() => ({
    getComponent: jest.fn((type) => {
      if (type === 'TestComponent') {
        return {
          component: ({ children, ...props }: any) => (
            <div data-testid="test-component" {...props}>
              {children}
            </div>
          ),
          meta: { type, label: 'Test Component', props: {} },
        };
      }
      return null;
    }),
  })),
  ReactRuntimeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ElementRenderer', () => {
  it('should render element data correctly', () => {
    const element: ElementData = {
      key: 'test-element',
      type: 'TestComponent',
      props: { className: 'test-class' },
    };

    render(<ElementRenderer element={element} />);

    const component = screen.getByTestId('test-component');
    expect(component).toBeInTheDocument();
    expect(component).toHaveAttribute('class', 'test-class');
    expect(component).toHaveAttribute('data-makeswift-element-id', 'test-element');
    expect(component).toHaveAttribute('data-makeswift-element-type', 'TestComponent');
  });

  it('should render children correctly', () => {
    const element: ElementData = {
      key: 'parent-element',
      type: 'TestComponent',
      props: {},
      children: [
        {
          key: 'child-element',
          type: 'TestComponent',
          props: { className: 'child-class' },
        },
      ],
    };

    render(<ElementRenderer element={element} />);

    const parent = screen.getByTestId('test-component');
    expect(parent).toBeInTheDocument();

    const child = screen.getByTestId('test-component');
    expect(child).toBeInTheDocument();
    expect(child).toHaveAttribute('data-makeswift-element-id', 'child-element');
  });

  it('should render a placeholder for unknown component types', () => {
    const element: ElementData = {
      key: 'unknown-element',
      type: 'UnknownComponent',
      props: {},
    };

    render(<ElementRenderer element={element} />);

    const placeholder = screen.getByText('Component not found: UnknownComponent');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('data-makeswift-element-type', 'UnknownComponent');
    expect(placeholder).toHaveAttribute('data-makeswift-element-id', 'unknown-element');
  });

  it('should use component overrides when provided', () => {
    const element: ElementData = {
      key: 'override-element',
      type: 'OverrideComponent',
      props: {},
    };

    const components = {
      OverrideComponent: () => <div data-testid="override-component">Override Component</div>,
    };

    render(<ElementRenderer element={element} components={components} />);

    const component = screen.getByTestId('override-component');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Override Component');
  });

  it('should handle element references', () => {
    const element: ElementReference = {
      __type: 'ElementReference',
      value: 'global-element-id',
    };

    render(<ElementRenderer element={element} />);

    const reference = screen.getByText('Reference to element: global-element-id');
    expect(reference).toBeInTheDocument();
  });
});