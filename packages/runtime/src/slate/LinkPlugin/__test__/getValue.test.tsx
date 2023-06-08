/** @jsxRuntime classic */
/** @jsx jsx */

import { getValue } from '../getValue'
import { LinkControlData } from '../../../controls'
import { jsx, Paragraph, Text, EditorV2, Focus, Anchor, Link, Code } from '../../test-helpers'

describe('GIVEN LinkPlugin.getValue', () => {
  it('WHEN run on single type THEN return the correct value', () => {
    const linkData: LinkControlData = {
      type: 'SCROLL_TO_ELEMENT',
      payload: {
        block: 'center',
        elementIdConfig: {
          elementKey: 'abc',
          propName: 'xyz',
        },
      },
    }
    const editor = EditorV2(
      <Paragraph>
        <Link link={linkData}>
          <Anchor />
          <Text>abc</Text>
          <Focus />
        </Link>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(linkData)
  })

  it('WHEN run on Link wrapped in another inline THEN return the correct value', () => {
    const linkData: LinkControlData = {
      type: 'SCROLL_TO_ELEMENT',
      payload: {
        block: 'center',
        elementIdConfig: {
          elementKey: 'abc',
          propName: 'xyz',
        },
      },
    }
    const editor = EditorV2(
      <Paragraph>
        <Code>
          <Text />
          <Link link={linkData}>
            <Anchor />
            <Text>abc</Text>
            <Focus />
          </Link>
          <Text />
        </Code>
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual(linkData)
  })

  it('WHEN run on Link wrapping another inline THEN return the correct value', () => {
    const linkData: LinkControlData = {
      type: 'SCROLL_TO_ELEMENT',
      payload: {
        block: 'center',
        elementIdConfig: {
          elementKey: 'abc',
          propName: 'xyz',
        },
      },
    }
    const editor = EditorV2(
      <Paragraph>
        <Link link={linkData}>
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

    expect(value).toEqual(linkData)
  })

  it('WHEN run on Link combined with surrounding text THEN return the correct value', () => {
    const linkData: LinkControlData = {
      type: 'SCROLL_TO_ELEMENT',
      payload: {
        block: 'center',
        elementIdConfig: {
          elementKey: 'abc',
          propName: 'xyz',
        },
      },
    }
    const editor = EditorV2(
      <Paragraph>
        <Link link={linkData}>
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

    expect(value).toEqual(linkData)
  })
})
