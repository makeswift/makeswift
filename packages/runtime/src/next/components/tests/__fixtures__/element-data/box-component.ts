import { type ElementData } from '@makeswift/controls'
import { type BackgroundData } from '@makeswift/prop-controllers'

import { MakeswiftComponentType } from '../../../../../components'

export const boxComponentData = ({
  htmlId,
  backgrounds = [],
}: {
  htmlId: string
  backgrounds: BackgroundData[]
}): ElementData => ({
  key: 'a87eab9c-1c2b-462e-8f79-e836dd836271',
  props: {
    backgrounds: {
      '@@makeswift/type': 'prop-controllers::backgrounds::v2',
      value: [
        {
          deviceId: 'desktop',
          value: backgrounds,
        },
      ],
    },
    id: {
      '@@makeswift/type': 'prop-controllers::element-id::v1',
      value: htmlId,
    },
    margin: {
      '@@makeswift/type': 'prop-controllers::margin::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            marginBottom: {
              unit: 'px',
              value: 60,
            },
            marginTop: {
              unit: 'px',
              value: 40,
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
              value: 470,
            },
            paddingLeft: {
              unit: 'px',
              value: 10,
            },
            paddingRight: {
              unit: 'px',
              value: 10,
            },
            paddingTop: {
              unit: 'px',
              value: 10,
            },
          },
        },
      ],
    },
    width: {
      '@@makeswift/type': 'prop-controllers::width::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            unit: 'px',
            value: 1160,
          },
        },
      ],
    },
  },
  type: MakeswiftComponentType.Box,
})

export const imageBackgroundData = (imageId: string): BackgroundData => ({
  id: 'd710554f-3b2a-4dc5-8785-44224d09e579',
  payload: {
    imageId,
    opacity: 0.9,
    parallax: 0,
    position: {
      x: 0,
      y: 0,
    },
    priority: true,
    size: 'contain',
  },
  type: 'image',
})
