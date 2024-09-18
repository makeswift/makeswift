import { mergeTranslatedData } from '../control'
import * as ShapeFixture from './fixtures/shape'
import { Element } from '../../state/modules/read-only-documents'

describe('GIVEN merging translations', () => {
  test('WHEN merging shape control THEN valid translations are applied', () => {
    // Act
    const result = mergeTranslatedData(
      ShapeFixture.componentRegistration,
      ShapeFixture.translatableComponentData,
      ShapeFixture.translatedData,
      {
        translatedData: ShapeFixture.translatedData,
        mergeTranslatedData: (node: Element) => node,
      },
    )

    // Assert
    expect(result).toEqual(ShapeFixture.translatedComponentData)
  })
})
