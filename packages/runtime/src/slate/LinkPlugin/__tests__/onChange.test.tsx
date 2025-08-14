/** @jsxRuntime classic */
/** @jsx jsx */

import { onChange } from '../onChange'
import { type DataType } from '@makeswift/controls'
import { LinkDefinition } from '../../../controls'
import { jsx, Paragraph, Text, EditorV2, Focus, Anchor, Link, Code } from '../../test-helpers'

const initialLinkData: DataType<LinkDefinition> = {
  type: 'OPEN_URL',
  payload: {
    openInNewTab: false,
    url: 'https://',
  },
}
const nextLinkData: DataType<LinkDefinition> = {
  type: 'OPEN_URL',
  payload: {
    openInNewTab: false,
    url: 'https://g',
  },
}

describe('GIVEN LinkPlugin.onChange', () => {
  it('WHEN set on text THEN text is wrapped and value is set', () => {
    const editor = EditorV2(
      <Paragraph>
        <Text>
          <Anchor />
          abc
          <Focus />
        </Text>
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text />
        <Link link={initialLinkData}>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Link>
        <Text />
      </Paragraph>,
    )

    onChange(editor, initialLinkData)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })

  it('WHEN set to existing value THEN value is updated', () => {
    const editor = EditorV2(
      <Paragraph>
        <Text />
        <Link link={initialLinkData}>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Link>
        <Text />
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text />
        <Link link={nextLinkData}>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Link>
        <Text />
      </Paragraph>,
    )

    onChange(editor, nextLinkData)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })

  it('WHEN set on selection containing another inline THEN inline is preserved', () => {
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Text>
            <Anchor />
            abc
            <Focus />
          </Text>
        </Code>
      </Paragraph>,
    )
    const next = EditorV2(
      <Paragraph>
        <Text />
        <Code>
          <Text />
          <Link link={initialLinkData}>
            <Text>
              <Anchor />
              abc
              <Focus />
            </Text>
          </Link>
          <Text />
        </Code>
        <Text />
      </Paragraph>,
    )

    onChange(editor, initialLinkData)

    expect(editor.children).toEqual(next.children)
    expect(editor.selection).toEqual(next.selection)
  })
})
