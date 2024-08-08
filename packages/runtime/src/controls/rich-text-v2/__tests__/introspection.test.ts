import { type DataType, Targets } from '@makeswift/controls'
import { RichText, RichTextV2Definition } from '../../rich-text-v2'

const SWATCH_ID = 'SWATCH_ID='
const TYPOGRAPHY_ID = 'TYPOGRAPHY_ID='
const PAGE_ID = 'PAGE_ID='

const introspectionFixture: DataType<RichTextV2Definition> = {
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
  test.each([
    [Targets.Swatch, [SWATCH_ID]],
    [Targets.Typography, [TYPOGRAPHY_ID]],
    [Targets.Page, [PAGE_ID]],
  ])('WHEN target is %s THEN correct ids are returned (%o)', (target, expected) => {
    expect(RichText().introspect(introspectionFixture, target)).toStrictEqual(expected)
  })
})
