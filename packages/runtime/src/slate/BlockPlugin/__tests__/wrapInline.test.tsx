/** @jsxRuntime classic */
/** @jsx jsx */

import { InlineType } from '@makeswift/runtime/slate'
import { Block } from '..'
import { jsx, Paragraph, Code, Text, Editor, Focus, Anchor } from '../../test-helpers'

describe('GIVEN wrapInline', () => {
  it('WHEN called on text THEN it wraps the text', () => {
    const editor = Editor(
      <Paragraph>
        <Text>abc</Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text />
        <Code>
          <Text>abc</Text>
        </Code>
        <Text />
      </Paragraph>,
    )

    Block.wrapInline(editor, { type: InlineType.Code, children: [] })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on specific selection THEN it wraps specific selection', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
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

    Block.wrapInline(editor, { type: InlineType.Code, children: [] })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on sub selection THEN it wraps sub selection', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
          lmnop
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>abc</Text>
        <Code>
          <Text>
            <Anchor />
            lmnop
          </Text>
        </Code>
        <Text>
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )

    Block.wrapInline(editor, { type: InlineType.Code, children: [] })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
