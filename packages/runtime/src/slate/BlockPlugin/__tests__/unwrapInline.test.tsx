/** @jsxRuntime classic */
/** @jsx jsx */

import { InlineType } from '@makeswift/runtime/slate'
import { Block } from '..'
import { jsx, Paragraph, Code, Text, Editor, Sub, Super } from '../../test-helpers'

describe('GIVEN unwrapInline', () => {
  it('WHEN called on code THEN code is unwrapped', () => {
    const editor = Editor(
      <Paragraph>
        <Code>
          <Text>abc</Text>
        </Code>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>abc</Text>
      </Paragraph>,
    )

    Block.unwrapInline(editor, InlineType.Code)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN on multiple different inlines THEN only the specified one is removed', () => {
    const editor = Editor(
      <Paragraph>
        <Code>
          <Text>abc</Text>
        </Code>
        <Sub>
          <Text>lmnop</Text>
        </Sub>
        <Super>
          <Text>xyz</Text>
        </Super>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text />
        <Code>
          <Text>abc</Text>
        </Code>
        <Text>lmnop</Text>
        <Super>
          <Text>xyz</Text>
        </Super>
        <Text />
      </Paragraph>,
    )
    Block.unwrapInline(editor, InlineType.SubScript)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called with neighboring text THEN the text is merged after inline is unwrapped', () => {
    const editor = Editor(
      <Paragraph>
        <Text />
        <Code>
          <Text>abc</Text>
        </Code>
        <Text>lmnop</Text>
        <Super>
          <Text>xyz</Text>
        </Super>
        <Text />
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text />
        <Code>
          <Text>abc</Text>
        </Code>
        <Text>lmnopxyz</Text>
      </Paragraph>,
    )
    Block.unwrapInline(editor, InlineType.SuperScript)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
