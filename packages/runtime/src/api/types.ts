import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment as PagePathnameSlice,
} from './generated/graphql'

export type APIResource = Swatch | File | Typography | PagePathnameSlice

export type APIResourceType = APIResource['__typename']
