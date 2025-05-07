import { testDefinition } from '../../testing/test-definition'

import { createReplacementContext, type CopyContext } from '../../context'
import { Targets } from '../../introspection'

import { type ValueType } from '../associated-types'
import { ControlDefinition } from '../definition'

import {
  GenericLink as Link,
  GenericLinkDefinition as LinkDefinition,
} from './generic-link'

function testLinkDefinition<Def extends ControlDefinition>(
  definition: Def,
  values: ValueType<Def>[],
  invalidValues: unknown[],
) {
  testDefinition(definition, values, invalidValues)

  describe('introspect page IDs', () => {
    test.each([
      {
        type: 'OPEN_PAGE',
        payload: { pageId: 'fake-id', openInNewTab: false },
      },
    ])("returns data payload's `pageId`", (data) => {
      expect(definition.introspect(data, Targets.Page)).toEqual(['fake-id'])
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(definition.introspect(value, Targets.Page)).toEqual([])
    })
  })
}

describe('Link', () => {
  describe('constructor', () => {
    test('definition matches snapshot', () => {
      // Assert
      const def = Link({
        label: 'Link',
      })

      expect(def).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Link({
        label: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: LinkDefinition) {}
    assignTest(Link())
    assignTest(Link({ label: 'Link' }))
    assignTest(Link({ label: undefined }))
  })

  describe('copyData', () => {
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        pageIds: { 'fake-page-id': '[fake-page-id-replaced]' },
        elementKeys: { 'element-key': '[element-key-replaced]' },
      }),
      copyElement: (node) => node,
    }

    test('[OPEN_PAGE] links replace `pageId` if found in replacement context', () => {
      // Act
      const result = Link().copyData(
        {
          type: 'OPEN_PAGE',
          payload: { pageId: 'fake-page-id', openInNewTab: false },
        },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'OPEN_PAGE',
        payload: {
          pageId: '[fake-page-id-replaced]',
          openInNewTab: false,
        },
      })
    })

    test('[OPEN_PAGE] links keep original `pageId` if NOT found in replacement context', () => {
      // Act
      // Act
      const result = Link().copyData(
        {
          type: 'OPEN_PAGE',
          payload: { pageId: 'fake-page-id-2', openInNewTab: false },
        },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'OPEN_PAGE',
        payload: { pageId: 'fake-page-id-2', openInNewTab: false },
      })
    })

    test('[OPEN_PAGE] link sets `pageId` to `null` if tagged in replacement context', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          pageIds: { 'fake-page-id': null },
        }),
        copyElement: (node) => node,
      }

      // Act
      const result = Link().copyData(
        {
          type: 'OPEN_PAGE',
          payload: { pageId: 'fake-page-id', openInNewTab: false },
        },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'OPEN_PAGE',
        payload: { pageId: undefined, openInNewTab: false },
      })
    })

    test('[SCROLL_TO_ELEMENT] links replace `elementKey` if found in replacement context', () => {
      // Act
      const result = Link().copyData(
        {
          type: 'SCROLL_TO_ELEMENT',
          payload: {
            elementIdConfig: { elementKey: 'element-key', propName: 'prop' },
            block: 'start',
          },
        },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'SCROLL_TO_ELEMENT',
        payload: {
          elementIdConfig: {
            elementKey: '[element-key-replaced]',
            propName: 'prop',
          },
          block: 'start',
        },
      })
    })

    test('[SCROLL_TO_ELEMENT] links keep original `elementKey` if NOT found in replacement context', () => {
      const result = Link().copyData(
        {
          type: 'SCROLL_TO_ELEMENT',
          payload: {
            elementIdConfig: { elementKey: 'element-key-2', propName: 'prop' },
            block: 'start',
          },
        },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'SCROLL_TO_ELEMENT',
        payload: {
          elementIdConfig: {
            elementKey: 'element-key-2',
            propName: 'prop',
          },
          block: 'start',
        },
      })
    })

    test.each([
      {
        type: 'OPEN_URL',
        payload: { url: 'https://example.com', openInNewTab: false },
      },
      {
        type: 'SEND_EMAIL',
        payload: { to: 'bob@gmail.com', subject: 'hello', body: 'world' },
      },
      { type: 'CALL_PHONE', payload: { phoneNumber: '555-555-5555' } },
    ] as const)('copies other link types as is', (data) => {
      // Act
      const result = Link().copyData(data, context)

      // Assert
      expect(result).toEqual(data)
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(Link().copyData(value, context)).toBe(value)
    })
  })

  const invalidValues = [
    17,
    'random',
    { key: 'val' },
    {
      type: 'NOT_REAL_LINK_TYPE',
      payload: {},
    },
  ]

  testLinkDefinition(
    Link({ label: 'Link' }),
    [
      null,
      {
        type: 'OPEN_PAGE',
        payload: { pageId: 'fake-page-id-2', openInNewTab: false },
      },
      {
        type: 'OPEN_URL',
        payload: { url: 'https://example.com', openInNewTab: false },
      },
      {
        type: 'SEND_EMAIL',
        payload: { to: 'bob@gmail.com', subject: 'hello', body: 'world' },
      },
      { type: 'CALL_PHONE', payload: { phoneNumber: '555-555-5555' } },
      {
        type: 'SCROLL_TO_ELEMENT',
        payload: {
          elementIdConfig: { elementKey: 'key', propName: 'prop' },
          block: 'start',
        },
      },
    ],
    invalidValues,
  )
})
