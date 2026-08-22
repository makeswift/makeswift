import {
  StyleDefinition as StyleV1Definition,
  DataType,
  Style as StyleV1Control,
} from '@makeswift/controls'
import { APIResource, APIResourceType } from '../../../../../api/types'

export const styleV1Samples: Array<{
  description: string
  controlDefinition: StyleV1Definition
  sampleData: DataType<StyleV1Definition>
  resources: Array<APIResource>
}> = [
  {
    description: 'StyleV1Control.All (with no resources)',
    controlDefinition: StyleV1Control({ properties: StyleV1Control.All }),
    sampleData: {
      borderRadius: [
        {
          deviceId: 'desktop',
          value: {
            borderBottomLeftRadius: {
              unit: 'px',
              value: 15,
            },
            borderBottomRightRadius: {
              unit: 'px',
              value: 15,
            },
            borderTopLeftRadius: {
              unit: 'px',
              value: 15,
            },
            borderTopRightRadius: {
              unit: 'px',
              value: 15,
            },
          },
        },
      ],
      margin: [
        {
          deviceId: 'desktop',
          value: {
            marginBottom: {
              unit: 'px',
              value: 20,
            },
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: {
              unit: 'px',
              value: 0,
            },
          },
        },
      ],
      padding: [
        {
          deviceId: 'desktop',
          value: {
            paddingBottom: {
              unit: 'px',
              value: 20,
            },
            paddingLeft: {
              unit: 'px',
              value: 20,
            },
            paddingTop: {
              unit: 'px',
              value: 0,
            },
            paddingRight: {
              unit: 'px',
              value: 0,
            },
          },
        },
      ],
      textStyle: [
        {
          deviceId: 'desktop',
          value: {
            fontFamily: 'Dancing Script',
            fontSize: {
              unit: 'px',
              value: 25,
            },
            fontStyle: [],
            fontWeight: 400,
            letterSpacing: 1,
            textTransform: [],
          },
        },
      ],
      width: [
        {
          deviceId: 'desktop',
          value: {
            unit: '%',
            value: 100,
          },
        },
      ],
    },
    resources: [],
  },
  {
    description: 'StyleV1Control.Border (with resources)',
    controlDefinition: StyleV1Control({ properties: [StyleV1Control.Border] }),
    sampleData: {
      border: [
        {
          deviceId: 'desktop',
          value: {
            borderBottom: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjY5YzUwNTExLWY1ZDctNDdkOC1iMWI3LWU3ZWY4ZDkzOWY3Yg==',
              },
              style: 'dashed',
              width: 10,
            },
            borderLeft: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjY5YzUwNTExLWY1ZDctNDdkOC1iMWI3LWU3ZWY4ZDkzOWY3Yg==',
              },
              style: 'dashed',
              width: 5,
            },
            borderRight: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjY5YzUwNTExLWY1ZDctNDdkOC1iMWI3LWU3ZWY4ZDkzOWY3Yg==',
              },
              style: 'dashed',
              width: 5,
            },
            borderTop: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjY5YzUwNTExLWY1ZDctNDdkOC1iMWI3LWU3ZWY4ZDkzOWY3Yg==',
              },
              style: 'dashed',
              width: 10,
            },
          },
        },
      ],
    },
    resources: [
      {
        id: 'U3dhdGNoOjY5YzUwNTExLWY1ZDctNDdkOC1iMWI3LWU3ZWY4ZDkzOWY3Yg==',
        __typename: APIResourceType.Swatch,
        hue: 360,
        saturation: 100,
        lightness: 50,
      },
    ],
  },
]
