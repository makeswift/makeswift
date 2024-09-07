import { z } from 'zod'

import * as Schema from './schema'

export type Swatch = z.infer<typeof Schema.swatch>
export type ColorData = z.infer<typeof Schema.colorData>
export type ResolvedColorData = z.infer<typeof Schema.resolvedColorData>
export type File = z.infer<typeof Schema.file>
export type PagePathnameSlice = z.infer<typeof Schema.pagePathnameSlice>
export type Typography = z.infer<typeof Schema.typography>
