/** @jsxRuntime classic */
/** @jsx jsx */

import { Slate } from '@makeswift/controls'
import { getValue } from '../getValue'
import { jsx, Paragraph, Text, EditorV2, Focus, Anchor, Fragment } from '../../test-helpers'

const DESKTOP_LEFT = { deviceId: 'desktop', value: Slate.BlockTextAlignment.Left }
const DESKTOP_NULL = { deviceId: 'desktop', value: null }
const MOBILE_RIGHT = { deviceId: 'mobile', value: Slate.BlockTextAlignment.Right }

describe('GIVEN TextAlignPlugin.getValue', () => {
  it('WHEN run on single type THEN return the correct value', () => {
    const editor = EditorV2(
      <Paragraph textAlign={[DESKTOP_LEFT]}>
        <Anchor />
        <Text>abc</Text>
        <Focus />
      </Paragraph>,
    )

    const value = getValue(editor)

    expect(value).toEqual([DESKTOP_LEFT])
  })

  it('WHEN run ', () => {
    const editor = EditorV2(
      <Fragment>
        <Paragraph textAlign={[DESKTOP_LEFT]}>
          <Anchor />
          <Text>abc</Text>
        </Paragraph>
        <Paragraph textAlign={[DESKTOP_LEFT]}>
          <Text>xyz</Text>
          <Focus />
        </Paragraph>
      </Fragment>,
    )

    const value = getValue(editor)

    expect(value).toEqual([DESKTOP_LEFT])
  })

  it('WHEN run ', () => {
    const editor = EditorV2(
      <Fragment>
        <Paragraph textAlign={[DESKTOP_LEFT]}>
          <Anchor />
          <Text>abc</Text>
        </Paragraph>
        <Paragraph textAlign={[]}>
          <Text>xyz</Text>
          <Focus />
        </Paragraph>
      </Fragment>,
    )

    const value = getValue(editor)

    expect(value).toEqual([DESKTOP_NULL])
  })

  it('WHEN run ', () => {
    const editor = EditorV2(
      <Fragment>
        <Paragraph textAlign={[DESKTOP_LEFT, MOBILE_RIGHT]}>
          <Anchor />
          <Text>abc</Text>
        </Paragraph>
        <Paragraph textAlign={[MOBILE_RIGHT]}>
          <Text>xyz</Text>
          <Focus />
        </Paragraph>
      </Fragment>,
    )

    const value = getValue(editor)

    expect(value).toEqual([DESKTOP_NULL, MOBILE_RIGHT])
  })
})
