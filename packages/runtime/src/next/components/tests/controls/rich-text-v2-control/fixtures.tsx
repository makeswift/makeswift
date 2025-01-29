import { APIResourceType, type Swatch, type Typography } from '../../../../../api'

import * as Fixture from '../fixtures/rich-text-v2'
import { type CacheData } from '../../../../../api/react'

const swatchId = 'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA=='
const swatch: Swatch = {
  __typename: APIResourceType.Swatch,
  id: swatchId,
  hue: 238,
  saturation: 87,
  lightness: 49,
}

const typographyId = 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc='
const typography: Typography = {
  __typename: APIResourceType.Typography,
  id: typographyId,
  name: 'Body',
  style: [
    {
      deviceId: 'desktop',
      value: {
        fontFamily: 'Lato',
        fontSize: { value: 16, unit: 'px' },
        color: null,
        lineHeight: null,
        letterSpacing: null,
        fontWeight: null,
        textAlign: null,
        uppercase: null,
        underline: null,
        strikethrough: null,
        italic: null,
      },
    },
  ],
}

export const value = Fixture.data
export const cacheData = (): Partial<CacheData> => ({
  apiResources: {
    Swatch: [
      {
        id: swatchId,
        value: swatch,
      },
    ],
    Typography: [
      {
        id: typographyId,
        value: typography,
      },
    ],
  },
})
