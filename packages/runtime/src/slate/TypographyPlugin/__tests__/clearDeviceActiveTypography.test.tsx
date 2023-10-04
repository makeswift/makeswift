/** @jsxRuntime classic */
/** @jsx jsx */

import { TypographyActions } from '../'
import { jsx, Cursor, Editor, Paragraph, Text, Anchor, Focus, Code } from '../../test-helpers'

describe('GIVEN clearDeviceActiveTypography', () => {
  it('1', () => {
    const editor = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
        typography={{ id: undefined, style: [{ deviceId: 'mobile', value: { italic: true } }] }}
      >
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('2', () => {
    const editor = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text>
          <Anchor />
          abc
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text>
          <Anchor />
          abc
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )
    console.log({ editorSelection: JSON.stringify(editor.selection) })

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('3', () => {
    const editor = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text
          typography={{
            id: undefined,
            style: [{ deviceId: 'desktop', value: { textAlign: 'right' } }],
          }}
        >
          <Anchor />
          abc
        </Text>
        <Text>
          x
          <Focus />
          yz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text>
          <Anchor />
          abcx
          <Focus />
          yz
        </Text>
      </Paragraph>,
    )
    console.log({ editorSelection: JSON.stringify(editor.selection) })

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it.only('4', () => {
    const editor = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Code
          typography={{
            id: 'asdf',
            style: [
              { deviceId: 'mobile', value: { strikethrough: true } },
              { deviceId: 'desktop', value: { letterSpacing: 20 } },
            ],
          }}
        >
          <Text
            typography={{
              id: undefined,
              style: [{ deviceId: 'desktop', value: { textAlign: 'right' } }],
            }}
          >
            <Anchor />
            abc
            <Focus />
          </Text>
        </Code>
        <Text>xyz</Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
        <Text />
        <Code
          typography={{
            id: 'asdf',
            style: [{ deviceId: 'mobile', value: { strikethrough: true } }],
          }}
        >
          <Anchor />
          abc
          <Focus />
        </Code>
        <Text>xyz</Text>
      </Paragraph>,
    )
    console.log({ editorSelection: JSON.stringify(editor.selection) })

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
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
        typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: { italic: true } }] }}
      >
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )

    TypographyActions.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it.skip('WHEN called on subselection THEN device is only cleared on subselection', () => {
    const editor = Editor(
      <Paragraph
        typography={{
          id: undefined,
          style: [
            { deviceId: 'mobile', value: { italic: true } },
            { deviceId: 'desktop', value: { fontWeight: 500 } },
          ],
        }}
      >
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
      <Paragraph
        typography={{ id: undefined, style: [{ deviceId: 'mobile', value: { italic: true } }] }}
      >
        <Text
          typography={{
            id: undefined,
            style: [{ deviceId: 'desktop', value: { fontWeight: 500 } }],
          }}
        >
          abc
        </Text>
        <Text>
          <Anchor />
          fgh
        </Text>
        <Text
          typography={{
            id: undefined,
            style: [{ deviceId: 'desktop', value: { fontWeight: 500 } }],
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
