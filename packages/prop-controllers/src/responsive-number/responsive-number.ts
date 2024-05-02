import { Types } from '../prop-controllers'
import { responsiveNumberValueSchema } from '../data'
import { versionedPropDef } from '../versioned'

export const ResponsiveNumber = versionedPropDef<{
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}>()(Types.ResponsiveNumber, responsiveNumberValueSchema, {
  version: 1,
  dataKey: 'prop-controllers::responsive-number::v1',
})
