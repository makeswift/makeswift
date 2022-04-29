import Color from 'color'

import { useQuery } from '../../../api/react'
import { SWATCHES_BY_ID } from '../../../components/utils/queries'
import { ColorControlData, ColorControlDefinition } from '../../../controls/color'

export type ColorControlValue<T extends ColorControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

type Swatch = {
  id: string
  hue: number
  saturation: number
  lightness: number
}

type SwatchesById = { swatches: Swatch[] }

export function useColorValue<T extends ColorControlDefinition>(
  data: ColorControlData | undefined,
  definition: T,
): ColorControlValue<T> {
  const result = useQuery<SwatchesById>(SWATCHES_BY_ID, {
    variables: { ids: [data?.swatchId] },
    skip: data?.swatchId == null,
  })

  if (data === undefined) {
    const { defaultValue } = definition.config

    if (defaultValue === undefined) return undefined as ColorControlValue<T>

    let defaultColor
    try {
      defaultColor = Color(definition.config.defaultValue)
    } catch {
      defaultColor = Color()
    }

    return defaultColor.rgb().string()
  }

  const [swatch] = result.data?.swatches ?? [null]

  return Color({ h: swatch?.hue, s: swatch?.saturation, l: swatch?.lightness })
    .alpha(data.alpha)
    .rgb()
    .string()
}
