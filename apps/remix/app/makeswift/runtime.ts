/**
 * Makeswift runtime configuration
 * 
 * This file creates a runtime implementation for Makeswift that works
 * in both server and browser contexts.
 */
import { ReactRuntime } from '@makeswift/runtime/react';
import React, { memo } from 'react';

// Create runtime instance with breakpoints for responsive design
export const runtime = new ReactRuntime({
  breakpoints: {
    // Each breakpoint needs a width except "desktop" which is the base breakpoint
    // The desktop breakpoint MUST be last in the order
    mobile: { width: 390, label: 'Mobile' },
    tablet: { width: 768, label: 'Tablet' },
    laptop: { width: 1024, label: 'Laptop' },
    // Desktop must be the base breakpoint and not have a width specified
    desktop: { label: 'Desktop' },
  },
});

// Cache for component renderers to avoid recreating on each render
const rendererCache = new Map();

// Custom renderer functions
const createErrorElement = (error) => {
  // Create error element manually without JSX
  return React.createElement('div', 
    { style: { padding: '1rem', color: 'red' } },
    React.createElement('h2', null, 'Error Rendering Page'),
    React.createElement('p', null, error instanceof Error ? error.message : String(error))
  );
};

const createFragmentElement = (element, cache = new Map()) => {
  // Create fragment container manually without JSX
  return React.createElement(React.Fragment, null,
    element.children?.map(child => renderElement(child, cache))
  );
};

const createUnknownTypeElement = (element) => {
  // Create unknown type element manually without JSX
  return React.createElement('div', 
    { 
      style: { padding: '0.5rem', margin: '0.5rem', border: '1px dashed #ccc' }
    },
    React.createElement('p', null, `Unknown component type: ${element.type}`)
  );
};

// Helper function to generate a deterministic key for an element
function getElementKey(element, index) {
  return `${element.type}-${index}`;
}

// Helper function to render Makeswift elements
function renderElement(element, cache = new Map(), index = 0) {
  if (!element) return null;
  
  // Check if we already have this element in cache
  const cacheKey = element.id || getElementKey(element, index);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  let renderedElement;
  
  // Handle fragment type (container for other elements)
  if (element.type === 'fragment') {
    renderedElement = createFragmentElement(element, cache);
  }
  // Handle any registered component type
  else {
    const Component = runtime._components.get(element.type)?.component;
    if (Component) {
      renderedElement = React.createElement(Component, {
        key: cacheKey,
        ...element.props
      });
    } else {
      // Unknown element type
      renderedElement = createUnknownTypeElement(element);
    }
  }
  
  // Add to cache for future use
  cache.set(cacheKey, renderedElement);
  
  return renderedElement;
}

// Add browser-safe methods to the runtime
runtime.createPageRenderer = function createPageRenderer(snapshot) {
  if (!snapshot || !snapshot.document || !snapshot.document.root) {
    throw new Error('Invalid page snapshot');
  }
  
  // Check if we already have a renderer for this snapshot
  const snapshotId = snapshot.id || 'dynamic-page';
  
  if (rendererCache.has(snapshotId)) {
    return rendererCache.get(snapshotId);
  }
  
  // Create a memoized component that renders the snapshot
  const PageRenderer = memo(function PageRenderer() {
    try {
      // Find the root element in the snapshot
      const root = snapshot.document.root;
      
      // Create cache for this render pass
      const elementCache = new Map();
      
      // Render the components from the snapshot's root
      return renderElement(root, elementCache);
    } catch (error) {
      console.error('Error rendering page:', error);
      return createErrorElement(error);
    }
  });
  
  // Cache the renderer for future use
  rendererCache.set(snapshotId, PageRenderer);
  
  return PageRenderer;
};

// Import component registrations
// This needs to be imported after the runtime is initialized
import './components';