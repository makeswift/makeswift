/** @jsxRuntime classic */
/** @jsx jsx */

import React from 'react'
import { Editor as SlateEditor } from 'slate'
import { Text, Cursor, Editor, Paragraph, jsx } from '../../test-helpers'

describe('testing typography normalization ', () => {
  it('1', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>abc</Text>
        <Text typography={{ id: 'lmnop', style: [] }}>
          <Cursor />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [] }}>
        <Text>
          abc
          <Cursor />
          xyz
        </Text>
      </Paragraph>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('2', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>abc</Text>
        <Text
          typography={{
            id: 'lmnop',
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontFamily: 'Helvetica',
                },
              },
            ],
          }}
        >
          lmnop
        </Text>
        <Text typography={{ id: 'lmnop', style: [] }}>
          <Cursor />
          xyz
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph typography={{ id: 'lmnop', style: [] }}>
        <Text>abc</Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontFamily: 'Helvetica',
                },
              },
            ],
          }}
        >
          lmnop
        </Text>
        <Text>
          <Cursor />
          xyz
        </Text>
      </Paragraph>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('3', () => {
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
        </Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontFamily: 'Helvetica',
                },
              },
              {
                deviceId: 'mobile',
                value: {
                  fontWeight: 500,
                },
              },
            ],
          }}
        >
          lmnop
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph
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
        <Text>abc</Text>
        <Text
          typography={{
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontFamily: 'Helvetica',
                },
              },
            ],
          }}
        >
          lmnop
        </Text>
      </Paragraph>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
