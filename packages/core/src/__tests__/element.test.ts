import {
  ElementData,
  ElementReference,
  Document,
  isElementReference,
  isElementData,
  createBaseDocument
} from '../element/types';

describe('Element types', () => {
  describe('isElementReference', () => {
    it('should return true for element references', () => {
      const reference: ElementReference = {
        __type: 'ElementReference',
        value: 'global-element-id',
      };
      
      expect(isElementReference(reference)).toBe(true);
    });
    
    it('should return false for element data', () => {
      const data: ElementData = {
        key: 'element-key',
        type: 'Box',
        props: {},
      };
      
      expect(isElementReference(data)).toBe(false);
    });
    
    it('should return false for null or undefined', () => {
      // @ts-expect-error - testing invalid input
      expect(isElementReference(null)).toBe(false);
      
      // @ts-expect-error - testing invalid input
      expect(isElementReference(undefined)).toBe(false);
    });
  });
  
  describe('isElementData', () => {
    it('should return true for element data', () => {
      const data: ElementData = {
        key: 'element-key',
        type: 'Box',
        props: {},
      };
      
      expect(isElementData(data)).toBe(true);
    });
    
    it('should return false for element references', () => {
      const reference: ElementReference = {
        __type: 'ElementReference',
        value: 'global-element-id',
      };
      
      expect(isElementData(reference)).toBe(false);
    });
  });
  
  describe('createBaseDocument', () => {
    it('should create a document with a root element', () => {
      const element: ElementData = {
        key: 'element-key',
        type: 'Box',
        props: {},
      };
      
      const document = createBaseDocument(element);
      
      expect(document).toEqual({
        key: 'root',
        rootElement: element,
        locale: null,
      });
    });
    
    it('should use provided key and locale', () => {
      const element: ElementData = {
        key: 'element-key',
        type: 'Box',
        props: {},
      };
      
      const document = createBaseDocument(element, 'custom-key', 'en-US');
      
      expect(document).toEqual({
        key: 'custom-key',
        rootElement: element,
        locale: 'en-US',
      });
    });
    
    it('should work with element references', () => {
      const reference: ElementReference = {
        __type: 'ElementReference',
        value: 'global-element-id',
      };
      
      const document = createBaseDocument(reference);
      
      expect(document).toEqual({
        key: 'root',
        rootElement: reference,
        locale: null,
      });
    });
  });
});