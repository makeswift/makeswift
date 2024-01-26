/** @jsxRuntime classic */
/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { getValue } from '../getValue'
// @ts-expect-error: 'jsx' is declared but its value is never read.
import { jsx, Paragraph, Text, EditorV2, Focus, Anchor, Fragment } from '../../test-helpers'
import { BlockTextAlignment } from '../..'

const DESKTOP_LEFT = { deviceId: 'desktop', value: BlockTextAlignment.Left }
const DESKTOP_NULL = { deviceId: 'desktop', value: null }
const MOBILE_RIGHT = { deviceId: 'mobile', value: BlockTextAlignment.Right }

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
