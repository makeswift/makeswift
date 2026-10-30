/** @jsxRuntime classic */
/** @jsx jsx */

import { ControlDataTypeKey } from '@makeswift/controls'
import { Editor as SlateEditor } from 'slate'
import { Text, Cursor, EditorV2, Paragraph, jsx, Code, Super, Sub } from '../../test-helpers'

const v1 = { [ControlDataTypeKey]: 'typography::v1' as const }

describe('GIVEN normalizing typography', () => {
  describe('GIVEN normalizing neutral', () => {
    it('WHEN two text are deepEqual THEN they are merged', () => {
      const editor = EditorV2(
        <Paragraph>
          <Text />
          <Text
            typography={{
              id: 'lmnop',
              style: [{ deviceId: 'desktop', value: { fontWeight: 400 } }],
            }}
          >
            abc
          </Text>
          <Text
            typography={{
              id: 'lmnop',
              style: [
                {
                  deviceId: 'desktop',
                  value: { fontWeight: 400 },
                },
              ],
            }}
          >
            xyz
          </Text>
          <Text />
        </Paragraph>,
      )
      const result = EditorV2(
        <Paragraph>
          <Text
            typography={{
              id: 'lmnop',
              style: [{ deviceId: 'desktop', value: { fontWeight: 400 } }],
            }}
          >
            abcxyz
          </Text>
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'neutral'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
  })
  describe('GIVEN normalizing down', () => {
    it('WHEN typographies have bubbled up THEN normalization collapses them down into the text nodes', () => {
      const editor = EditorV2(
        <Paragraph typography={{ id: 'lmnop', style: [] }}>
          <Text>abc</Text>
          <Code>
            <Text>
              <Cursor />
              xyz
            </Text>
          </Code>
        </Paragraph>,
      )
      const result = EditorV2(
        <Paragraph>
          <Text typography={{ ...v1, id: 'lmnop', style: [] }}>abc</Text>
          <Code>
            <Text typography={{ ...v1, id: 'lmnop', style: [] }}>
              <Cursor />
              xyz
            </Text>
          </Code>
          <Text />
        </Paragraph>,
      )

      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
  })

  describe('GIVEN normalizing up', () => {
    it('WHEN all properties are shared THEN they bubble up to a common ancestor', () => {
      const editor = EditorV2(
        <Paragraph>
          <Text typography={{ id: 'lmnop', style: [] }}>abc</Text>
          <Code>
            <Text typography={{ id: 'lmnop', style: [] }}>
              <Cursor />
              xyz
            </Text>
          </Code>
          <Text typography={{ id: 'lmnop', style: [] }} />
        </Paragraph>,
      )
      const result = EditorV2(
        <Paragraph typography={{ ...v1, id: 'lmnop', style: [] }}>
          <Text>abc</Text>
          <Code>
            <Text>
              <Cursor />
              xyz
            </Text>
          </Code>
          <Text />
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'up'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
    it('WHEN v0 and v1 typographies are shared THEN they bubble up as v1', () => {
      const swatchColor = { type: 'swatch' as const, swatchId: '[swatch-id]', alpha: 1 }
      const inlineColor = {
        type: 'inline' as const,
        hue: 240,
        saturation: 100,
        lightness: 50,
        alpha: 0.5,
      }

      const editor = EditorV2(
        <Paragraph>
          <Text
            typography={{
              style: [
                {
                  deviceId: 'desktop',
                  value: { fontWeight: 400, color: { swatchId: '[swatch-id]', alpha: 1 } },
                },
              ],
            }}
          >
            abc
          </Text>
          <Text
            typography={{
              ...v1,
              style: [
                { deviceId: 'desktop', value: { color: swatchColor } },
                { deviceId: 'tablet', value: { color: inlineColor } },
              ],
            }}
          >
            xyz
          </Text>
        </Paragraph>,
      )
      const result = EditorV2(
        <Paragraph
          typography={{ ...v1, style: [{ deviceId: 'desktop', value: { color: swatchColor } }] }}
        >
          <Text
            typography={{ ...v1, style: [{ deviceId: 'desktop', value: { fontWeight: 400 } }] }}
          >
            abc
          </Text>
          <Text
            typography={{ ...v1, style: [{ deviceId: 'tablet', value: { color: inlineColor } }] }}
          >
            xyz
          </Text>
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'up'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
    it('WHEN the only non matching node is an empty text THEN it is ignored', () => {
      const editor = EditorV2(
        <Paragraph>
          <Text typography={{ id: 'lmnop', style: [] }}>abc</Text>
          <Code>
            <Text typography={{ id: 'lmnop', style: [] }}>
              <Cursor />
              xyz
            </Text>
          </Code>
          <Text />
        </Paragraph>,
      )
      const result = EditorV2(
        <Paragraph typography={{ ...v1, id: 'lmnop', style: [] }}>
          <Text>abc</Text>
          <Code>
            <Text>
              <Cursor />
              xyz
            </Text>
          </Code>
          <Text />
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'up'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
    it('WHEN normalizing a partially shared style THEN the correct styles bubble up', () => {
      const typography = {
        style: [
          {
            deviceId: 'desktop',
            value: {
              fontWeight: 400,
              fontSize: { value: 18, unit: 'px' },
              lineHeight: 1.5,
            },
          },
          {
            deviceId: 'mobile',
            value: { fontSize: { value: 16, unit: 'px' } },
          },
        ],
      }

      const editor = EditorV2(
        <Paragraph>
          <Text typography={typography}>a</Text>
          <Code>
            <Text typography={typography}>b</Text>
          </Code>
          <Text typography={typography}>c</Text>
          <Super>
            <Text typography={typography}>d</Text>
          </Super>
          <Text typography={typography}>e</Text>
          <Sub>
            <Text
              typography={{
                style: [
                  {
                    deviceId: 'mobile',
                    value: { fontSize: { value: 16, unit: 'px' } },
                  },
                  {
                    deviceId: 'desktop',
                    value: {
                      fontWeight: 700,
                      fontSize: { value: 18, unit: 'px' },
                      lineHeight: 2,
                      underline: true,
                      italic: false,
                    },
                  },
                ],
              }}
            >
              f
            </Text>
          </Sub>
          <Text typography={typography}>g</Text>
        </Paragraph>,
      )
      const resultingTypography = {
        ...v1,
        style: [
          {
            deviceId: 'desktop',
            value: {
              fontWeight: 400,
              lineHeight: 1.5,
            },
          },
        ],
      }
      const result = EditorV2(
        <Paragraph
          typography={{
            ...v1,
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontSize: { value: 18, unit: 'px' },
                },
              },
              {
                deviceId: 'mobile',
                value: { fontSize: { value: 16, unit: 'px' } },
              },
            ],
          }}
        >
          <Text typography={resultingTypography}>a</Text>
          <Code typography={resultingTypography}>
            <Text>b</Text>
          </Code>
          <Text typography={resultingTypography}>c</Text>
          <Super typography={resultingTypography}>
            <Text>d</Text>
          </Super>
          <Text typography={resultingTypography}>e</Text>
          <Sub
            typography={{
              ...v1,
              style: [
                {
                  deviceId: 'desktop',
                  value: {
                    fontWeight: 700,
                    lineHeight: 2,
                    underline: true,
                    italic: false,
                  },
                },
              ],
            }}
          >
            <Text>f</Text>
          </Sub>
          <Text typography={resultingTypography}>g</Text>
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'up'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
    it('WHEN normalizing detached typography THEN the correct styles bubble up', () => {
      const typography = {
        style: [
          {
            deviceId: 'desktop',
            value: {
              fontSize: { value: 18, unit: 'px' },
            },
          },
          {
            deviceId: 'mobile',
            value: { fontSize: { value: 16, unit: 'px' }, lineHeight: null, fontWeight: null },
          },
        ],
      }

      const editor = EditorV2(
        <Paragraph>
          <Text typography={typography}>a</Text>
          <Code>
            <Text typography={typography}>b</Text>
          </Code>
          <Text />
        </Paragraph>,
      )

      const result = EditorV2(
        <Paragraph typography={{ ...v1, ...typography }}>
          <Text>a</Text>
          <Code>
            <Text>b</Text>
          </Code>
          <Text />
        </Paragraph>,
      )

      editor.typographyNormalizationDirection = 'up'
      SlateEditor.normalize(editor, { force: true })

      expect(editor.children).toEqual(result.children)
    })
  })
})
