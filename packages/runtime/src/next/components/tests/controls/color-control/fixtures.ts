import { type ValueType } from '@makeswift/controls'
import { ColorDefinition } from '@makeswift/controls'

import { APIResourceType, type Swatch } from '../../../../../api'
import { type CacheData } from '../../../../../api/client'

type SwatchData = Omit<Swatch, 'id'>

export const swatchId = '[swatch-test-id]'
export const swatch: SwatchData = {
  __typename: APIResourceType.Swatch,
  hue: 238,
  saturation: 87,
  lightness: 49,
}

export const value: ValueType<ColorDefinition> = {
  swatchId,
  alpha: 0.5,
}

export const cacheData = (swatch: SwatchData | null): Partial<CacheData> => ({
  apiResources: {
    Swatch: [{ id: swatchId, value: swatch == null ? null : { id: swatchId, ...swatch } }],
  },
})
