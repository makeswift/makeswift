import { type DataType } from '@makeswift/controls'
import { RichTextV2Definition } from '../../rich-text-v2'

export const sourceElementTree: DataType<RichTextV2Definition> = {
  type: 'makeswift::controls::rich-text-v2',
  version: 2,
  descendants: [
    {
      children: [
        {
          children: [
            { text: '' },
            {
              children: [
                {
                  text: 'Adyen',
                  typography: {
                    id: 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc=',
                    style: [
                      {
                        deviceId: 'desktop',
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA==',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              link: {
                payload: { openInNewTab: true, url: 'https://www.bigcommerce.com/adyen' },
                type: 'OPEN_URL',
              },
              type: 'link',
            },
            { text: '' },
          ],
          textAlign: [{ deviceId: 'mobile', value: null }],
          type: 'paragraph',
        },
        {
          children: [
            { text: '' },
            {
              children: [
                {
                  text: 'Authorize.net',
                  typography: {
                    id: 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc=',
                    style: [
                      {
                        deviceId: 'desktop',
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA==',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              link: {
                payload: { openInNewTab: true, url: 'http://www.authorize.net/' },
                type: 'OPEN_URL',
              },
              type: 'link',
            },
            { text: '' },
          ],
          textAlign: [{ deviceId: 'mobile', value: null }],
          type: 'paragraph',
        },
        {
          children: [
            { text: '' },
            {
              children: [
                {
                  text: 'BlueSnap',
                  typography: {
                    id: 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc=',
                    style: [
                      {
                        deviceId: 'desktop',
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA==',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              link: {
                payload: { openInNewTab: true, url: 'https://www.bigcommerce.com/bluesnap/' },
                type: 'OPEN_URL',
              },
              type: 'link',
            },
            { text: '' },
          ],
          textAlign: [{ deviceId: 'mobile', value: null }],
          type: 'paragraph',
        },
        {
          children: [
            { text: '' },
            {
              children: [
                {
                  text: 'Checkout.com',
                  typography: {
                    id: 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc=',
                    style: [
                      {
                        deviceId: 'desktop',
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA==',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              link: {
                payload: {
                  openInNewTab: true,
                  url: 'https://support.bigcommerce.com/s/article/Connecting-with-Checkoutcom/',
                },
                type: 'OPEN_URL',
              },
              type: 'link',
            },
            { text: '' },
          ],
          textAlign: [{ deviceId: 'mobile', value: null }],
          type: 'paragraph',
        },
        {
          children: [
            { text: '' },
            {
              children: [
                {
                  text: 'CyberSource Direct',
                  typography: {
                    id: 'VHlwb2dyYXBoeTowNGI4OTZlMC0wZWEyLTRkMTMtYmU3ZS0xYmY1M2VmMjBiZjc=',
                    style: [
                      {
                        deviceId: 'desktop',
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOmJkODYxMWM5LTNiZjItNDM3MS1iMmU4LTBmMmNlMDZjNDE1OA==',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              link: {
                payload: { openInNewTab: true, url: 'http://www.cybersource.com/' },
                type: 'OPEN_URL',
              },
              type: 'link',
            },
            { text: '' },
          ],
          textAlign: [{ deviceId: 'mobile', value: null }],
          type: 'paragraph',
        },
      ],
      type: 'paragraph',
    },
  ],
  key: 'c438a1d3-fee2-4eb4-b49b-f1856c12de42',
} as any

export const translatableData = {
  '0': `<a key=\"1\">Adyen</a>`,
  '1': `<a key=\"1\">Authorize.net</a>`,
  '2': `<a key=\"1\">BlueSnap</a>`,
  '3': `<a key=\"1\">Checkout.com</a>`,
  '4': `<a key=\"1\">CyberSource Direct</a>`,
}
