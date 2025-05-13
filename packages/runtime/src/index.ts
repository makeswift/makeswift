/**
 * Main exports for @makeswift/runtime
 */

// Keep existing exports for backward compatibility
export type { Action, SetBreakpointsAction } from './state/actions'
export {
  ActionTypes,
  changeDocument,
  changeDocumentElementScrollTop,
  cleanUp,
  init,
  messageHostPropController,
  changeApiResource,
  evictApiResource,
  registerDocument,
  scrollDocumentElement,
  unregisterDocument,
  setBuilderEditMode,
  builderPointerMove,
  setBreakpoints,
  setLocale,
  setLocalizedResourceId,
} from './state/actions'
export type { Operation } from './state/modules/read-write-documents'
export type { ComponentMeta } from './state/modules/components-meta'
export { ComponentIcon } from './state/modules/components-meta'
export type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from './prop-controllers'
export type { Element } from './state/react-page'
export { createBaseDocument } from './state/react-page'
export { MakeswiftComponentType } from './components/builtin/constants'

// Export new consolidated structure
// Export core functionality
export * from './core';

// Export React functionality
export * from './react';

// Create convenience exports for common imports
export { MakeswiftAdapter, MakeswiftSiteVersion } from './core/adapter';
export { Makeswift } from './core/api';
export { ReactRuntime } from './react/runtime';
export { ReactRuntimeProvider } from './react/runtime-provider';