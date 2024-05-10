import { Types } from '../prop-controllers'
import { GapData, responsiveGapDataSchema } from '../data'
import { versionedPropDef, typeArg } from '../versioned'

export const GapX = versionedPropDef(
  Types.GapX,
  responsiveGapDataSchema,
  {
    version: 1,
    dataKey: 'prop-controllers::gap-x::v1',
  },
  typeArg<{
    preset?: unknown
    label?: string
    defaultValue?: GapData
    min?: number
    max?: number
    step?: number
    hidden?: boolean
  }>(),
)
