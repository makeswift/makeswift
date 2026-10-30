/** @jsxRuntime classic */
/** @jsx jsx */

import { ControlDataTypeKey } from '@makeswift/controls'
import { TypographyActions } from '../'
import { DEFAULT_BREAKPOINTS } from '../../../state/modules/breakpoints'
import { jsx, Editor, Paragraph, Text, Cursor, Focus, Anchor } from '../../test-helpers'

const v1 = { [ControlDataTypeKey]: 'typography::v1' as const }

describe('GIVEN setActiveTypographyStyle', () => {
  it('WHEN called on text THEN text is converted', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
            ],
          }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'fontWeight',
      500,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on typography THEN typography style is updated', () => {
    const editor = Editor(
      <Paragraph>
        <Text
          typography={{
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
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
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                  italic: true,
                },
              },
            ],
          }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'italic',
      true,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called with an inline color on v0 typography THEN it is written as v1', () => {
    const inlineColor = {
      type: 'inline' as const,
      hue: 240,
      saturation: 100,
      lightness: 50,
      alpha: 0.5,
    }

    const editor = Editor(
      <Paragraph>
        <Text
          typography={{
            style: [
              { deviceId: 'mobile', value: { color: { swatchId: '[swatch-id]', alpha: 1 } } },
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
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: { color: { type: 'swatch', swatchId: '[swatch-id]', alpha: 1 } },
              },
              { deviceId: 'desktop', value: { color: inlineColor } },
            ],
          }}
        >
          abc
          <Cursor />
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'desktop',
      'color',
      inlineColor,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on collapsed cursor THEN only that text is turned into a typography', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
          <Focus />
        </Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
            ],
          }}
        >
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  italic: true,
                },
              },
            ],
          }}
        >
          abc
          <Anchor />
          <Focus />
        </Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
            ],
          }}
        >
          xyz
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'italic',
      true,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on expanded cursor THEN all selected text are turned into a typography', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          <Anchor />
          abc
        </Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
            ],
          }}
        >
          xyz
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  italic: true,
                },
              },
            ],
          }}
        >
          <Anchor />
          abc
        </Text>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                  italic: true,
                },
              },
            ],
          }}
        >
          xyz
          <Focus />
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'italic',
      true,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on ending range within text THEN only sub text is selected', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
          xyz
          <Focus />
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>abc</Text>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  italic: true,
                },
              },
            ],
          }}
        >
          <Anchor />
          xyz
          <Focus />
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'italic',
      true,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN called on middle range within text THEN only sub text is selected', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
          lmn
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>abc</Text>
        <Text
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'mobile',
                value: {
                  italic: true,
                },
              },
            ],
          }}
        >
          <Anchor />
          lmn
        </Text>
        <Text>
          <Focus />
          xyz
        </Text>
      </Paragraph>,
    )

    TypographyActions.setActiveTypographyStyle(
      editor,
      DEFAULT_BREAKPOINTS,
      'mobile',
      'italic',
      true,
    )

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
