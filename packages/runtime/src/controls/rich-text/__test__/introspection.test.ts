import { describe, expect, test } from 'vitest'
import { RichTextControlData, RichTextControlType } from '../rich-text'
import { getPageIds, getSwatchIds, getTypographyIds } from '../../../prop-controllers/introspection'
import { IndexSignatureHack } from '../../../prop-controllers/descriptors'
import { RichTextV2ControlDefinition, RichTextV2ControlType } from '../../rich-text-v2'
import { LinkPlugin } from '../../../slate/LinkPlugin'
import { TypographyPlugin } from '../../../slate/TypographyPlugin'

const SWATCH_ID = 'SWATCH_ID='
const TYPOGRAPHY_ID = 'TYPOGRAPHY_ID='
const PAGE_ID = 'PAGE_ID='

const introspectionFixture: IndexSignatureHack<RichTextControlData> = {
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

describe('GIVEN introspecting RichText', () => {
  test('WHEN getSwatchIds THEN correct swatches are returned', () => {
    expect(
      getSwatchIds(
        {
          type: RichTextControlType,
        },
        introspectionFixture,
      ),
    ).toStrictEqual([SWATCH_ID])
  })
  test('WHEN getTypographyIds THEN correct typography ids are returned', () => {
    expect(
      getTypographyIds(
        {
          type: RichTextControlType,
        },
        introspectionFixture,
      ),
    ).toStrictEqual([TYPOGRAPHY_ID])
  })
  test('WHEN getPageIds THEN correct page ids are returned', () => {
    expect(
      getPageIds(
        {
          type: RichTextControlType,
        },
        introspectionFixture,
      ),
    ).toStrictEqual([PAGE_ID])
  })
  test('WHEN getXXXXXIds with V2 type THEN correct ids are returned', () => {
    const definition: RichTextV2ControlDefinition = {
      type: RichTextV2ControlType,
      config: {
        plugins: [LinkPlugin(), TypographyPlugin()],
      },
    }
    expect(getTypographyIds(definition, introspectionFixture)).toStrictEqual([TYPOGRAPHY_ID])
    expect(getSwatchIds(definition, introspectionFixture)).toStrictEqual([SWATCH_ID])
    expect(getPageIds(definition, introspectionFixture)).toStrictEqual([PAGE_ID])
  })
})
