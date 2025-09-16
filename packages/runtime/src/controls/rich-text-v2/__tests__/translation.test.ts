import { type MergeTranslatableDataContext } from '@makeswift/controls'
import { RichText } from '../rich-text-v2'

import * as Simple from './fixtures/simple'
import * as SubSupCode from './fixtures/rearranged'
import * as NestedParagraphEdgeCase from './fixtures/nested-paragraph-edge-case-3728'
import { mergeTranslatedNodes } from '../merge-translation'

describe('GIVEN merging translations for RichTextV2', () => {
  const mergeContext: MergeTranslatableDataContext = {
    translatedData: {},
    mergeTranslatedData: element => element,
    mergeTranslatedNodes: mergeTranslatedNodes,
  }

  test('WHEN merging simple strings THEN correct string is returned', () => {
    const result = RichText().mergeTranslatedData(
      Simple.sourceElementTree,
      Simple.translatedData,
      mergeContext,
    )

    expect(result).toEqual(Simple.targetElementTree)
  })

  test('WHEN merging rearranged strings THEN correct string is returned', () => {
    const result = RichText().mergeTranslatedData(
      SubSupCode.sourceElementTree,
      SubSupCode.translatedData,
      mergeContext,
    )

    expect(result).toEqual(SubSupCode.targetElementTree)
  })
})

describe('GIVEN retrieving translatable data for RichTextV2', () => {
  test('WHEN getting translatable data with nested paragraph elements THEN paragraphs are unwrapped correctly', () => {
    const result = RichText().getTranslatableData(NestedParagraphEdgeCase.sourceElementTree)

    expect(result).toEqual(NestedParagraphEdgeCase.translatableData)
  })
})
