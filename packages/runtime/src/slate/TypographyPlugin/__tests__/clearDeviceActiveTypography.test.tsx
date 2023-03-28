/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { Typography } from '../'
import { jsx, Cursor, Editor, Paragraph, Text } from '../../test-helpers'

describe('GIVEN clearActiveTypographyStyle', () => {
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

    Typography.clearDeviceActiveTypography(editor, 'desktop')

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

    Typography.clearDeviceActiveTypography(editor, 'desktop')

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
