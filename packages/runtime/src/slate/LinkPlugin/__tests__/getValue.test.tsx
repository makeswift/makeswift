/** @jsxRuntime classic */
/** @jsx jsx */

import { getValue } from '../getValue'
import { type DataType } from '@makeswift/controls'
import { LinkDefinition } from '../../../controls'
// @ts-expect-error: 'jsx' is declared but its value is never read.
import { jsx, Paragraph, Text, EditorV2, Focus, Anchor, Link, Code } from '../../test-helpers'

const SCROLL_LINK_DATA: DataType<LinkDefinition> = {
  type: 'SCROLL_TO_ELEMENT',
  payload: {
    block: 'center',
    elementIdConfig: {
      elementKey: 'abc',
      propName: 'xyz',
    },
  },
}

const URL_LINK_DATA: DataType<LinkDefinition> = {
  type: 'OPEN_URL',
  payload: {
    url: 'https://google.com',
    openInNewTab: false,
  },
}

describe('GIVEN LinkPlugin.getValue', () => {
  it('WHEN run on single type THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link link={SCROLL_LINK_DATA}>
          <Anchor />
          <Text>abc</Text>
          <Focus />
        </Link>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(SCROLL_LINK_DATA)
  })

  it('WHEN run on Link wrapped in another inline THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Text />
          <Link link={SCROLL_LINK_DATA}>
            <Anchor />
            <Text>abc</Text>
            <Focus />
          </Link>
          <Text />
        </Code>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(SCROLL_LINK_DATA)
  })

  it('WHEN run on Link wrapping another inline THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link link={SCROLL_LINK_DATA}>
          <Text />
          <Code>
            <Anchor />
            <Text>abc</Text>
            <Focus />
          </Code>
          <Text />
        </Link>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(SCROLL_LINK_DATA)
  })

  it('WHEN run on Link combined with surrounding text THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link link={SCROLL_LINK_DATA}>
          <Anchor />
          <Text>abc</Text>
        </Link>
        <Text>
          xyz
          <Focus />
        </Text>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(SCROLL_LINK_DATA)
  })

  it('WHEN run on adjacent links THEN return null', () => {
    const editor = EditorV2(
      <Paragraph>
        <Link link={SCROLL_LINK_DATA}>
          <Anchor />
          <Text>abc</Text>
        </Link>
        <Link link={URL_LINK_DATA}>
          <Text>abc</Text>
          <Focus />
        </Link>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(null)
  })
})
