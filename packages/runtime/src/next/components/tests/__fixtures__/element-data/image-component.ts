import { type ElementData } from '@makeswift/controls'

import { MakeswiftComponentType } from '../../../../../components'

export const imageComponentData = ({
  htmlId,
  swatchId,
  fileId,
}: {
  htmlId: string
  swatchId: string
  fileId: string
}): ElementData => ({
  key: '53d97944-87d4-4337-8260-a11c6bad827b',
  props: {
    altText: {
      '@@makeswift/type': 'prop-controllers::text-input::v1',
      value: 'Hill chart',
    },
    border: {
      '@@makeswift/type': 'prop-controllers::border::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            borderBottom: {
              color: {
                alpha: 1,
                swatchId,
              },
              style: 'solid',
              width: 2,
            },
            borderLeft: {
              color: {
                alpha: 1,
                swatchId,
              },
              style: 'solid',
              width: 2,
            },
            borderRight: {
              color: {
                alpha: 1,
                swatchId,
              },
              style: 'solid',
              width: 2,
            },
            borderTop: {
              color: {
                alpha: 1,
                swatchId,
              },
              style: 'solid',
              width: 2,
            },
          },
        },
      ],
    },
    borderRadius: {
      '@@makeswift/type': 'prop-controllers::border-radius::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            borderBottomLeftRadius: {
              unit: 'px',
              value: 6,
            },
            borderBottomRightRadius: {
              unit: 'px',
              value: 6,
            },
            borderTopLeftRadius: {
              unit: 'px',
              value: 6,
            },
            borderTopRightRadius: {
              unit: 'px',
              value: 6,
            },
          },
        },
      ],
    },
    file: {
      '@@makeswift/type': 'prop-controllers::image::v2',
      value: {
        id: fileId,
        type: 'makeswift-file',
        version: 1,
      },
    },
    id: {
      '@@makeswift/type': 'prop-controllers::element-id::v1',
      value: htmlId,
    },
    link: {
      '@@makeswift/type': 'prop-controllers::link::v1',
      value: {
        payload: {
          openInNewTab: false,
          url: 'https://www.makeswift.com/',
        },
        type: 'OPEN_URL',
      },
    },
    margin: {
      '@@makeswift/type': 'prop-controllers::margin::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            marginBottom: {
              unit: 'px',
              value: 25,
            },
            marginTop: {
              unit: 'px',
              value: 20,
            },
          },
        },
      ],
    },
    padding: {
      '@@makeswift/type': 'prop-controllers::padding::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            paddingBottom: {
              unit: 'px',
              value: 5,
            },
            paddingLeft: {
              unit: 'px',
              value: 5,
            },
            paddingRight: {
              unit: 'px',
              value: 5,
            },
            paddingTop: {
              unit: 'px',
              value: 5,
            },
          },
        },
      ],
    },
    priority: {
      '@@makeswift/type': 'prop-controllers::checkbox::v1',
      value: true,
    },
    width: {
      '@@makeswift/type': 'prop-controllers::width::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            unit: '%',
            value: 90,
          },
        },
      ],
    },
  },
  type: MakeswiftComponentType.Image,
})
