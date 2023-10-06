import { describe, expect, test } from 'vitest'
import { RichTextV2ControlData, RichTextV2ControlType } from '../rich-text-v2'
import { copy } from '../../control'
import { ReplacementContext } from '../../../state/react-page'

const SWATCH_ID_FROM = 'SWATCH_ID_FROM='
const TYPOGRAPHY_ID_FROM = 'TYPOGRAPHY_ID_FROM='
const PAGE_ID_FROM = 'PAGE_ID_FROM='
const ELEMENT_ID_FROM = 'ELEMENT_ID_FROM='

const SWATCH_ID_TO = 'SWATCH_ID_TO='
const TYPOGRAPHY_ID_TO = 'TYPOGRAPHY_ID_TO='
const PAGE_ID_TO = 'PAGE_ID_TO='
const ELEMENT_ID_TO = 'ELEMENT_ID_TO='

const copyFixture: RichTextV2ControlData = {
  type: RichTextV2ControlType,
  version: 2,
  key: 'uuid',
  descendants: [
    {
      type: 'blockquote',
      children: [
        {
          type: 'link',
          link: {
            type: 'SCROLL_TO_ELEMENT',
            payload: {
              elementIdConfig: {
                elementKey: ELEMENT_ID_FROM,
                propName: 'nice',
              },
              block: 'center',
            },
          },
          children: [
            {
              text: 'scroll to that element',
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      children: [
        {
          type: 'link',
          link: {
            type: 'OPEN_PAGE',
            payload: {
              pageId: PAGE_ID_FROM,
              openInNewTab: false,
            },
          },
          children: [
            {
              text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
              typography: {
                id: TYPOGRAPHY_ID_FROM,
                style: [
                  {
                    deviceId: 'desktop',
                    value: {
                      color: {
                        swatchId: SWATCH_ID_FROM,
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

describe('GIVEN copying RichTextV2', () => {
  test('GIVEN swatch, typography, page, and element ids THEN all are copied', () => {
    const expected = JSON.parse(
      JSON.stringify(copyFixture)
        .replace(SWATCH_ID_FROM, SWATCH_ID_TO)
        .replace(TYPOGRAPHY_ID_FROM, TYPOGRAPHY_ID_TO)
        .replace(PAGE_ID_FROM, PAGE_ID_TO)
        .replace(ELEMENT_ID_FROM, ELEMENT_ID_TO),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map([[ELEMENT_ID_FROM, ELEMENT_ID_TO]]),
      swatchIds: new Map([[SWATCH_ID_FROM, SWATCH_ID_TO]]),
      fileIds: new Map(),
      typographyIds: new Map([[TYPOGRAPHY_ID_FROM, TYPOGRAPHY_ID_TO]]),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map([[PAGE_ID_FROM, PAGE_ID_TO]]),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copy({ type: RichTextV2ControlType, config: {} }, copyFixture, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    expect(result.descendants).toStrictEqual(expected.descendants)
  })
})
