/** @jsxRuntime classic */
/** @jsx jsx */

import { TypographyActions } from '../'
import { jsx, Editor, Paragraph, Text, Cursor, Anchor, Focus } from '../../test-helpers'
import { Editor as SlateEditor } from 'slate'

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
      <Paragraph typography={{ id: 'lmnop', style: [] }}>
        <Text>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyId(editor, 'lmnop')

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
      <Paragraph typography={{ id: 'id2', style: [] }}>
        <Text>
          a<Cursor />
          bc
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyId(editor, 'id2')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on subselection THEN  idis only added to sub selection', () => {
    const editor = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
        <Text>
          <Anchor />
          abc
          <Focus />
          lmnop
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
        <Text typography={{ id: 'id2', style: [] }}>
          <Anchor />
          abc
        </Text>
        <Text>
          <Focus />
          lmnop
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyId(editor, 'id2')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
