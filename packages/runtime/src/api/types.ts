import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment as PagePathnameSlice,
  GlobalElementFragment as GlobalElement,
} from './generated/graphql'

export type APIResource = Swatch | File | Typography | PagePathnameSlice | GlobalElement

export type APIResourceType = APIResource['__typename']
