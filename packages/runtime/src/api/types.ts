import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment as PagePathnameSlice,
  GlobalElementFragment as GlobalElement,
  TableFragment as Table,
} from './generated/graphql'

export type APIResource = Swatch | File | Typography | PagePathnameSlice | GlobalElement | Table

export type APIResourceType = APIResource['__typename']
