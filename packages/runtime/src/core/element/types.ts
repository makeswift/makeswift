/**
 * Types for element data in Makeswift
 */

/**
 * The data structure for an element
 */
export interface ElementData {
  /** Unique identifier for the element */
  key: string;
  
  /** The type of element (e.g. 'Box', 'Text', 'Image') */
  type: string;
  
  /** Props for the element */
  props: Record<string, any>;
  
  /** Children elements (for container elements) */
  children?: ElementData[];
}

/**
 * A reference to a global element
 */
export interface ElementReference {
  /** Indicates this is a reference to another element */
  __type: 'ElementReference';
  
  /** The ID of the referenced element */
  value: string;
}

/**
 * Union type for elements or element references
 */
export type Element = ElementData | ElementReference;

/**
 * Document representing a page
 */
export interface Document {
  /** Unique identifier for the document */
  key: string;
  
  /** The root element of the document */
  rootElement: Element;
  
  /** The locale of the document (null for default locale) */
  locale: string | null;
}

/**
 * Type guard to check if an element is an element reference
 */
export function isElementReference(element: Element): element is ElementReference {
  return (
    typeof element === 'object' &&
    element !== null &&
    (element as any).__type === 'ElementReference'
  );
}

/**
 * Type guard to check if an element is element data
 */
export function isElementData(element: Element): element is ElementData {
  return !isElementReference(element);
}

/**
 * Creates a base document with a single root element
 */
export function createBaseDocument(rootElement: Element, key = 'root', locale: string | null = null): Document {
  return {
    key,
    rootElement,
    locale,
  };
}