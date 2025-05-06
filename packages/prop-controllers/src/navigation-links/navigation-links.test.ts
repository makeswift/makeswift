import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'
import { RemoveResourceTag, createReplacementContext } from '@makeswift/controls'
import {
  NavigationLinksDescriptor,
  NavigationLinksPropControllerDataV0,
  NavigationLinksPropControllerDataV1,
  NavigationLinksPropControllerDataV1Type,
  NavigationLinksData,
  createNavigationLinksPropControllerDataFromNavigationLinksData,
  getNavigationLinksPropControllerDataNavigationLinksData,
  getNavigationLinksPropControllerPageIds,
  getNavigationLinksPropControllerSwatchIds,
  copyNavigationLinksPropControllerData,
} from './navigation-links'

describe('NavigationLinksPropController', () => {
  describe('getNavigationLinksPropControllerDataNavigationLinksData', () => {
    test('returns value for NavigationLinksPropControllerDataV1Type', () => {
      // Arrange
      const data: NavigationLinksPropControllerDataV1 = {
        [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
        value: [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'Link',
            },
          },
        ],
      }

      // Act
      const result =
        getNavigationLinksPropControllerDataNavigationLinksData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for NavigationLinksPropControllerDataV0 data', () => {
      // Arrange
      const data: NavigationLinksPropControllerDataV0 = [
        {
          id: '1',
          type: 'button',
          payload: {
            label: 'Link',
          },
        },
      ]

      // Act
      const result =
        getNavigationLinksPropControllerDataNavigationLinksData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createNavigationLinksPropControllerDataFromNavigationLinksData', () => {
    test('returns NavigationLinksPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const data: NavigationLinksData = [
        {
          id: '1',
          type: 'button',
          payload: {
            label: 'Link',
          },
        },
      ]
      const definition: NavigationLinksDescriptor = {
        type: Types.NavigationLinks,
        version: 1,
        options: {},
      }

      // Act
      const result =
        createNavigationLinksPropControllerDataFromNavigationLinksData(
          data,
          definition,
        )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns NavigationLinksData value when definition version is not 1', () => {
      // Arrange
      const data: NavigationLinksData = [
        {
          id: '1',
          type: 'button',
          payload: {
            label: 'Link',
          },
        },
      ]
      const definition: NavigationLinksDescriptor = {
        type: Types.NavigationLinks,
        options: {},
      }

      // Act
      const result =
        createNavigationLinksPropControllerDataFromNavigationLinksData(
          data,
          definition,
        )

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('getNavigationLinksPropControllerPageIds', () => {
    test('returns empty array for null or undefined data', () => {
      // Arrange
      const nullData = null
      const undefinedData = undefined

      // Act
      const nullResult = getNavigationLinksPropControllerPageIds(nullData)
      const undefinedResult =
        getNavigationLinksPropControllerPageIds(undefinedData)

      // Assert
      expect(nullResult).toEqual([])
      expect(undefinedResult).toEqual([])
    })

    describe('v1 data', () => {
      test('returns page ids for button links with OPEN_PAGE type', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'button',
                link: {
                  type: 'OPEN_PAGE',
                  payload: {
                    pageId: 'page1',
                    openInNewTab: false,
                  },
                },
              },
            },
            {
              id: '2',
              type: 'button',
              payload: {
                label: 'button',
                link: {
                  type: 'OPEN_PAGE',
                  payload: {
                    pageId: 'page2',
                    openInNewTab: false,
                  },
                },
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerPageIds(data)

        // Assert
        expect(result).toEqual(['page1', 'page2'])
      })

      test('returns page ids for dropdown links with OPEN_PAGE type', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                links: [
                  {
                    id: '1-1',
                    payload: {
                      label: 'button',
                      link: {
                        type: 'OPEN_PAGE',
                        payload: {
                          pageId: 'page1',
                          openInNewTab: false,
                        },
                      },
                    },
                  },
                  {
                    id: '1-2',
                    payload: {
                      label: 'button',
                      link: {
                        type: 'OPEN_PAGE',
                        payload: {
                          pageId: 'page2',
                          openInNewTab: false,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerPageIds(data)

        // Assert
        expect(result).toEqual(['page1', 'page2'])
      })

      test('returns empty array for links with non-OPEN_PAGE type', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'button',
                link: {
                  type: 'OPEN_URL',
                  payload: {
                    url: 'https://example.com',
                    openInNewTab: false,
                  },
                },
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerPageIds(data)

        // Assert
        expect(result).toEqual([])
      })
    })

    describe('v0 data', () => {
      test('returns page ids for button links with OPEN_PAGE type', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'button',
              link: {
                type: 'OPEN_PAGE',
                payload: {
                  pageId: 'page1',
                  openInNewTab: false,
                },
              },
            },
          },
          {
            id: '2',
            type: 'button',
            payload: {
              label: 'button',
              link: {
                type: 'OPEN_PAGE',
                payload: {
                  pageId: 'page2',
                  openInNewTab: false,
                },
              },
            },
          },
        ]

        // Act
        const result = getNavigationLinksPropControllerPageIds(data)

        // Assert
        expect(result).toEqual(['page1', 'page2'])
      })
    })
  })

  describe('getNavigationLinksPropControllerSwatchIds', () => {
    test('returns empty array for null or undefined data', () => {
      // Arrange
      const nullData = null
      const undefinedData = undefined

      // Act
      const nullResult = getNavigationLinksPropControllerSwatchIds(nullData)
      const undefinedResult =
        getNavigationLinksPropControllerSwatchIds(undefinedData)

      // Assert
      expect(nullResult).toEqual([])
      expect(undefinedResult).toEqual([])
    })
    describe('v1 data', () => {
      test('returns swatch ids for button links with color and textColor', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'button',
                color: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch1', alpha: 100 },
                  },
                ],
                textColor: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch2', alpha: 100 },
                  },
                ],
              },
            },
            {
              id: '2',
              type: 'button',
              payload: {
                label: 'button',
                color: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch3', alpha: 100 },
                  },
                ],
                textColor: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch4', alpha: 100 },
                  },
                ],
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual(['swatch1', 'swatch2', 'swatch3', 'swatch4'])
      })

      test('returns swatch ids for dropdown links with color and textColor', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                color: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch1', alpha: 100 },
                  },
                ],
                textColor: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch2', alpha: 100 },
                  },
                ],
                links: [],
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual(['swatch1', 'swatch2'])
      })

      test('returns empty array for links without color or textColor', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'button',
              },
            },
          ],
        }

        // Act
        const result = getNavigationLinksPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual([])
      })
    })

    describe('v0 data', () => {
      test('returns swatch ids for button links with color and textColor', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'button',
              color: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch1', alpha: 100 },
                },
              ],
              textColor: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch2', alpha: 100 },
                },
              ],
            },
          },
          {
            id: '2',
            type: 'button',
            payload: {
              label: 'button',
              color: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch3', alpha: 100 },
                },
              ],
              textColor: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch4', alpha: 100 },
                },
              ],
            },
          },
        ]

        // Act
        const result = getNavigationLinksPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual(['swatch1', 'swatch2', 'swatch3', 'swatch4'])
      })

      test('returns swatch ids for dropdown links with color and textColor', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'dropdown',
            payload: {
              label: 'dropdown',
              color: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch1', alpha: 100 },
                },
              ],
              textColor: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch2', alpha: 100 },
                },
              ],
              links: [],
            },
          },
        ]

        // Act
        const result = getNavigationLinksPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual(['swatch1', 'swatch2'])
      })
    })
  })

  describe('copyNavigationLinksPropControllerData', () => {
    test('returns undefined for undefined data', () => {
      // Arrange
      const data = undefined
      const context: CopyContext = {
        replacementContext: createReplacementContext(),
        copyElement: (el) => el,
      }

      // Act
      const result = copyNavigationLinksPropControllerData(data, context)

      // Assert
      expect(result).toBeUndefined()
    })

    describe('v1 data', () => {
      test('replaces swatch ids', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'button',
                link: {
                  type: 'OPEN_PAGE',
                  payload: {
                    pageId: 'page1',
                    openInNewTab: false,
                  },
                },
                color: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch1', alpha: 100 },
                  },
                ],
              },
            },
            {
              id: '2',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                color: [
                  {
                    deviceId: 'desktop',
                    value: { swatchId: 'swatch1', alpha: 100 },
                  },
                ],
                links: [
                  {
                    id: '2-1',
                    payload: {
                      label: 'link',
                      link: {
                        type: 'OPEN_URL',
                        payload: {
                          url: 'https://example.com',
                          openInNewTab: false,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }
        const context: CopyContext = {
          replacementContext: createReplacementContext({
            swatchIds: { swatch1: 'newSwatch1' },
          }),
          copyElement: (el) => el,
        }
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll('swatch1', 'newSwatch1'),
        )

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })

      test('replaces pageIds', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'link',
                link: {
                  type: 'OPEN_PAGE',
                  payload: {
                    pageId: 'page1',
                    openInNewTab: false,
                  },
                },
              },
            },
            {
              id: '2',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                links: [
                  {
                    id: '2-1',
                    payload: {
                      label: 'button',
                      link: {
                        type: 'OPEN_PAGE',
                        payload: {
                          pageId: 'page1',
                          openInNewTab: false,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }
        const context: CopyContext = {
          replacementContext: createReplacementContext({
            pageIds: { page1: 'newPage1' },
          }),
          copyElement: (el) => el,
        }
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll('page1', 'newPage1'),
        )

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })

      test('removes pageIds marked for removal', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV1 = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'link',
                link: {
                  type: 'OPEN_PAGE',
                  payload: {
                    pageId: 'page1',
                    openInNewTab: false,
                  },
                },
              },
            },
            {
              id: '2',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                links: [
                  {
                    id: '2-1',
                    payload: {
                      label: 'button',
                      link: {
                        type: 'OPEN_PAGE',
                        payload: {
                          pageId: 'page2',
                          openInNewTab: false,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }

        const context: CopyContext = {
          replacementContext: createReplacementContext({
            pageIds: { page1: RemoveResourceTag },
          }),
          copyElement: (el) => el,
        }

        const expected = {
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: [
            {
              id: '1',
              type: 'button',
              payload: {
                label: 'link',
                link: {
                  type: 'OPEN_PAGE',
                  payload: { pageId: undefined, openInNewTab: false },
                },
              },
            },
            {
              id: '2',
              type: 'dropdown',
              payload: {
                label: 'dropdown',
                links: [
                  {
                    id: '2-1',
                    payload: {
                      label: 'button',
                      link: {
                        type: 'OPEN_PAGE',
                        payload: { pageId: 'page2', openInNewTab: false },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('v0 data', () => {
      test('replaces swatch ids', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'button',
              link: {
                type: 'OPEN_PAGE',
                payload: {
                  pageId: 'page1',
                  openInNewTab: false,
                },
              },
              color: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch1', alpha: 100 },
                },
              ],
            },
          },
          {
            id: '2',
            type: 'dropdown',
            payload: {
              label: 'dropdown',
              color: [
                {
                  deviceId: 'desktop',
                  value: { swatchId: 'swatch1', alpha: 100 },
                },
              ],
              links: [
                {
                  id: '2-1',
                  payload: {
                    label: 'link',
                    link: {
                      type: 'OPEN_URL',
                      payload: {
                        url: 'https://example.com',
                        openInNewTab: false,
                      },
                    },
                  },
                },
              ],
            },
          },
        ]
        const context: CopyContext = {
          replacementContext: createReplacementContext({
            swatchIds: { swatch1: 'newSwatch1' },
          }),
          copyElement: (el) => el,
        }
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll('swatch1', 'newSwatch1'),
        )

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })

      test('replaces pageIds', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'link',
              link: {
                type: 'OPEN_PAGE',
                payload: {
                  pageId: 'page1',
                  openInNewTab: false,
                },
              },
            },
          },
          {
            id: '2',
            type: 'dropdown',
            payload: {
              label: 'dropdown',
              links: [
                {
                  id: '2-1',
                  payload: {
                    label: 'button',
                    link: {
                      type: 'OPEN_PAGE',
                      payload: {
                        pageId: 'page1',
                        openInNewTab: false,
                      },
                    },
                  },
                },
              ],
            },
          },
        ]
        const context: CopyContext = {
          replacementContext: createReplacementContext({
            pageIds: { page1: 'newPage1' },
          }),
          copyElement: (el) => el,
        }
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll('page1', 'newPage1'),
        )

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })

      test('removes pageIds marked for removal', () => {
        // Arrange
        const data: NavigationLinksPropControllerDataV0 = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'link',
              link: {
                type: 'OPEN_PAGE',
                payload: { pageId: 'page1', openInNewTab: false },
              },
            },
          },
          {
            id: '2',
            type: 'dropdown',
            payload: {
              label: 'dropdown',
              links: [
                {
                  id: '2-1',
                  payload: {
                    label: 'button',
                    link: {
                      type: 'OPEN_PAGE',
                      payload: { pageId: 'page2', openInNewTab: false },
                    },
                  },
                },
              ],
            },
          },
        ]

        const context: CopyContext = {
          replacementContext: createReplacementContext({
            pageIds: { page1: RemoveResourceTag },
          }),
          copyElement: (el) => el,
        }

        const expected = [
          {
            id: '1',
            type: 'button',
            payload: {
              label: 'link',
              link: {
                type: 'OPEN_PAGE',
                payload: { pageId: undefined, openInNewTab: false },
              },
            },
          },
          {
            id: '2',
            type: 'dropdown',
            payload: {
              label: 'dropdown',
              links: [
                {
                  id: '2-1',
                  payload: {
                    label: 'button',
                    link: {
                      type: 'OPEN_PAGE',
                      payload: { pageId: 'page2', openInNewTab: false },
                    },
                  },
                },
              ],
            },
          },
        ]

        // Act
        const result = copyNavigationLinksPropControllerData(data, context)

        // Assert
        expect(result).toEqual(expected)
      })
    })
  })
})
