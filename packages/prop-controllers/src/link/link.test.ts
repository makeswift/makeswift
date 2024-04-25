import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  LinkPropControllerData,
  LinkPropControllerDataV0,
  LinkPropControllerDataV1,
  LinkPropControllerDataV1Type,
  copyLinkPropControllerData,
  getLinkPropControllerPageIds,
  getLinkPropControllerDataLinkData,
  LinkDescriptor,
  createLinkPropControllerDataFromLinkData,
  LinkData,
} from './link'
import { createReplacementContext } from '../utils/utils'

describe('LinkPropController', () => {
  describe('getLinkPropControllerDataLinkData', () => {
    test('returns value for LinkPropControllerDataV1Type', () => {
      // Arrange
      const data: LinkPropControllerDataV1 = {
        [ControlDataTypeKey]: LinkPropControllerDataV1Type,
        value: {
          type: 'OPEN_PAGE',
          payload: {
            pageId: 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
            openInNewTab: false,
          },
        },
      }

      // Act
      const result = getLinkPropControllerDataLinkData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for LinkPropControllerDataV0 data', () => {
      // Arrange
      const data: LinkPropControllerDataV0 = {
        type: 'OPEN_PAGE',
        payload: {
          pageId: 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
          openInNewTab: false,
        },
      }

      // Act
      const result = getLinkPropControllerDataLinkData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('getLinkPropControllerPageIds', () => {
    test('returns an empty array when linkData is null or undefined', () => {
      expect(getLinkPropControllerPageIds(null)).toEqual([])
      expect(getLinkPropControllerPageIds(undefined)).toEqual([])
    })

    test('returns an empty array when link type is not OPEN_PAGE', () => {
      const linkData: LinkPropControllerData = {
        type: 'OPEN_URL',
        payload: { url: 'https://example.com', openInNewTab: false },
      }

      expect(getLinkPropControllerPageIds(linkData)).toEqual([])
    })

    test('returns an empty array when pageId is null for OPEN_PAGE link type', () => {
      const linkData: LinkPropControllerData = {
        type: 'OPEN_PAGE',
        payload: { pageId: null, openInNewTab: false },
      }

      expect(getLinkPropControllerPageIds(linkData)).toEqual([])
    })

    test('returns an array with the pageId for v0 OPEN_PAGE link type', () => {
      const pageId = 'UGFnZToxMjM0NTY3OA=='
      const linkData: LinkPropControllerData = {
        type: 'OPEN_PAGE',
        payload: { pageId, openInNewTab: false },
      }

      expect(getLinkPropControllerPageIds(linkData)).toEqual([pageId])
    })

    test('returns an array with the pageId for v1 OPEN_PAGE link type', () => {
      const pageId = 'UGFnZToxMjM0NTY3OA=='
      const linkData: LinkPropControllerData = {
        [ControlDataTypeKey]: LinkPropControllerDataV1Type,
        value: {
          type: 'OPEN_PAGE',
          payload: { pageId, openInNewTab: false },
        },
      }

      expect(getLinkPropControllerPageIds(linkData)).toEqual([pageId])
    })
  })

  describe('createLinkPropControllerDataFromLinkData', () => {
    test('returns LinkPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const link: LinkData = {
        type: 'OPEN_PAGE',
        payload: {
          pageId: 'pageId',
          openInNewTab: false,
        },
      }
      const definition: LinkDescriptor = {
        type: Types.Link,
        version: 1,
        options: {},
      }

      // Act
      const result = createLinkPropControllerDataFromLinkData(link, definition)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: LinkPropControllerDataV1Type,
        value: link,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const link: LinkData = {
        type: 'OPEN_PAGE',
        payload: {
          pageId: 'pageId',
          openInNewTab: false,
        },
      }
      const definition: LinkDescriptor = {
        type: Types.Link,
        options: {},
      }

      // Act
      const result = createLinkPropControllerDataFromLinkData(link, definition)

      // Assert
      expect(result).toBe(link)
    })
  })

  describe('copyLinkPropControllerData', () => {
    test('returns undefined when data is undefined', () => {
      expect(
        copyLinkPropControllerData(undefined, {
          replacementContext: createReplacementContext({}),
          copyElement: (node) => node,
        }),
      ).toEqual(undefined)
    })

    test('replaces page id from replacement context for v1 OPEN_PAGE link', () => {
      // Arrange
      const pageId = 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ='
      const data: LinkPropControllerDataV1 = {
        [ControlDataTypeKey]: LinkPropControllerDataV1Type,
        value: {
          type: 'OPEN_PAGE',
          payload: {
            pageId,
            openInNewTab: false,
          },
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data).replace(pageId, 'testing'),
      )

      const replacementContext = createReplacementContext({
        pageIds: new Map([[pageId, 'testing']]),
      })

      // Act
      const result = copyLinkPropControllerData(data, {
        replacementContext: replacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })

    test('replaces page id from replacement context for v0 OPEN_PAGE link', () => {
      // Arrange
      const pageId = 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ='
      const data: LinkPropControllerDataV0 = {
        type: 'OPEN_PAGE',
        payload: {
          pageId,
          openInNewTab: false,
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data).replace(pageId, 'testing'),
      )

      const replacementContext = createReplacementContext({
        pageIds: new Map([[pageId, 'testing']]),
      })

      // Act
      const result = copyLinkPropControllerData(data, {
        replacementContext: replacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })

    test('replaces element key from replacement context for v1 SCROLL_TO_ELEMENT link', () => {
      // Arrange
      const data: LinkPropControllerDataV1 = {
        [ControlDataTypeKey]: LinkPropControllerDataV1Type,
        value: {
          type: 'SCROLL_TO_ELEMENT',
          payload: {
            elementIdConfig: {
              elementKey: 'element-key',
              propName: 'prop-name',
            },
            block: 'start',
          },
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data).replace('element-key', 'new-element-key'),
      )

      const replacementContext = createReplacementContext({
        elementKeys: new Map([['element-key', 'new-element-key']]),
      })

      // Act
      const result = copyLinkPropControllerData(data, {
        replacementContext: replacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })

    test('replaces element key from replacement context for v0 SCROLL_TO_ELEMENT link', () => {
      // Arrange
      const data: LinkPropControllerDataV0 = {
        type: 'SCROLL_TO_ELEMENT',
        payload: {
          elementIdConfig: {
            elementKey: 'element-key',
            propName: 'prop-name',
          },
          block: 'start',
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data).replace('element-key', 'new-element-key'),
      )

      const replacementContext = createReplacementContext({
        elementKeys: new Map([['element-key', 'new-element-key']]),
      })

      // Act
      const result = copyLinkPropControllerData(data, {
        replacementContext: replacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })

  test('handles v0 URL link type', () => {
    // Arrange
    const data: LinkPropControllerDataV0 = {
      type: 'OPEN_URL',
      payload: {
        url: 'https://example.com',
        openInNewTab: false,
      },
    }

    const replacementContext = createReplacementContext()

    // Act
    const result = copyLinkPropControllerData(data, {
      replacementContext: replacementContext,
      copyElement: (node) => node,
    })

    // Assert
    expect(result).toMatchObject(data)
  })

  test('handles v1 URL link type', () => {
    // Arrange
    const data: LinkPropControllerDataV1 = {
      [ControlDataTypeKey]: LinkPropControllerDataV1Type,
      value: {
        type: 'OPEN_URL',
        payload: {
          url: 'https://example.com',
          openInNewTab: false,
        },
      },
    }
    const replacementContext = createReplacementContext()

    // Act
    const result = copyLinkPropControllerData(data, {
      replacementContext: replacementContext,
      copyElement: (node) => node,
    })

    // Assert
    expect(result).toMatchObject(data)
  })
})
