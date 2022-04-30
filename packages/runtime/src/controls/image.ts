export type ImageControlData = string

export const ImageControlType = 'makeswift::controls::image'

type ImageControlConfig = { label?: string }

export type ImageControlDefinition = { type: typeof ImageControlType; config: ImageControlConfig }

export function Image(config: ImageControlConfig = {}): ImageControlDefinition {
  return { type: ImageControlType, config }
}
