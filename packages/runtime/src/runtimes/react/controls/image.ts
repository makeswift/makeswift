import { P, match } from 'ts-pattern'

import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { Image, ImageDefinition } from '../../../controls'

import { useFile } from '../hooks/makeswift-api'

export function useImageControlValue(
  data: DataType<ImageDefinition> | undefined,
  definition: ImageDefinition,
): ResolvedValueType<ImageDefinition> {
  const format = definition.config.format ?? Image.Format.URL

  const fileId = match(data)
    .with(P.string, id => id)
    .with({ type: 'makeswift-file' }, ({ id }) => id)
    .otherwise(() => null)

  const file = useFile(fileId)

  return match([file, data, format])
    .with([{ __typename: 'File' }, P.any, Image.Format.URL], ([file]) => file.publicUrl)
    .with(
      [{ __typename: 'File', dimensions: P.not(P.nullish) }, P.any, Image.Format.WithDimensions],
      ([file]) => ({
        url: file.publicUrl,
        dimensions: file.dimensions,
      }),
    )
    .with([P.any, { type: 'external-file' }, Image.Format.URL], ([, d]) => d.url)
    .with(
      [
        P.any,
        { type: 'external-file', width: P.number, height: P.number },
        Image.Format.WithDimensions,
      ],
      ([, d]) => ({
        url: d.url,
        dimensions: { width: d.width, height: d.height },
      }),
    )
    .otherwise(() => undefined)
}
