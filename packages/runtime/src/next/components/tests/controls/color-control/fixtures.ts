import { ColorDefinition, type ValueType } from '@makeswift/controls'

import { APIResourceType, type Swatch } from '../../../../../api'
import { type CacheData } from '../../../../../api/api-resources-client'

type SwatchData = Omit<Swatch, 'id'>

export const swatchId = '[swatch-test-id]'
export const swatch: SwatchData = {
  __typename: APIResourceType.Swatch,
  hue: 238,
  saturation: 87,
  lightness: 49,
}

export const value: ValueType<ColorDefinition> = {
  type: 'swatch',
  swatchId,
  alpha: 0.5,
}

export const inlineValue: ValueType<ColorDefinition> = {
  type: 'inline',
  hue: 238,
  saturation: 87,
  lightness: 49,
  alpha: 0.5,
}

// Writers for data produced by older versions of the control
const v0Definition = new ColorDefinition({}, undefined)
const v1Definition = new ColorDefinition({}, 1)

export const toDataV0 = (value: ValueType<ColorDefinition>) => v0Definition.toData(value)
export const toDataV1 = (value: ValueType<ColorDefinition>) => v1Definition.toData(value)

export const cacheData = (swatch: SwatchData | null): Partial<CacheData> => ({
  apiResources: {
    Swatch: [{ id: swatchId, value: swatch == null ? null : { id: swatchId, ...swatch } }],
  },
})
