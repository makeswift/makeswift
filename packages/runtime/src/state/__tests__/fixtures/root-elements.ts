import { Element } from '@makeswift/controls'

export const productOfTheYear: Element = {
  key: '3d357687-70a6-4f18-9f48-91dd8cc9b15c',
  props: {
    children: {
      '@@makeswift/type': 'prop-controllers::grid::v1',
      value: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              spans: [[12], [12]],
              count: 12,
            },
          },
        ],
        elements: [
          {
            key: '68864cd7-e607-4b19-9de2-fafdc9590ffb',
            type: './components/Box/index.js',
            props: {
              padding: [
                {
                  deviceId: 'desktop',
                  value: {
                    paddingTop: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingRight: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingBottom: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingLeft: {
                      value: 10,
                      unit: 'px',
                    },
                  },
                },
              ],
              id: {
                '@@makeswift/type': 'prop-controllers::element-id::v1',
                value: 'hero',
              },
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        spans: [[12], [12], [12]],
                        count: 12,
                      },
                    },
                  ],
                  elements: [
                    {
                      key: 'c4f63f22-24db-43b5-8755-75ed36f1128a',
                      type: './components/Text/index.js',
                      props: {
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              value: 700,
                              unit: 'px',
                            },
                          },
                        ],
                        text: {
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                          descendants: [
                            {
                              type: 'default',
                              children: [
                                {
                                  text: 'The wait is over..',
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            value: 16,
                                            unit: 'px',
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          fontWeight: 700,
                                          fontSize: {
                                            value: 18,
                                            unit: 'px',
                                          },
                                          lineHeight: 1.5,
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                          italic: false,
                                          uppercase: true,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                            },
                          ],
                          key: '03a9ffa2-c08e-4ebd-bce6-a620aa558cfa',
                        },
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                marginTop: {
                                  value: 40,
                                  unit: 'px',
                                },
                                marginRight: 'auto',
                                marginBottom: {
                                  value: 25,
                                  unit: 'px',
                                },
                                marginLeft: 'auto',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      key: 'e3b101a3-e0b9-4c8e-bfa7-c00944669f2c',
                      type: './components/Box/index.js',
                      props: {
                        children: {
                          '@@makeswift/type': 'prop-controllers::grid::v1',
                          value: {
                            columns: [
                              {
                                deviceId: 'desktop',
                                value: {
                                  spans: [[12]],
                                  count: 12,
                                },
                              },
                            ],
                            elements: [
                              {
                                key: '2a29ad75-12cf-4354-870c-3c81af7e2d33',
                                type: './components/Carousel/index.js',
                                props: {
                                  images: [
                                    {
                                      key: '59f9c0f1-7e8f-4210-871d-881e416e7e76',
                                      props: {},
                                    },
                                    {
                                      key: 'e7969c5e-f40c-4cc6-a67f-1414465160ee',
                                      props: {},
                                    },
                                    {
                                      key: 'a1c09893-e327-46e5-9a9f-3155f0cf7923',
                                      props: {},
                                    },
                                  ],
                                  delay: 5,
                                  showArrows: true,
                                  showDots: true,
                                  margin: {
                                    '@@makeswift/type': 'prop-controllers::margin::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          marginTop: {
                                            value: 15,
                                            unit: 'px',
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            ],
                          },
                        },
                        padding: {
                          '@@makeswift/type': 'prop-controllers::padding::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                paddingTop: {
                                  value: 35,
                                  unit: 'px',
                                },
                                paddingRight: {
                                  value: 10,
                                  unit: 'px',
                                },
                                paddingBottom: {
                                  value: 40,
                                  unit: 'px',
                                },
                                paddingLeft: {
                                  value: 10,
                                  unit: 'px',
                                },
                              },
                            },
                          ],
                        },
                        backgrounds: {
                          '@@makeswift/type': 'prop-controllers::backgrounds::v2',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: [
                                {
                                  type: 'color',
                                  id: 'ec143bff-ff66-4f84-aa16-c7a7c0443aff',
                                  payload: {
                                    swatchId:
                                      'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                    alpha: 0.05,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                    {
                      key: 'df7fe449-1c52-4022-92a5-3e4c1ea9223e',
                      type: './components/Text/index.js',
                      props: {
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              value: 700,
                              unit: 'px',
                            },
                          },
                        ],
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                marginTop: {
                                  value: 40,
                                  unit: 'px',
                                },
                                marginRight: 'auto',
                                marginBottom: {
                                  value: 20,
                                  unit: 'px',
                                },
                                marginLeft: 'auto',
                              },
                            },
                          ],
                        },
                        text: {
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                          descendants: [
                            {
                              type: 'default',
                              children: [
                                {
                                  text: "The internet's product of the year is here!",
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            value: 16,
                                            unit: 'px',
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          fontWeight: 700,
                                          fontSize: {
                                            value: 26,
                                            unit: 'px',
                                          },
                                          lineHeight: 1.5,
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                          italic: false,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                            },
                          ],
                          key: 'add88648-ca0e-4b01-b09b-c72f3ea6d330',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          {
            key: 'c9e7d4ba-9511-4d70-bda1-9e5804fe6f27',
            type: './components/Box/index.js',
            props: {
              padding: [
                {
                  deviceId: 'desktop',
                  value: {
                    paddingTop: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingRight: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingBottom: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingLeft: {
                      value: 10,
                      unit: 'px',
                    },
                  },
                },
              ],
              id: {
                '@@makeswift/type': 'prop-controllers::element-id::v1',
                value: 'cta',
              },
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        spans: [[12], [12]],
                        count: 12,
                      },
                    },
                  ],
                  elements: [
                    {
                      key: '93fbfefe-38c1-4ae4-988d-860cc6afa47e',
                      type: './components/Button/index.js',
                      props: {
                        shape: {
                          '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: 'pill',
                            },
                          ],
                        },
                        size: {
                          '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: 'large',
                            },
                          ],
                        },
                        color: {
                          '@@makeswift/type': 'prop-controllers::responsive-color::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                alpha: 1,
                                swatchId:
                                  'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                              },
                            },
                          ],
                        },
                        children: {
                          '@@makeswift/type': 'prop-controllers::text-input::v1',
                          value: 'Reserve your spot',
                        },
                        link: {
                          '@@makeswift/type': 'prop-controllers::link::v1',
                          value: {
                            type: 'SCROLL_TO_ELEMENT',
                            payload: {
                              elementIdConfig: {
                                elementKey: '68864cd7-e607-4b19-9de2-fafdc9590ffb',
                                propName: 'id',
                              },
                              block: 'start',
                            },
                          },
                        },
                      },
                    },
                    {
                      key: 'd533830a-3803-4ea9-85ce-922dad2a6f82',
                      type: './components/Text/index.js',
                      props: {
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              value: 700,
                              unit: 'px',
                            },
                          },
                        ],
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                marginTop: {
                                  value: 10,
                                  unit: 'px',
                                },
                                marginRight: 'auto',
                                marginBottom: {
                                  value: 20,
                                  unit: 'px',
                                },
                                marginLeft: 'auto',
                              },
                            },
                          ],
                        },
                        text: {
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                          descendants: [
                            {
                              type: 'default',
                              children: [
                                {
                                  text: 'Limited supply, restrictions apply.',
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            value: 16,
                                            unit: 'px',
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          fontWeight: 400,
                                          fontSize: {
                                            value: 16,
                                            unit: 'px',
                                          },
                                          lineHeight: 1.5,
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                            },
                          ],
                          key: '8c3efa17-5349-4f45-8c0b-1a399ebb7e1f',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  },
  type: './components/Root/index.js',
}

export const productOfTheYearFinal: Element = {
  key: '3d357687-70a6-4f18-9f48-91dd8cc9b15c',
  props: {
    backgrounds: {
      '@@makeswift/type': 'prop-controllers::backgrounds::v2',
      value: [
        {
          deviceId: 'desktop',
          value: [
            {
              id: '01feec6e-80c8-4fe0-b7a0-039d7a5e59d0',
              payload: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjhmMGQ5M2I4LWQ0Y2YtNGRiZi05MGEwLTQyNDNjODlmM2Y2Mg==',
              },
              type: 'color',
            },
          ],
        },
      ],
    },
    children: {
      '@@makeswift/type': 'prop-controllers::grid::v1',
      value: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              count: 12,
              spans: [[12], [12], [12]],
            },
          },
        ],
        elements: [
          {
            key: '11e386a8-d59a-47b5-8d13-80f8079949b7',
            type: 'reference',
            value: 'R2xvYmFsRWxlbWVudDowODU1MTZjMy0zMjVkLTRmMGItOGRhMy1kNzk1MmFkM2FhZWE=',
          },
          {
            key: '68864cd7-e607-4b19-9de2-fafdc9590ffb',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        count: 12,
                        spans: [[12], [12], [12]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: 'c4f63f22-24db-43b5-8755-75ed36f1128a',
                      props: {
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
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: {
                                  unit: 'px',
                                  value: 40,
                                },
                              },
                            },
                          ],
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'The wait is over..',
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                          fontSize: {
                                            unit: 'px',
                                            value: 18,
                                          },
                                          fontWeight: 700,
                                          italic: false,
                                          lineHeight: 1.5,
                                          uppercase: true,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '03a9ffa2-c08e-4ebd-bce6-a620aa558cfa',
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                        },
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              unit: 'px',
                              value: 700,
                            },
                          },
                        ],
                      },
                      type: './components/Text/index.js',
                    },
                    {
                      key: 'e3b101a3-e0b9-4c8e-bfa7-c00944669f2c',
                      props: {
                        backgrounds: {
                          '@@makeswift/type': 'prop-controllers::backgrounds::v2',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: [
                                {
                                  id: 'ec143bff-ff66-4f84-aa16-c7a7c0443aff',
                                  payload: {
                                    alpha: 0.05,
                                    swatchId:
                                      'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                  },
                                  type: 'color',
                                },
                              ],
                            },
                          ],
                        },
                        children: {
                          '@@makeswift/type': 'prop-controllers::grid::v1',
                          value: {
                            columns: [
                              {
                                deviceId: 'desktop',
                                value: {
                                  count: 12,
                                  spans: [[12]],
                                },
                              },
                            ],
                            elements: [
                              {
                                key: '2a29ad75-12cf-4354-870c-3c81af7e2d33',
                                props: {
                                  delay: 5,
                                  images: [
                                    {
                                      key: '59f9c0f1-7e8f-4210-871d-881e416e7e76',
                                      props: {},
                                    },
                                    {
                                      key: 'e7969c5e-f40c-4cc6-a67f-1414465160ee',
                                      props: {},
                                    },
                                    {
                                      key: 'a1c09893-e327-46e5-9a9f-3155f0cf7923',
                                      props: {},
                                    },
                                  ],
                                  margin: {
                                    '@@makeswift/type': 'prop-controllers::margin::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          marginTop: {
                                            unit: 'px',
                                            value: 15,
                                          },
                                        },
                                      },
                                    ],
                                  },
                                  showArrows: true,
                                  showDots: true,
                                },
                                type: './components/Carousel/index.js',
                              },
                            ],
                          },
                        },
                        id: {
                          '@@makeswift/type': 'prop-controllers::element-id::v1',
                          value: 'carousel',
                        },
                        padding: {
                          '@@makeswift/type': 'prop-controllers::padding::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                paddingBottom: {
                                  unit: 'px',
                                  value: 40,
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
                                  value: 35,
                                },
                              },
                            },
                          ],
                        },
                      },
                      type: './components/Box/index.js',
                    },
                    {
                      key: 'df7fe449-1c52-4022-92a5-3e4c1ea9223e',
                      props: {
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
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
                                  value: 40,
                                },
                              },
                            },
                          ],
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: "Finally, the internet's product of the year is here!",
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                          fontSize: {
                                            unit: 'px',
                                            value: 26,
                                          },
                                          fontWeight: 700,
                                          italic: false,
                                          lineHeight: 1.5,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: 'ce67c655-b12f-43a8-a7b4-4f1a9344c72d',
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                        },
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              unit: 'px',
                              value: 700,
                            },
                          },
                        ],
                      },
                      type: './components/Text/index.js',
                    },
                  ],
                },
              },
              id: {
                '@@makeswift/type': 'prop-controllers::element-id::v1',
                value: 'hero-section',
              },
              padding: [
                {
                  deviceId: 'desktop',
                  value: {
                    paddingBottom: {
                      unit: 'px',
                      value: 10,
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
            type: './components/Box/index.js',
          },
          {
            key: 'c9e7d4ba-9511-4d70-bda1-9e5804fe6f27',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        count: 12,
                        spans: [[12], [12]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: '93fbfefe-38c1-4ae4-988d-860cc6afa47e',
                      props: {
                        children: {
                          '@@makeswift/type': 'prop-controllers::text-input::v1',
                          value: 'Click to reserve your spot',
                        },
                        color: {
                          '@@makeswift/type': 'prop-controllers::responsive-color::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                alpha: 1,
                                swatchId:
                                  'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                              },
                            },
                          ],
                        },
                        link: {
                          '@@makeswift/type': 'prop-controllers::link::v1',
                          value: {
                            payload: {
                              block: 'start',
                              elementIdConfig: {
                                elementKey: '68864cd7-e607-4b19-9de2-fafdc9590ffb',
                                propName: 'id',
                              },
                            },
                            type: 'SCROLL_TO_ELEMENT',
                          },
                        },
                        shape: {
                          '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: 'pill',
                            },
                          ],
                        },
                        size: {
                          '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: 'large',
                            },
                          ],
                        },
                      },
                      type: './components/Button/index.js',
                    },
                    {
                      key: 'd533830a-3803-4ea9-85ce-922dad2a6f82',
                      props: {
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
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
                                  value: 10,
                                },
                              },
                            },
                          ],
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Limited supply, restrictions apply.',
                                  typography: {
                                    style: [
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          color: {
                                            alpha: 1,
                                            swatchId:
                                              'U3dhdGNoOjU5YjhiNDJiLTIxZDgtNGNhMC05NGM2LWRmOTg5MmIxYzUzMw==',
                                          },
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                          fontWeight: 400,
                                          lineHeight: 1.5,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              textAlign: [
                                {
                                  deviceId: 'desktop',
                                  value: 'center',
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '8c3efa17-5349-4f45-8c0b-1a399ebb7e1f',
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                        },
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              unit: 'px',
                              value: 700,
                            },
                          },
                        ],
                      },
                      type: './components/Text/index.js',
                    },
                  ],
                },
              },
              id: {
                '@@makeswift/type': 'prop-controllers::element-id::v1',
                value: 'cta',
              },
              padding: [
                {
                  deviceId: 'desktop',
                  value: {
                    paddingBottom: {
                      unit: 'px',
                      value: 10,
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
            type: './components/Box/index.js',
          },
        ],
      },
    },
  },
  type: './components/Root/index.js',
}