import React from 'react';
import { Element, ElementData, isElementData, isElementReference } from '../../core/element';
import { useReactRuntime } from '../runtime-provider';

/**
 * Props for the ElementRenderer component
 */
interface ElementRendererProps {
  /** The element to render */
  element: Element;
  
  /** Optional component overrides */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Renders a Makeswift element
 */
export function ElementRenderer({ element, components = {} }: ElementRendererProps) {
  const runtime = useReactRuntime();
  
  // Handle element references (in a real implementation, this would fetch 
  // and render the referenced element)
  if (isElementReference(element)) {
    return <div>Reference to element: {element.value}</div>;
  }
  
  // Handle element data
  if (isElementData(element)) {
    return renderElementData(element, runtime, components);
  }
  
  // This should never happen if the type guards are correct
  return null;
}

/**
 * Renders element data (not a reference)
 */
function renderElementData(
  element: ElementData,
  runtime: any, // Will be properly typed once runtime is fully implemented
  components: Record<string, React.ComponentType<any>>,
) {
  const { type, props, children } = element;
  
  // Try to get the component from the provided components or from the runtime
  const registeredComponent = runtime.getComponent(type);
  const Component = components[type] || 
    (registeredComponent ? registeredComponent.component : null);
  
  // If no component is found, render a placeholder
  if (!Component) {
    return (
      <div data-makeswift-element-type={type} data-makeswift-element-id={element.key}>
        Component not found: {type}
      </div>
    );
  }
  
  // Prepare props for the component
  const componentProps = {
    ...props,
    key: element.key,
    id: element.key,
    'data-makeswift-element-id': element.key,
    'data-makeswift-element-type': type,
  };
  
  // If the element has children, render them
  if (children && Array.isArray(children)) {
    return (
      <Component {...componentProps}>
        {children.map(child => (
          <ElementRenderer key={child.key} element={child} components={components} />
        ))}
      </Component>
    );
  }
  
  // Otherwise just render the component with its props
  return <Component {...componentProps} />;
}