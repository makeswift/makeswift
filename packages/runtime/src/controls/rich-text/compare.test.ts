import { describe, expect, test } from 'vitest'
import { RichTextDAO } from './types'
import { compareRichTextDAO } from './compare'

describe('GIVEN I am using RichText data comparison', () => {
  test('WHEN I compare basic text nodes THEN comparison works', () => {
    const value: RichTextDAO = [
      {
        type: 'text',
        text: 'test',
      },
    ]
    const nextValue: RichTextDAO = [
      {
        type: 'text',
        text: 'test2',
      },
    ]

    expect(compareRichTextDAO(value, nextValue)).toBeFalsy()
    expect(compareRichTextDAO(value, value)).toBeTruthy()
  })

  test('WHEN I compare typography nodes with different fontsizes THEN comparison works', () => {
    const value: RichTextDAO = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'test',
            type: 'typography',
            typography: {
              id: null,
              style: [
                {
                  deviceId: 'mobile',
                  value: {
                    fontSize: {
                      unit: 'px',
                      value: 17,
                    },
                    // todo:Josh
                  } as any,
                },
              ],
              // todo:Josh
            } as any,
          },
        ],
      },
    ]
    const nextValue: RichTextDAO = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'test',
            type: 'typography',
            typography: {
              id: null,
              style: [
                {
                  deviceId: 'mobile',
                  value: {
                    fontSize: {
                      unit: 'px',
                      value: 16,
                    },
                    // todo:Josh
                  } as any,
                },
              ],
              // todo:Josh
            } as any,
          },
        ],
      },
    ]

    expect(compareRichTextDAO(value, nextValue)).toBeFalsy()
    expect(compareRichTextDAO(value, value)).toBeTruthy()
  })

  test('WHEN I compare typography nodes when new Typography has been added THEN comparison works', () => {
    const value: RichTextDAO = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'test',
            type: 'typography',
            typography: {
              id: null,
              style: [],
              // todo:Josh
            } as any,
          },
        ],
      },
    ]
    const nextValue: RichTextDAO = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'test',
            type: 'typography',
            typography: {
              id: null,
              style: [
                {
                  deviceId: 'mobile',
                  value: {
                    underline: true,
                    // todo:Josh
                  } as any,
                },
              ],
              // todo:Josh
            } as any,
          },
        ],
      },
    ]

    expect(compareRichTextDAO(value, nextValue)).toBeFalsy()
    expect(compareRichTextDAO(value, value)).toBeTruthy()
  })
})
