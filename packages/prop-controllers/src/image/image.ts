import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  getReplacementResourceId,
  shouldRemoveResource,
  ContextResource,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import {
  ImageData,
  ImageDataV0,
  imageDataSchema,
  imageDataV0Schema,
} from '../data'

const imagePropControllerDataV0Schema = imageDataV0Schema

const imagePropControllerDataV1Schema = imageDataSchema

export const ImagePropControllerDataV2Type = 'prop-controllers::image::v2'

const imagePropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(ImagePropControllerDataV2Type),
  value: imagePropControllerDataV1Schema,
})

export type ImagePropControllerDataV2 = z.infer<
  typeof imagePropControllerDataV2Schema
>

export const imagePropControllerDataSchema = z.union([
  imagePropControllerDataV0Schema,
  imagePropControllerDataV1Schema,
  imagePropControllerDataV2Schema,
])

export type ImagePropControllerData = z.infer<
  typeof imagePropControllerDataSchema
>

export type ImageOptions = Options<{ label?: string; hidden?: boolean }>

type ImageDescriptorV0<_T = ImageDataV0> = {
  type: typeof Types.Image
  options: ImageOptions
}

type ImageDescriptorV1<_T = ImageData> = {
  type: typeof Types.Image
  version: 1
  options: ImageOptions
}

type ImageDescriptorV2<_T = ImagePropControllerData> = {
  type: typeof Types.Image
  version: 2
  options: ImageOptions
}

export type ImageDescriptor<_T = ImagePropControllerData> =
  | ImageDescriptorV0
  | ImageDescriptorV1
  | ImageDescriptorV2

export type ResolveImagePropControllerValue<T extends ImageDescriptor> =
  T extends ImageDescriptor ? ImageData | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Image(options: ImageOptions = {}): ImageDescriptorV2 {
  return { type: Types.Image, version: 2, options }
}

export function getImagePropControllerDataImageData(
  data: ImagePropControllerData | undefined,
): ImageData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ImagePropControllerDataV2Type },
      (v2) => v2.value,
    )
    .otherwise((v0) => v0)
}

export function createImagePropControllerDataFromImageData(
  data: ImageData,
  definition: ImageDescriptor,
): ImagePropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: ImagePropControllerDataV2Type,
          value: data,
        }) as const,
    )
    .otherwise(() => data)
}

export function getImagePropControllerFileIds(
  data: ImagePropControllerData | undefined,
): string[] {
  const value = getImagePropControllerDataImageData(data)

  return match(value)
    .with(undefined, () => [])
    .with(P.string, (v) => [v])
    .with({ type: 'makeswift-file', version: 1 }, (v) => [v.id])
    .with({ type: 'external-file', version: 1 }, () => [])
    .exhaustive()
}

function copyImageData(
  data: ImageData | undefined,
  ctx: CopyContext,
): ImageData | undefined {
  const existingFileId = match(data)
    .with(P.string, (v) => v)
    .with({ type: 'makeswift-file', version: 1 }, (v) => v.id)
    .otherwise(() => undefined)

  if (
    existingFileId != null &&
    shouldRemoveResource(ContextResource.File, existingFileId, ctx)
  ) {
    return undefined
  }

  return match(data)
    .with(
      P.string,
      (v) => getReplacementResourceId(ContextResource.File, v, ctx) ?? v,
    )
    .with({ type: 'makeswift-file', version: 1 }, (v) => ({
      ...v,
      id: getReplacementResourceId(ContextResource.File, v.id, ctx) ?? v.id,
    }))
    .otherwise((v) => v)
}

export function copyImagePropControllerData(
  data: ImagePropControllerData | undefined,
  context: CopyContext,
): ImagePropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with({ [ControlDataTypeKey]: ImagePropControllerDataV2Type }, (v1) => {
      const value = copyImageData(v1.value, context)

      if (value == null) return undefined

      return {
        [ControlDataTypeKey]: ImagePropControllerDataV2Type,
        value,
      } as const
    })
    .otherwise((v0) => copyImageData(v0, context))
}
