import { type DataType } from '@makeswift/controls'
import { RichTextV2Definition } from '../../rich-text-v2'
import { InlineType } from '../../../../slate'

export const sourceElementTree: DataType<RichTextV2Definition> = {
  type: 'makeswift::controls::rich-text-v2',
  version: 2,
  descendants: [
    {
      type: 'default',
      children: [
        {
          text: 'One',
          typography: {
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontSize: {
                    unit: 'px',
                    value: 18,
                  },
                  fontWeight: 400,
                  lineHeight: 1.5,
                },
              },
            ],
          },
        },
        {
          type: InlineType.Code,
          children: [{ text: 'Two' }],
        },
        {
          text: 'Three',
        },
        {
          type: InlineType.SubScript,
          children: [{ text: 'Four' }],
        },
        {
          text: 'Five',
        },
        {
          type: InlineType.SuperScript,
          children: [{ text: 'Six' }],
        },
      ],
    },
  ],
  key: 'ca60c3c4-5850-46a6-bc3f-a2e5b481f76f',
}

export const translatableData = {
  '0': `<span key="0">One</span><code key="1"><span key="1:0">Two</span></code><span key="2">Three</span><sub key="3"><span key="3:0">Four</span></sub><span key="4">Five</span><sup key="5"><span key="5:0">Six</span></sup>`,
}

export const targetElementTree: DataType<RichTextV2Definition> = {
  type: 'makeswift::controls::rich-text-v2',
  version: 2,
  descendants: [
    {
      children: [
        { text: '' },
        {
          type: InlineType.SuperScript,
          children: [{ text: 'SixPrime' }],
        },
        {
          text: 'OnePrime',
          typography: {
            style: [
              {
                deviceId: 'desktop',
                value: {
                  fontSize: {
                    unit: 'px',
                    value: 18,
                  },
                  fontWeight: 400,
                  lineHeight: 1.5,
                },
              },
            ],
          },
        },
        {
          text: 'ThreePrime',
        },
        {
          type: InlineType.SubScript,
          children: [{ text: 'FourPrime' }],
        },
        { text: '' },
        {
          type: InlineType.Code,
          children: [{ text: 'TwoPrime' }],
        },
        {
          text: 'FivePrime',
        },
      ],

      type: 'default',
    },
  ],
  key: 'ca60c3c4-5850-46a6-bc3f-a2e5b481f76f',
}

export const translatedData = {
  '0': `<sup key="5"><span key="5:0">SixPrime</span></sup><span key="0">OnePrime</span><span key="2">ThreePrime</span><sub key="3"><span key="3:0">FourPrime</span></sub><code key="1"><span key="1:0">TwoPrime</span></code><span key="4">FivePrime</span>`,
}
