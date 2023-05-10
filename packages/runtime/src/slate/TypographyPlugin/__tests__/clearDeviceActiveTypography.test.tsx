/** @jsxRuntime classic */
/** @jsx jsx */

import { TypographyActions } from '../'
import { jsx, Cursor, Editor, Paragraph, Text, Anchor, Focus } from '../../test-helpers'

describe('GIVEN clearDeviceActiveTypography', () => {
  it('WHEN called on typography with id THEN typography style is cleared', () => {
    const editor = Editor(
      <Paragraph>
        <Text
          typography={{
            id: undefined,
            style: [
              { deviceId: 'mobile', value: { italic: true } },
              { deviceId: 'desktop', value: { fontWeight: 500 } },
            ],
          }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text
          typography={{ id: undefined, style: [{ deviceId: 'mobile', value: { italic: true } }] }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it("WHEN called on device typography that doesn't exist THEN typography style is unchanged", () => {
    const editor = Editor(
      <Paragraph>
        <Text
          typography={{
            id: 'lmnop',
            style: [{ deviceId: 'mobile', value: { italic: true } }],
          }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text
          typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: { italic: true } }] }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on subselection THEN device is only cleared on subselection', () => {
    const editor = Editor(
      <Paragraph>
        <Text
          typography={{
            id: undefined,
            style: [
              { deviceId: 'mobile', value: { italic: true } },
              { deviceId: 'desktop', value: { fontWeight: 500 } },
            ],
          }}
        >
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
        <Text
          typography={{
            id: undefined,
            style: [
              { deviceId: 'mobile', value: { italic: true } },
              { deviceId: 'desktop', value: { fontWeight: 500 } },
            ],
          }}
        >
          abc
        </Text>
        <Text
          typography={{ id: undefined, style: [{ deviceId: 'mobile', value: { italic: true } }] }}
        >
          <Anchor />
          fgh
        </Text>
        <Text
          typography={{
            id: undefined,
            style: [
              { deviceId: 'mobile', value: { italic: true } },
              { deviceId: 'desktop', value: { fontWeight: 500 } },
            ],
          }}
        >
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
