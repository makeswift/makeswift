import { describe, expect, test } from 'vitest'
import { getRichTextV2TranslatableData, mergeRichTextV2TranslatedData } from '../translation'
import { RichText } from '../rich-text-v2'
import * as Simple from './fixtures/simple'
import * as SubSupCode from './fixtures/rearranged'
import * as NestedParagraphEdgeCase from './fixtures/nested-paragraph-edge-case-3728'

describe('GIVEN merging translations for RichTextV2', () => {
  test('WHEN merging simple strings THEN correct string is returned', () => {
    const result = mergeRichTextV2TranslatedData(
      RichText(),
      Simple.sourceElementTree,
      Simple.translatedData,
    )

    expect(result).toEqual(Simple.targetElementTree)
  })

  test('WHEN merging rearranged strings THEN correct string is returned', () => {
    const result = mergeRichTextV2TranslatedData(
      RichText(),
      SubSupCode.sourceElementTree,
      SubSupCode.translatedData,
    )

    expect(result).toEqual(SubSupCode.targetElementTree)
  })
})

describe('GIVEN retrieving translatable data for RichTextV2', () => {
  test('WHEN getting translatable data with nested paragraph elements THEN paragraphs are unwrapped correctly', () => {
    const result = getRichTextV2TranslatableData(
      RichText(),
      NestedParagraphEdgeCase.sourceElementTree,
    )

    expect(result).toEqual(NestedParagraphEdgeCase.translatableData)
  })
})
