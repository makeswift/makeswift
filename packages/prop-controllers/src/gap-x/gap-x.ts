import { Types } from '../prop-controllers'
import { GapData, responsiveGapDataSchema } from '../data'
import { versionedPropDef } from '../versioned'

export const GapX = versionedPropDef<{
  preset?: unknown
  label?: string
  defaultValue?: GapData
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}>()(Types.GapX, responsiveGapDataSchema, {
  version: 1,
  dataKey: 'prop-controllers::gap-x::v1',
})
