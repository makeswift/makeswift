/**
 * Types for the Makeswift API client
 */

/**
 * Represents different types of API resources
 */
export enum APIResourceType {
  Swatch = 'Swatch',
  File = 'File',
  Typography = 'Typography',
  Table = 'Table',
  PagePathnameSlice = 'PagePathnameSlice',
  GlobalElement = 'GlobalElement',
  LocalizedGlobalElement = 'LocalizedGlobalElement',
}

/**
 * Represents a resource in the API cache
 */
export interface APIResource<T> {
  id: string;
  value: T | null;
  locale?: string | null;
}

/**
 * Represents a file resource
 */
export interface File {
  id: string;
  name: string;
  publicUrl: string;
  mimetype: string;
  extension: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a swatch (color) resource
 */
export interface Swatch {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a typography style resource
 */
export interface TypographyStyle {
  breakpoint: string;
  value: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    letterSpacing?: string;
    lineHeight?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDecoration?: string;
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    color?: {
      swatchId?: string;
      value?: string;
    };
  };
}

/**
 * Represents a typography resource
 */
export interface Typography {
  id: string;
  name: string;
  style: TypographyStyle[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a table resource
 */
export interface Table {
  id: string;
  name: string;
  data: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a page pathname slice resource
 */
export interface PagePathnameSlice {
  id: string;
  basePageId: string;
  pathname: string;
  localizedPathname: string | null;
  __typename: 'PagePathnameSlice';
}

/**
 * Represents a global element resource
 */
export interface GlobalElement {
  id: string;
  name: string;
  data: any; // Element data structure
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a localized global element resource
 */
export interface LocalizedGlobalElement {
  id: string;
  globalElementId: string;
  data: any; // Element data structure
  locale: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the cache data for API resources
 */
export interface CacheData {
  apiResources: {
    [APIResourceType.Swatch]: APIResource<Swatch>[];
    [APIResourceType.File]: APIResource<File>[];
    [APIResourceType.Typography]: APIResource<Typography>[];
    [APIResourceType.Table]: APIResource<Table>[];
    [APIResourceType.PagePathnameSlice]: APIResource<PagePathnameSlice>[];
    [APIResourceType.GlobalElement]: APIResource<GlobalElement>[];
    [APIResourceType.LocalizedGlobalElement]: APIResource<LocalizedGlobalElement>[];
  };
  localizedResourcesMap: Record<string, Record<string, string | null>>;
}