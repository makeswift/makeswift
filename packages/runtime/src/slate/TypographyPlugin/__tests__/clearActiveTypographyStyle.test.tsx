/** @jsxRuntime classic */
/** @jsx jsx */

import { TypographyActions } from '../'
import { jsx, Paragraph, Text, Editor, Cursor, Anchor, Focus } from '../../test-helpers'

describe('GIVEN clearActiveTypographyStyle', () => {
  it('WHEN called on an empty typography style THEN typography style is unchanged', () => {
    const editor = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [] }}>
        <Text>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [] }}>
        <Text>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it.only('WHEN called on typography with id THEN typography style is cleared', () => {
    const editor = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
        <Text typography={{ style: [{ deviceId: 'mobile', value: {} }] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
        <Text>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it.only('WHEN called results in an idless/styleless typography THEN normalization remove the typography attribute all together', () => {
    const editor = Editor(
      <Paragraph typography={{ style: [{ deviceId: 'mobile', value: {} }] }}>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('123456 WHEN called on subselection THEN only subselection typography attribute is cleared', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ style: [{ deviceId: 'mobile', value: {} }] }}>
          <Anchor />
          abc
          <Focus />
          lmnop
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>
          <Anchor />
          abc
        </Text>
        <Text typography={{ style: [{ deviceId: 'mobile', value: {} }] }}>
          <Focus />
          lmnop
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
