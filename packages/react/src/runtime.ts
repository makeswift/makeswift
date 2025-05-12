/**
 * ReactRuntime provides the core functionality for React-based Makeswift implementations
 */

import { createStore } from './store';

/**
 * Breakpoint definition for responsive design
 */
export interface Breakpoint {
  /** Width in pixels for this breakpoint */
  width: number;
  
  /** Optional viewport width to simulate this breakpoint in builder */
  viewport?: number;
  
  /** Label for this breakpoint */
  label?: string;
}

/**
 * Options for configuring the ReactRuntime
 */
export interface ReactRuntimeOptions {
  /** Map of breakpoints for responsive design */
  breakpoints: Record<string, Breakpoint>;
}

/**
 * Component registration metadata
 */
export interface ComponentMeta {
  /** Unique type identifier for the component */
  type: string;
  
  /** Human-readable label for the component */
  label: string;
  
  /** Component prop definitions */
  props: Record<string, any>; // Will be defined in more detail
}

/**
 * ReactRuntime is the core class for React-based Makeswift implementations
 */
export class ReactRuntime {
  /** Redux store for state management */
  store: any; // Will be properly typed once store is implemented
  
  /** Map of registered components */
  private components = new Map<string, {
    component: React.ComponentType<any>;
    meta: ComponentMeta;
  }>();

  /**
   * Creates a new ReactRuntime instance
   */
  constructor(options: ReactRuntimeOptions) {
    this.store = createStore();
    this.setBreakpoints(options.breakpoints);
  }

  /**
   * Sets breakpoints in the store
   */
  private setBreakpoints(breakpoints: Record<string, Breakpoint>) {
    // In a real implementation, this would dispatch an action to the store
    console.log('Setting breakpoints:', breakpoints);
  }

  /**
   * Registers a component with the runtime
   */
  registerComponent(component: React.ComponentType<any>, meta: ComponentMeta) {
    this.components.set(meta.type, { component, meta });
    return this;
  }

  /**
   * Gets a registered component by type
   */
  getComponent(type: string) {
    return this.components.get(type);
  }

  /**
   * Gets all registered components
   */
  getComponents() {
    return Array.from(this.components.values());
  }
}