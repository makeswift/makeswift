import { CopyContext, ReplacementContext } from '../../state/react-page'
import { ImageValue } from '../descriptors'

export function copy(value: ImageValue | undefined, context: CopyContext): ImageValue | undefined {
  if (value == null) return value

  return context.replacementContext.fileIds.get(value) ?? value
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
      const result = copy(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
