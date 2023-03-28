/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { Typography } from '../'
import { jsx, Paragraph, Text, Editor, Cursor } from '../../test-helpers'

describe('GIVEN clearActiveTypographyStyle', () => {
  it('WHEN called on an empty typography style THEN typography style is unchanged', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>
          ab
          <Cursor />c
        </Text>
      </Paragraph>,
    )

    Typography.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called on typography with id THEN typography style is cleared', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [{ deviceId: 'mobile', value: {} }] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text typography={{ id: 'lmnop', style: [] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )

    Typography.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN called results in an idless/styleless typography THEN normalization remove the typography attribute all together', () => {
    const editor = Editor(
      <Paragraph>
        <Text typography={{ style: [{ deviceId: 'mobile', value: {} }] }}>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )
    const result = Editor(
      <Paragraph>
        <Text>
          <Cursor />
          abc
        </Text>
      </Paragraph>,
    )

    Typography.clearActiveTypographyStyle(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
