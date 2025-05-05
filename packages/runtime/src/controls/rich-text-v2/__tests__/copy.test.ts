import { createClearContext, createReplacementContext } from '@makeswift/controls'
import { type DataType } from '@makeswift/controls'
import { RichText, RichTextV2Definition } from '../../rich-text-v2'

const SWATCH_ID_FROM = 'SWATCH_ID_FROM='
const TYPOGRAPHY_ID_FROM = 'TYPOGRAPHY_ID_FROM='
const PAGE_ID_FROM = 'PAGE_ID_FROM='
const ELEMENT_ID_FROM = 'ELEMENT_ID_FROM='

const SWATCH_ID_TO = 'SWATCH_ID_TO='
const TYPOGRAPHY_ID_TO = 'TYPOGRAPHY_ID_TO='
const PAGE_ID_TO = 'PAGE_ID_TO='
const ELEMENT_ID_TO = 'ELEMENT_ID_TO='

const copyFixture: DataType<RichTextV2Definition> = {
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
        .replace(ELEMENT_ID_FROM, ELEMENT_ID_TO)
        .replace(SWATCH_ID_FROM, SWATCH_ID_TO)
        .replace(TYPOGRAPHY_ID_FROM, TYPOGRAPHY_ID_TO)
        .replace(PAGE_ID_FROM, PAGE_ID_TO),
    )

    // Act
    const result = RichText().copyData(copyFixture, {
      replacementContext: createReplacementContext({
        elementKeys: { [ELEMENT_ID_FROM]: ELEMENT_ID_TO },
        swatchIds: { [SWATCH_ID_FROM]: SWATCH_ID_TO },
        typographyIds: { [TYPOGRAPHY_ID_FROM]: TYPOGRAPHY_ID_TO },
        pageIds: { [PAGE_ID_FROM]: PAGE_ID_TO },
      }),
      clearContext: createClearContext({}),
      copyElement: node => node,
    })

    expect(RichText.isV1Data(result)).toBe(false)
    expect(RichText.isV1Data(result) ? null : result?.descendants).toStrictEqual(
      expected.descendants,
    )
  })
})
