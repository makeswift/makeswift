import { CopyContext, ReplacementContext } from '../../state/react-page'
import { ImageDescriptor, ImageValue } from '../descriptors'
import { match, P } from 'ts-pattern'

export function copy(
  descriptor: ImageDescriptor,
  value: ImageValue | undefined,
  context: Pick<CopyContext, 'replacementContext'>,
): ImageValue | undefined {
  return match([descriptor, value])
    .with([P.any, P.string], ([, v]) => context.replacementContext.fileIds.get(v) ?? v)
    .with(
      [{ version: 1 }, { type: 'makeswift-file', version: 1 }],
      ([, v]) => context.replacementContext.fileIds.get(v.id) ?? v.id,
    )
    .otherwise(([, v]) => v)
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('image copy', () => {
    test('image is replaced by a one in replacement context', () => {
      // Arrange
      const data: ImageValue = 'file-id'
      const expected = JSON.parse(JSON.stringify(data).replace('file-id', 'testing'))

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
      const result = copy({ type: 'Image', options: {} }, data, {
        replacementContext: replacementContext as ReplacementContext,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
