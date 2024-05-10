import { Types } from '../prop-controllers'
import { responsiveNumberValueSchema } from '../data'
import { versionedPropDef, typeArg } from '../versioned'

export const ResponsiveNumber = versionedPropDef(
  Types.ResponsiveNumber,
  responsiveNumberValueSchema,
  {
    version: 1,
    dataKey: 'prop-controllers::responsive-number::v1',
  },
  typeArg<{
    label?: string
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    suffix?: string
    hidden?: boolean
  }>(),
)
