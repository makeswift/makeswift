import { type DataType } from '@makeswift/controls'
import { RichTextV2Definition } from '../../rich-text-v2'

export const translatableData = {
  '0': '<span key="0" >One</span>',
  '1': '<span key="0">Two</span><code key="1"><span key="1:0">Two</span></code>',
  '2': '<span key="0">Three</span>',
  '3:0:0': '<span key="0">Four</span>',
  '3:0:1:0:0': '<span key="0">Five</span>',
  '3:1:0': '<span key="0">Six</span>',
}

export const sourceElementTree: DataType<RichTextV2Definition> = {
  type: 'makeswift::controls::rich-text-v2',
  version: 2,
  descendants: [
    {
      type: 'default',
      children: [
        {
          text: 'One',
        },
      ],
    },
    {
      type: 'default',
      children: [
        {
          text: 'Two',
        },
        {
          type: 'code',
          children: [{ text: 'Two' }],
        },
      ],
    },
    {
      type: 'default',
      children: [
        {
          text: 'Three',
        },
      ],
    },
    {
      children: [
        {
          children: [
            {
              type: 'list-item-child',
              children: [
                {
                  text: 'Four',
                },
              ],
            },
            {
              children: [
                {
                  children: [
                    {
                      type: 'list-item-child',
                      children: [
                        {
                          text: 'Five',
                        },
                      ],
                    },
                  ],
                  type: 'list-item',
                },
              ],
              type: 'unordered-list',
            },
          ],
          type: 'list-item',
        },
        {
          children: [
            {
              type: 'list-item-child',
              children: [
                {
                  text: 'Six',
                },
              ],
            },
          ],
          type: 'list-item',
        },
      ],
      type: 'unordered-list',
    },
  ],
  key: 'ca60c3c4-5850-46a6-bc3f-a2e5b481f76f',
}

export const translatedData = {
  '0': '<span>OnePrime</span>',
  '1': '<span>TwoPrime</span><code><span>TwoPrimePrime</span></code>',
  '2': '<span>ThreePrime</span>',
  '3:0:0': '<span>FourPrime</span>',
  '3:0:1:0:0': '<span>FivePrime</span>',
  '3:1:0': '<span>SixPrime</span>',
}

export const targetElementTree: DataType<RichTextV2Definition> = {
  type: 'makeswift::controls::rich-text-v2',
  version: 2,
  descendants: [
    {
      type: 'default',
      children: [
        {
          text: 'OnePrime',
        },
      ],
    },
    {
      type: 'default',
      children: [
        {
          text: 'TwoPrime',
        },
        {
          type: 'code',
          children: [{ text: 'TwoPrimePrime' }],
        },
        {
          text: '',
        },
      ],
    },
    {
      type: 'default',
      children: [
        {
          text: 'ThreePrime',
        },
      ],
    },
    {
      children: [
        {
          children: [
            {
              type: 'list-item-child',
              children: [
                {
                  text: 'FourPrime',
                },
              ],
            },
            {
              children: [
                {
                  children: [
                    {
                      type: 'list-item-child',
                      children: [
                        {
                          text: 'FivePrime',
                        },
                      ],
                    },
                  ],
                  type: 'list-item',
                },
              ],
              type: 'unordered-list',
            },
          ],
          type: 'list-item',
        },
        {
          children: [
            {
              type: 'list-item-child',
              children: [
                {
                  text: 'SixPrime',
                },
              ],
            },
          ],
          type: 'list-item',
        },
      ],
      type: 'unordered-list',
    },
  ],
  key: 'ca60c3c4-5850-46a6-bc3f-a2e5b481f76f',
}
