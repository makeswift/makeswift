/** @jsxRuntime classic */
/** @jsx jsx */

import { Editor, Paragraph, jsx, Text, Cursor, Anchor, Focus } from '../../test-helpers'
import { Typography } from '../'

describe('GIVEN detachActiveTypography', () => {
  it('WHEN called THEN typography is detached', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: undefined, style: [{ deviceId: 'mobile', value: {} }] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )

    Typography.detachActiveTypography(editor, [{ deviceId: 'mobile', value: {} }])

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on typographiless text THEN typography is detached', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: undefined, style: [{ deviceId: 'mobile', value: {} }] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )

    Typography.detachActiveTypography(editor, [{ deviceId: 'mobile', value: {} }])

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on subselection THEN only subselection is detached', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
          fgh
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>abc</Text>
        <Text typography={{ id: undefined, style: [{ deviceId: 'mobile', value: {} }] }}>
          <Anchor />
          fgh
        </Text>
        <Text>
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )

    Typography.detachActiveTypography(editor, [{ deviceId: 'mobile', value: {} }])

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
