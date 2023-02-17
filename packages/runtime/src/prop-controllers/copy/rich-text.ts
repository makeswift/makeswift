import { InlineJSON, MarkJSON, NodeJSON } from '../../old-slate-types'
import { CopyContext, ReplacementContext } from '../../state/react-page'
import { RichTextValue } from '../descriptors'

export function copy(
  value: RichTextValue | undefined,
  context: CopyContext,
): RichTextValue | undefined {
  if (value == null) return value

  return { ...value, document: value.document ? copyNode(value.document) : value.document }

  function copyNode<T extends NodeJSON>(node: T): T {
    switch (node.object) {
      case 'document':
      case 'block':
      case 'inline':
        // @ts-expect-error: TypeScript can't refine the generic type T, even though it can
        // refine NodeJSON.
        return copyInline(node)

      case 'text':
        return { ...node, marks: node.marks?.map(copyMark) }

      default:
        return node
    }
  }

  function copyInline(inline: InlineJSON): InlineJSON {
    switch (inline.type) {
      case 'link':
        return {
          ...inline,
          nodes: inline.nodes?.map(copyNode),
          data: inline.data ? copyLinkData(inline.data as any) : inline.data,
        }

      default:
        return { ...inline, nodes: inline.nodes?.map(copyNode) }
    }
  }

  function copyLinkData(data: any): any {
    switch (data.type) {
      case 'OPEN_PAGE': {
        const pageId = data.payload.pageId

        if (pageId == null) return data

        return {
          ...data,
          payload: {
            ...data.payload,
            pageId: context.replacementContext.pageIds.get(pageId) ?? data.payload.pageId,
          },
        }
      }

      case 'SCROLL_TO_ELEMENT': {
        const elementIdConfig = data.payload.elementIdConfig

        if (elementIdConfig == null) return data

        return {
          ...data,
          payload: {
            ...data.payload,
            elementIdConfig: {
              ...elementIdConfig,
              elementKey:
                context.replacementContext.elementKeys.get(elementIdConfig.elementKey) ??
                elementIdConfig.elementKey,
            },
          },
        }
      }

      default:
        return data
    }
  }

  function copyMark(mark: MarkJSON): MarkJSON {
    switch (mark.type) {
      case 'typography': {
        const typographyId = mark.data?.value.id

        return {
          ...mark,
          data: {
            ...mark.data,
            value: {
              ...mark.data?.value,
              id: context.replacementContext.typographyIds.get(typographyId) ?? typographyId,
              style: mark.data?.value.style.map((override: any) => ({
                ...override,
                value: {
                  ...override.value,
                  color:
                    override.value.color == null
                      ? override.value.color
                      : {
                          ...override.value.color,
                          swatchId:
                            context.replacementContext.swatchIds.get(
                              override.value.color?.swatchId,
                            ) ?? override.value.color?.swatchId,
                        },
                },
              })),
            },
          },
        }
      }

      default:
        return mark
    }
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('rich text copy', () => {
    test('replaces the swatch id', () => {
      // Arrange
      const data: RichTextValue = {
        object: 'value',
        document: {
          data: {},
          nodes: [
            {
              data: {},
              type: 'paragraph',
              nodes: [
                {
                  text: 'Hello world',
                  marks: [
                    {
                      data: {
                        value: {
                          id: 'VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=',
                          style: [
                            {
                              value: {
                                color: {
                                  alpha: 1,
                                  swatchId:
                                    'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
                                },
                                fontSize: {
                                  unit: 'px',
                                  value: 23,
                                },
                                lineHeight: 2.5,
                                strikethrough: true,
                              },
                              deviceId: 'desktop',
                            },
                          ],
                        },
                      },
                      type: 'typography',
                      object: 'mark',
                    },
                  ],
                  object: 'text',
                },
              ],
              object: 'block',
            },
          ],
          object: 'document',
        },
        selection: {
          focus: {
            path: [0, 0],
            object: 'point',
            offset: 0,
          },
          anchor: {
            path: [0, 0],
            object: 'point',
            offset: 0,
          },
          object: 'selection',
          isFocused: false,
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data)
          .replace('U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'swatch-testing')
          .replace(
            'VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=',
            'typography-testing',
          ),
      )

      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map([
          ['U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'swatch-testing'],
        ]),
        fileIds: new Map(),
        typographyIds: new Map([
          [
            'VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=',
            'typography-testing',
          ],
        ]),
        tableIds: new Map(),
        tableColumnIds: new Map(),
        pageIds: new Map(),
        globalElementIds: new Map(),
        globalElementData: new Map(),
      }

      // Act
      const result = copy(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
