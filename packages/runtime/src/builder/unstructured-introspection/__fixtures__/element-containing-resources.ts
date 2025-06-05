import { Element } from '@makeswift/controls'

/*
  Below is a fairly minimal example of an Element containing one of each:
    - Swatch
    - File
    - Typography
    - Global Element
    - Page Link (called 'Page' in APIResourceType)
    - Table
*/
export const elementContainingResources: Element = {
  key: '2c5e9ffc-dbcf-486a-ac62-8ac9efa539f0',
  props: {
    children: {
      '@@makeswift/type': 'prop-controllers::grid::v1',
      value: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              spans: [[12], [12], [12], [12], [12], [12]],
              count: 12,
            },
          },
        ],
        elements: [
          {
            key: 'cb66f6cb-0656-4424-81d7-0d03b27c45de',
            props: {
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
                      key: '0f56d678-341a-4b05-bc9c-3a9f5bd7251e',
                      props: {
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
                              marginTop: null,
                            },
                          },
                        ],
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: swatch only',
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
                                              'U3dhdGNoOmQ1ZWU3MmY1LThmMTQtNDQzZC05YmQ1LTJiMDA1MTIyYTA5NQ==',
                                          },
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
                              ],
                              type: 'default',
                            },
                          ],
                          key: 'c632090b-2269-40c9-8924-0ecc5effa651',
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
            key: 'cf3e1cd1-e1bb-4420-8644-34d780b5465b',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        count: 12,
                        spans: [[6, 6]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: 'c42ddde2-b9ff-4787-909f-d23866ca9130',
                      props: {
                        file: {
                          '@@makeswift/type': 'prop-controllers::image::v2',
                          value: {
                            id: 'RmlsZTpjNzc2MjI3ZC1iNmZjLTQ3MGYtYTY1OC00NWQ4NzA2NDVkMDM=',
                            type: 'makeswift-file',
                            version: 1,
                          },
                        },
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                marginLeft: {
                                  unit: 'px',
                                  value: 270,
                                },
                                marginRight: 'auto',
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
                                unit: '%',
                                value: 15,
                              },
                            },
                          ],
                        },
                      },
                      type: './components/Image/index.js',
                    },
                    {
                      key: 'ce4edb81-8832-4266-a152-4e506e1e754d',
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
                                marginTop: null,
                              },
                            },
                          ],
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: File only',
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
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '061f43b1-72aa-46b6-b429-c4a55eac09c5',
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
            key: 'ceebe1f0-31c1-4314-b387-df463d076751',
            props: {
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
                      key: '87ab03ef-3a10-49d9-b596-719834f894dd',
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
                                marginTop: null,
                              },
                            },
                          ],
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: typography only',
                                  typography: {
                                    id: 'VHlwb2dyYXBoeTo1ODVkMGE1ZS0zYmUyLTQyNzEtOTczYS1mNWNjN2UzMzk4ODg=',
                                    style: [],
                                  },
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '9c7f5fa6-7f15-4e60-91fd-778827ab3449',
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
            key: '6f2a2437-f690-4644-84d6-14073f1404d4',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        count: 12,
                        spans: [[6, 6]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: '42a6048c-ea36-41a4-9783-9c28f58fa3e6',
                      props: {
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
                              marginTop: null,
                            },
                          },
                        ],
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: Global Element only',
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
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '09c570fa-7d82-4886-8c33-ad418202d562',
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
                      key: '229fc932-2fdf-46eb-8ff6-ad31d3660d0a',
                      type: 'reference',
                      value: 'R2xvYmFsRWxlbWVudDphOTRjYjM3ZS02OWM2LTQ1OGQtODIxNS1mZTA2NGQ3OWZmNjI=',
                    },
                  ],
                },
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
            key: '3c83ae93-7cc9-47b1-8599-4efbd5bbd331',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        count: 12,
                        spans: [[6, 6]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: 'f1ee5bf3-ebec-4398-b4e1-73b13c8050dd',
                      props: {
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
                              marginTop: null,
                            },
                          },
                        ],
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: Page Link only',
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
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: 'f3b4e0db-8141-4500-8b0d-19978cfcd664',
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
                      key: '0ca675bf-a128-4a22-9cda-b4f07ad7b52e',
                      props: {
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
                              marginTop: null,
                            },
                          },
                        ],
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: '',
                                },
                                {
                                  children: [
                                    {
                                      text: 'Sample Link to Page A',
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
                                          {
                                            deviceId: 'mobile',
                                            value: {
                                              fontSize: {
                                                unit: 'px',
                                                value: 16,
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                  link: {
                                    payload: {
                                      openInNewTab: false,
                                      pageId:
                                        'UGFnZToxZWU1YmNjNi1mMGI1LTQxMGUtOWIzMy0wZTJjZTNkYTIwMzE=',
                                    },
                                    type: 'OPEN_PAGE',
                                  },
                                  type: 'link',
                                },
                                {
                                  text: '',
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '878ec264-dbb5-4b14-8dc3-651133ba9a8e',
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
            key: 'fac5fb69-c058-49a8-8b07-0917b2beddc8',
            props: {
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
              children: {
                '@@makeswift/type': 'prop-controllers::grid::v1',
                value: {
                  columns: [
                    {
                      deviceId: 'desktop',
                      value: {
                        spans: [[6, 6]],
                        count: 12,
                      },
                    },
                  ],
                  elements: [
                    {
                      key: '9274acff-aa56-4f04-b4f2-04e8106dc3a0',
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
                                marginLeft: {
                                  unit: 'px',
                                  value: 0,
                                },
                                marginRight: 'auto',
                                marginTop: null,
                              },
                            },
                          ],
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
                        text: {
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Resource: table',
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
                                      {
                                        deviceId: 'mobile',
                                        value: {
                                          fontSize: {
                                            unit: 'px',
                                            value: 16,
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              type: 'default',
                            },
                          ],
                          key: '78307876-10bc-4240-a01d-071cd395a586',
                        },
                      },
                      type: './components/Text/index.js',
                    },
                    {
                      key: 'f5fbb12a-948b-414d-8267-b571713cbf60',
                      type: './components/Form/index.js',
                      props: {
                        gap: [
                          {
                            deviceId: 'desktop',
                            value: {
                              value: 10,
                              unit: 'px',
                            },
                          },
                        ],
                        width: [
                          {
                            deviceId: 'desktop',
                            value: {
                              value: 550,
                              unit: 'px',
                            },
                          },
                        ],
                        tableId: {
                          '@@makeswift/type': 'prop-controllers::table::v1',
                          value: 'VGFibGU6MDI2OTUwMDQtOThkMi00NDU1LThjNDAtYmFiMDU5YTY3NDQy',
                        },
                        fields: {
                          '@@makeswift/type': 'prop-controllers::table-form-fields::v1',
                          value: {
                            fields: [],
                            grid: [
                              {
                                deviceId: 'desktop',
                                value: {
                                  count: 12,
                                  spans: [[12]],
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
            type: './components/Box/index.js',
          },
        ],
      },
    },
  },
  type: './components/Root/index.js',
}
