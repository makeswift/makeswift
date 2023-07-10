import { describe, expect, test } from 'vitest'
import { RichTextV2ControlData, RichTextV2ControlType } from './rich-text-v2'
import { LinkPlugin, TypographyPlugin } from '../../slate'
import { getPageIds, getSwatchIds, getTypographyIds } from '../../prop-controllers/introspection'

const SWATCH_ID = 'SWATCH_ID='
const TYPOGRAPHY_ID = 'TYPOGRAPHY_ID='
const PAGE_ID = 'PAGE_ID='

const introspectionFixture: RichTextV2ControlData = {
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
  test('WHEN getSwatchIds THEN correct swatches are returned', () => {
    expect(
      getSwatchIds(
        {
          type: RichTextV2ControlType,
          config: {
            plugins: [TypographyPlugin()],
          },
        },
        introspectionFixture,
      ),
    ).toStrictEqual([SWATCH_ID])
  })
  test('WHEN getTypographyIds THEN correct typographies are returned', () => {
    expect(
      getTypographyIds(
        {
          type: RichTextV2ControlType,
          config: {
            plugins: [TypographyPlugin()],
          },
        },
        introspectionFixture,
      ),
    ).toStrictEqual([TYPOGRAPHY_ID])
  })
  test('WHEN getPageIds THEN correct pageIds are returned', () => {
    expect(
      getPageIds(
        {
          type: RichTextV2ControlType,
          config: {
            plugins: [LinkPlugin()],
          },
        },
        introspectionFixture,
      ),
    ).toStrictEqual([PAGE_ID])
  })
})
