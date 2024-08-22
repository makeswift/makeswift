import { type DataType, Targets } from '@makeswift/controls'
import { RichText, RichTextV2Definition } from '../../rich-text-v2'

const SWATCH_ID = 'SWATCH_ID='
const TYPOGRAPHY_ID = 'TYPOGRAPHY_ID='
const PAGE_ID = 'PAGE_ID='

const introspectionFixtureV1: DataType<RichTextV2Definition> = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'blockquote',
        nodes: [
          {
            object: 'inline',
            type: 'link',
            data: {
              type: 'OPEN_PAGE',
              payload: {
                pageId: PAGE_ID,
                openInNewTab: false,
              },
            },
            nodes: [
              {
                text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
                marks: [
                  {
                    data: {
                      value: {
                        id: TYPOGRAPHY_ID,
                        style: [
                          {
                            value: {
                              color: {
                                swatchId: SWATCH_ID,
                                alpha: 1,
                              },
                            },
                          },
                          {
                            value: {
                              fontWeight: 500,
                            },
                          },
                          {
                            value: {
                              color: {
                                swatchId: undefined,
                                alpha: 1,
                              },
                            },
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
          },
        ],
        object: 'block',
      },
    ],
    object: 'document',
  },
  selection: {
    focus: {
      path: [1, 2],
      object: 'point',
      offset: 0,
    },
    marks: undefined,
    anchor: {
      path: [0, 0],
      object: 'point',
      offset: 0,
    },
    object: 'selection',
    isFocused: false,
  },
}

const introspectionFixtureV2: DataType<RichTextV2Definition> = {
  type: RichTextV2Definition.type,
  version: 2,
  key: 'uuid',
  descendants: [
    {
      type: 'blockquote',
      children: [
        {
          type: 'link',
          link: {
            type: 'OPEN_PAGE',
            payload: {
              pageId: PAGE_ID,
              openInNewTab: false,
            },
          },
          children: [
            {
              text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
              typography: {
                id: TYPOGRAPHY_ID,
                style: [
                  {
                    deviceId: 'desktop',
                    value: {
                      color: {
                        swatchId: SWATCH_ID,
                        alpha: 1,
                      },
                    },
                  },
                  {
                    deviceId: 'desktop',
                    value: { fontWeight: 500 },
                  },
                  {
                    deviceId: 'desktop',
                    value: { color: { swatchId: null, alpha: 1 } },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}

describe('GIVEN introspecting RichTextV2', () => {
  describe('v1 data', () => {
    test.each([
      [Targets.Swatch, [SWATCH_ID]],
      [Targets.Typography, [TYPOGRAPHY_ID]],
      [Targets.Page, [PAGE_ID]],
    ])('WHEN target is %s THEN correct ids are returned (%o)', (target, expected) => {
      expect(RichTextV2Definition.isV1Data(introspectionFixtureV1)).toBe(true)
      expect(RichText().introspect(introspectionFixtureV1, target)).toStrictEqual(expected)
    })
  })

  describe('v2 data', () => {
    test.each([
      [Targets.Swatch, [SWATCH_ID]],
      [Targets.Typography, [TYPOGRAPHY_ID]],
      [Targets.Page, [PAGE_ID]],
    ])('WHEN target is %s THEN correct ids are returned (%o)', (target, expected) => {
      expect(RichTextV2Definition.isV1Data(introspectionFixtureV2)).toBe(false)
      expect(RichText().introspect(introspectionFixtureV2, target)).toStrictEqual(expected)
    })
  })
})
