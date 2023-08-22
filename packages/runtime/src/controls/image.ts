import { P, match } from 'ts-pattern'
import { CopyContext, ReplacementContext } from '../state/react-page'

type ImageControlDataV0 = string

type MakeswiftFileImageData = {
  type: 'makeswift-file'
  version: 1,
  id: string
}

type ExternalFileImageData = {
  type: 'external-file'
  version: 1,
  url: string
  width?: number | null
  height?: number | null
}

type ImageControlDataV1 = MakeswiftFileImageData | ExternalFileImageData

export type ImageControlData = ImageControlDataV0 | ImageControlDataV1

export const ImageControlType = 'makeswift::controls::image'

export const ImageControlValueFormat = {
  URL: 'makeswift::controls::image::format::url',
  WithDimensions: 'makeswift::controls::image::format::with-dimensions',
} as const

type ImageControlValueFormat = typeof ImageControlValueFormat[keyof typeof ImageControlValueFormat]

type ImageControlConfig = { label?: string; format?: ImageControlValueFormat }

export type ImageControlDefinition<T extends ImageControlConfig = ImageControlConfig> = {
  type: typeof ImageControlType
  config: T
  version?: 1
}

export function Image<T extends ImageControlConfig>(
  config: T = {} as T,
): ImageControlDefinition<T> {
  return { type: ImageControlType, config, version: 1 }
}

Image.Format = ImageControlValueFormat

export function copyImageData(
  value: ImageControlData | undefined,
  context: CopyContext,
): ImageControlData | undefined {
  if (value == null) return value

  return match(value)
    .with(P.string, id => context.replacementContext.fileIds.get(id) ?? id)
    .with({ type: 'makeswift-file' }, ({ id }) => context.replacementContext.fileIds.get(id) ?? id)
    .otherwise(val => val)
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('image copy', () => {
    test('image is replaced by a one in replacement context', () => {
      // Arrange
      const data: ImageControlData = 'file-id'
      const expected = 'testing'

      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map(),
        fileIds: new Map([['file-id', 'testing']]),
        typographyIds: new Map(),
        tableIds: new Map(),
        tableColumnIds: new Map(),
        pageIds: new Map(),
        globalElementIds: new Map(),
        globalElementData: new Map(),
      }

      // Act
      const result = copyImageData(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
