import { mergeTranslatedData } from '../control'
import * as ShapeFixture from './fixtures/shape'
import * as ListFixture from './fixtures/list'
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

  test('WHEN merging list control THEN valid translations are applied', () => {
    // Act
    const result = mergeTranslatedData(
      ListFixture.componentRegistration,
      ListFixture.translatableComponentData,
      ListFixture.translatedData,
      {
        translatedData: ListFixture.translatedData,
        mergeTranslatedData: (node: Element) => node,
      },
    )

    // Assert
    expect(result).toEqual(ListFixture.translatedComponentData)
  })
})
