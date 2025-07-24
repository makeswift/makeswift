import {
  type Swatch,
  type File,
  type Typography,
  type GlobalElement,
  type LocalizedGlobalElement,
  type PagePathnameSlice,
  type Table,
} from '../../../api'

export const swatch: Swatch = {
  __typename: 'Swatch',
  id: '[swatch-id]',
  hue: 123,
  saturation: 45,
  lightness: 67,
}

export const file: File = {
  __typename: 'File',
  id: '[file-id]',
  name: 'cat.png',
  extension: 'png',
  publicUrl: 'https://example.com/cat.png',
  dimensions: { width: 100, height: 100 },
}

export const typography: Typography = {
  __typename: 'Typography',
  id: '[typography-id]',
  name: 'Title',
  style: [
    {
      deviceId: 'desktop',
      value: {
        fontFamily: 'Inter',
        lineHeight: 1.2,
        letterSpacing: null,
        fontWeight: 700,
        textAlign: null,
        uppercase: null,
        underline: null,
        strikethrough: null,
        italic: null,
        fontSize: { value: 72, unit: 'px' },
        color: null,
      },
    },
  ],
}

export const globalElement: GlobalElement = {
  __typename: 'GlobalElement',
  id: '[global-element-id]',
  data: { key: 'value' },
}

export const localizedGlobalElement: LocalizedGlobalElement = {
  __typename: 'LocalizedGlobalElement',
  id: '[localized-global-element-id]',
  data: { key: 'localized-value' },
}

export const pagePathnameSlice: PagePathnameSlice = {
  __typename: 'PagePathnameSlice',
  id: '[page-pathname-slice-id]',
  pathname: '/example-page',
}

export const table: Table = {
  __typename: 'Table',
  id: '[table-id]',
  name: 'Example Table',
  columns: [],
}
