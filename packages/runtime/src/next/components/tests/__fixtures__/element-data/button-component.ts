import { type ElementData } from '@makeswift/controls'
import { LinkData } from '@makeswift/prop-controllers'

import { MakeswiftComponentType } from '../../../../../components/builtin/constants'

export const buttonComponentData = ({
  htmlId,
  linkData,
}: {
  htmlId: string
  linkData: LinkData
}): ElementData => ({
  key: '3dda7ade-3dcb-4776-a2f5-2f7e04e34ec2',
  props: {
    id: {
      '@@makeswift/type': 'prop-controllers::element-id::v1',
      value: htmlId,
    },
    link: {
      '@@makeswift/type': 'prop-controllers::link::v1',
      value: linkData,
    },
    margin: {
      '@@makeswift/type': 'prop-controllers::margin::v1',
      value: [
        {
          deviceId: 'desktop',
          value: {
            marginBottom: {
              unit: 'px',
              value: 80,
            },
            marginTop: {
              unit: 'px',
              value: 60,
            },
          },
        },
      ],
    },
  },
  type: MakeswiftComponentType.Button,
})

export const linkUrlData = (url: string = 'https://www.makeswift.com/'): LinkData => ({
  payload: {
    openInNewTab: false,
    url,
  },
  type: 'OPEN_URL',
})

export const linkData: Record<string, LinkData> = {
  page: {
    payload: {
      openInNewTab: false,
      pageId: 'UGFnZTozOWZkNDcyZS03N2QxLTRjZDItOGE3Yi02ZTQ2MDU3ODgxNzM=',
    },
    type: 'OPEN_PAGE',
  },
  url: linkUrlData(),
  email: {
    payload: {
      body: '',
      subject: 'Buttons',
      to: 'alan@makeswift.com',
    },
    type: 'SEND_EMAIL',
  },
  phone: {
    payload: {
      phoneNumber: '15551234567',
    },
    type: 'CALL_PHONE',
  },
  element: {
    payload: {
      block: 'start',
      elementIdConfig: {
        elementKey: '3dda7ade-3dcb-4776-a2f5-2f7e04e34ec2',
        propName: 'id',
      },
    },
    type: 'SCROLL_TO_ELEMENT',
  },
}
