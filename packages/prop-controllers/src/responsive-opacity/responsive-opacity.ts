import { Types, Schema } from '../prop-controllers'
import { versionedPropDef, typeArg } from '../versioned'
import { z } from 'zod'

export const responsiveOpacityValueSchema = Schema.responsiveValue(z.number())

export type ResponsiveOpacityValue = z.infer<
  typeof responsiveOpacityValueSchema
>

export const ResponsiveOpacity = versionedPropDef(
  Types.ResponsiveOpacity,
  responsiveOpacityValueSchema,
  {
    version: 1,
    dataKey: 'prop-controllers::responsive-opacity::v1',
  },
  typeArg<Record<string, never>>(),
)
