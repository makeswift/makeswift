/** @jsxRuntime classic */
/** @jsx jsx */

import { onChange } from '../onChange'
import { InlineType } from '../..'
import { jsx, Paragraph, Code, EditorV2, Text, Focus, Anchor, Link } from '../../test-helpers'

describe('GIVEN InlinePlugin.onChange', () => {
  it('WHEN set to current value THEN value is unset', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Code>
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )

    onChange(editor, InlineType.Code)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })
  it('WHEN set on text selection THEN value is set', () => {
    const editor = EditorV2(
      <Paragraph>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text />
        <Code>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Code>
        <Text />
      </Paragraph>,
    )

    onChange(editor, InlineType.Code)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })

  it('WHEN set on a selection containing Link THEN the link is removed', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Link>
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text />
        <Code>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Code>
        <Text />
      </Paragraph>,
    )

    onChange(editor, InlineType.Code)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })
})
