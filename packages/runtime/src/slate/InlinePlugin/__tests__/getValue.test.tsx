/** @jsxRuntime classic */
/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { getValue } from '../getValue'
import { InlineType } from '../..'
import {
  jsx,
  Paragraph,
  Code,
  Text,
  EditorV2,
  Focus,
  Anchor,
  Super,
  Link,
} from '../../test-helpers'

describe('GIVEN InlinePlugin.getValue', () => {
  it('WHEN run on single type THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Anchor />
          <Text>abc</Text>
          <Focus />
        </Code>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(InlineType.Code)
  })

  it('WHEN selection includes other text THEN still returns type', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Anchor />
          <Text>abc</Text>
        </Code>
        <Text>
          xyc
          <Focus />
        </Text>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(InlineType.Code)
  })

  it('WHEN run on adjacent types THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Anchor />
          <Text>abc</Text>
        </Code>
        <Super>
          <Text>abc</Text>
          <Focus />
        </Super>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(null)
  })
  it('WHEN run on on single type including a link THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Anchor />
          <Link>
            <Text>abc</Text>
          </Link>
          <Focus />
        </Code>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(InlineType.Code)
  })

  it('WHEN run on on single type within a link THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link>
          <Code>
            <Anchor />
            <Text>abc</Text>
            <Focus />
          </Code>
        </Link>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(InlineType.Code)
  })

  it('WHEN run on on single type wrapping a link THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Link>
            <Anchor />
            <Text>abc</Text>
            <Focus />
          </Link>
        </Code>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(InlineType.Code)
  })
})
