import { P, match } from 'ts-pattern'
import {
  ControlDefinition,
  ImageControlData,
  ImageControlDefinition,
  ImageControlValueFormat,
} from '../../../controls'
import { useFile } from '../hooks/makeswift-api'

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

  const fileId = match(data)
    .with(P.string, id => id)
    .with({ type: 'makeswift-file' }, ({ id }) => id)
    .otherwise(() => null)

  const file = useFile(fileId)

  return match([file, data, format])
    .with([{ __typename: 'File' }, P.any, ImageControlValueFormat.URL], ([file]) => file.publicUrl)
    .with(
      [
        { __typename: 'File', dimensions: P.not(P.nullish) },
        P.any,
        ImageControlValueFormat.WithDimensions,
      ],
      ([file]) => ({
        url: file.publicUrl,
        dimensions: file.dimensions,
      }),
    )
    .with([P.any, { type: 'external-file' }, ImageControlValueFormat.URL], ([, d]) => d.url)
    .with(
      [
        P.any,
        { type: 'external-file', width: P.number, height: P.number },
        ImageControlValueFormat.WithDimensions,
      ],
      ([, d]) => ({
        url: d.url,
        dimensions: { width: d.width, height: d.height },
      }),
    )
    .otherwise(() => undefined)
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
