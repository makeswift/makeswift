/** @jest-environment jsdom */
import { RichText } from '../../../../controls'
import { APIResourceType } from '../../../../api'

import * as Fixture from './fixtures/rich-text-v2'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('RichTextV2', () => {
    test.each([RichText.Mode.Inline, RichText.Mode.Block])(
      `renders a %s placeholder when empty`,
      async mode => {
        await testPageControlPropRendering(RichText({ mode }), {
          value: undefined,
          expectedRenders: 1,
        })
      },
    )

    test(`renders provided text content`, async () => {
      const swatchId = 'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA=='
      const typographyId = 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc='

      await testPageControlPropRendering(RichText(), {
        value: Fixture.data,
        cacheData: {
          apiResources: {
            Swatch: [
              {
                id: swatchId,
                value: {
                  __typename: APIResourceType.Swatch,
                  id: swatchId,
                  hue: 238,
                  saturation: 87,
                  lightness: 49,
                },
              },
            ],
            Typography: [
              {
                id: typographyId,
                value: {
                  __typename: APIResourceType.Typography,
                  id: typographyId,
                  name: 'Body',
                  style: [
                    {
                      deviceId: 'desktop',
                      value: {
                        fontFamily: 'Lato',
                        fontSize: { value: 16, unit: 'px' },
                        color: null,
                        lineHeight: null,
                        letterSpacing: null,
                        fontWeight: null,
                        textAlign: null,
                        uppercase: null,
                        underline: null,
                        strikethrough: null,
                        italic: null,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedRenders: 1,
      })
    })
  })
})
