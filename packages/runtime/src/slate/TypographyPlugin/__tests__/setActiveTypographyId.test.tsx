/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { Typography } from '../'
import { jsx, Editor, Paragraph, Text, Cursor } from '../../test-helpers'

describe('GIVEN setActiveTypographyId', () => {
  it('WHEN called on text THEN typography is added with empty style', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )

    Typography.setActiveTypographyId(editor, 'lmnop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on existing typography THEN typography value is replaced and style is cleared', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: 'id2', style: [] }}>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )

    Typography.setActiveTypographyId(editor, 'id2')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
