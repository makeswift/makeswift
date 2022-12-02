import { CopyContext, ReplacementContext } from '../../state/react-page'
import { TableValue } from '../descriptors'

export function copy(value: TableValue | undefined, context: CopyContext): TableValue | undefined {
  if (value == null) return value

  return context.replacementContext.tableIds.get(value) ?? value
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('table copy', () => {
    test('replaces the table id', () => {
      // Arrange
      const data: TableValue = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'

      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map(),
        fileIds: new Map(),
        typographyIds: new Map(),
        tableIds: new Map([
          ['VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy', 'testing'],
        ]),
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
      expect(result).toMatch('testing')
    })
  })
}
