/** @jsxRuntime classic */
/** @jsx jsx */

import { Block } from '..'
import { jsx, Paragraph, Text, Editor, Cursor } from '../../test-helpers'

describe('GIVEN clearBlockKeyForDevice', () => {
  it('WHEN called on a paragraph THEN textAlign is updated', () => {
    const editor = Editor(
      <Paragraph textAlign={[{ deviceId: 'mobile', value: 'right' }]}>
        <Text>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )

    Block.clearBlockKeyForDevice(editor, 'mobile', 'textAlign')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
