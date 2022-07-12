import { useFile } from '../../../components/hooks'
import {
  ControlDefinition,
  ImageControlData,
  ImageControlDefinition,
  ImageControlValueFormat,
} from '../../../controls'

type ImageWithDimensions = {
  url: string
  dimensions: { width: number; height: number }
}

export type ImageControlValue = string | ImageWithDimensions | undefined

export function useImageControlValue(
  data: ImageControlData | undefined,
  definition: ImageControlDefinition,
): ImageControlValue {
  const format = definition.config.format ?? ImageControlValueFormat.URL
  const file = useFile(data)

  if (format === ImageControlValueFormat.URL) {
    return file?.publicUrl
  }

  if (file == null || file.dimensions == null) return undefined

  return {
    url: file.publicUrl,
    dimensions: { width: file.dimensions.width, height: file.dimensions.height },
  }
}

export type ResolveImageControlValue<T extends ControlDefinition> = T extends ImageControlDefinition
  ? undefined extends T['config']['format']
    ? string | undefined
    : T['config']['format'] extends typeof ImageControlValueFormat.URL
    ? string | undefined
    : T['config']['format'] extends typeof ImageControlValueFormat.WithDimensions
    ? ImageWithDimensions | undefined
    : never
  : never
