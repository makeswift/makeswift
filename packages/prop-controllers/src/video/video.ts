import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { P, match } from 'ts-pattern'

const videoDataSchema = z.object({
  url: z.string().optional(),
  muted: z.boolean().optional(),
  playing: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional(),
})

export type VideoData = z.infer<typeof videoDataSchema>

const videoPropControllerDataV0Schema = videoDataSchema

export type VideoPropControllerDataV0 = z.infer<
  typeof videoPropControllerDataV0Schema
>

export const VideoPropControllerDataV1Type = 'prop-controllers::video::v1'

const videoPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(VideoPropControllerDataV1Type),
  value: videoDataSchema,
})

export type VideoPropControllerDataV1 = z.infer<
  typeof videoPropControllerDataV1Schema
>

export const videoPropControllerDataSchema = z.union([
  videoPropControllerDataV1Schema,
  videoPropControllerDataV0Schema,
])

export type VideoPropControllerData = z.infer<
  typeof videoPropControllerDataSchema
>

export type VideoOptions = Options<{
  preset?: VideoPropControllerData
}>

type VideoDescriptorV0<_T = VideoPropControllerDataV0> = {
  type: typeof Types.Video
  options: VideoOptions
}

type VideoDescriptorV1<
  _T = VideoPropControllerData,
  U extends VideoOptions = VideoOptions,
> = {
  type: typeof Types.Video
  version: 1
  options: U
}

export type VideoDescriptor<_T = VideoPropControllerData> =
  | VideoDescriptorV0
  | VideoDescriptorV1

export type ResolveVideoPropControllerValue<T extends VideoDescriptor> =
  T extends VideoDescriptor ? VideoData | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Video(options: VideoOptions = {}): VideoDescriptorV1 {
  return { type: Types.Video, version: 1, options }
}

export function getVideoPropControllerDataVideoData(
  data: VideoPropControllerData | undefined,
): VideoData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: VideoPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createVideoPropControllerDataFromVideoData(
  value: VideoData,
  definition?: VideoDescriptor,
): VideoPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: VideoPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
