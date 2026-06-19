import {
  type Swatch,
  type File,
  type GlobalElement,
  type LocalizedGlobalElement,
  type Table,
  type Typography,
  type PagePathnameSlice,
} from '../../api'

export const makeSwatch = (id: string, { hue = 0 }: { hue?: number } = {}): Swatch => ({
  __typename: 'Swatch',
  id,
  hue,
  saturation: 100,
  lightness: 50,
})

export const makeFile = (id: string): File => ({
  __typename: 'File',
  id,
  name: `file ${id}`,
  extension: 'png',
  publicUrl: `https://example.com/${id}`,
  dimensions: { width: 100, height: 100 },
})

export const makeTable = (id: string): Table => ({
  __typename: 'Table',
  id,
  name: `table ${id}`,
  columns: [],
})

const emptyStyle = {
  fontFamily: null,
  lineHeight: null,
  letterSpacing: null,
  fontWeight: null,
  textAlign: null,
  uppercase: null,
  underline: null,
  strikethrough: null,
  italic: null,
  fontSize: null,
  color: null,
}

export const makeTypography = (
  id: string,
  { swatchId }: { swatchId?: string } = {},
): Typography => ({
  __typename: 'Typography',
  id,
  name: `typography ${id}`,
  style: [
    {
      deviceId: 'desktop',
      value:
        swatchId != null ? { ...emptyStyle, color: { swatchId: swatchId, alpha: 1 } } : emptyStyle,
    },
  ],
})

export const makeGlobalElement = (id: string): GlobalElement => ({
  __typename: 'GlobalElement',
  id,
  data: {},
})

export const makeLocalizedGlobalElement = (id: string): LocalizedGlobalElement => ({
  __typename: 'LocalizedGlobalElement',
  id,
  data: {},
})

export const makePagePathnameSlice = (
  pageId: string,
  { pathname = `/${pageId}` }: { pathname?: string } = {},
): PagePathnameSlice => ({
  __typename: 'PagePathnameSlice',
  id: pageId,
  basePageId: pageId,
  pathname,
})
