import { describe, expect, test } from 'vitest'
import { blockquoteFixture, listFixture, typographyFixture } from './fixtures'
import { richTextDAOToDTO, richTextDTOtoDAO, richTextDTOtoSelection } from './translation'
import { RichTextDTO } from './dto-types'
import { emptyBlockFixture, fixedEmptyBlockFixture } from './fixtures/empty-blocks'
import { v2DataFixture } from './fixtures/v2-data-types'

describe('GIVEN I am using RichText data translation', () => {
  test('WHEN translating simple data THEN nothing is lost', () => {
    const value: RichTextDTO = {
      document: {
        object: 'document',
        data: undefined,
        nodes: [],
      },
      annotations: undefined,
      data: undefined,
      object: 'value',
      selection: undefined,
    }

    expect(value).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(value), richTextDTOtoSelection(value)),
    )
  })
  test('WHEN translating list data THEN nothing is lost', () => {
    expect(listFixture).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(listFixture), richTextDTOtoSelection(listFixture)),
    )
  })
  test('WHEN translating typography data THEN nothing is lost', () => {
    expect(typographyFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(typographyFixture),
        richTextDTOtoSelection(typographyFixture),
      ),
    )
  })
  test('WHEN translating blockquote data THEN nothing is lost', () => {
    expect(blockquoteFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(blockquoteFixture),
        richTextDTOtoSelection(blockquoteFixture),
      ),
    )
  })
  test('WHEN translating data with empty blocks THEN empty blocks are removed', () => {
    expect(fixedEmptyBlockFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(emptyBlockFixture),
        richTextDTOtoSelection(emptyBlockFixture),
      ),
    )
  })

  test('WHEN translating with V2 type THEN the translation is lossless', () => {
    expect(v2DataFixture).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(v2DataFixture), richTextDTOtoSelection(v2DataFixture)),
    )
  })
})
