/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { Typography } from '../'
import { jsx, Editor, Paragraph, Text, Cursor, Focus, Anchor } from '../../test-helpers'

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

    Typography.setActiveTypographyStyle(editor, 'mobile', 'fontWeight', 500)

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

    Typography.setActiveTypographyStyle(editor, 'mobile', 'italic', true)

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

    Typography.setActiveTypographyStyle(editor, 'mobile', 'italic', true)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on expanded cursor THEN all selected text are turned into a typography', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          abc
          <Anchor />
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
        </Text>
        <Text
          typography={{
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

    Typography.setActiveTypographyStyle(editor, 'mobile', 'italic', true)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
