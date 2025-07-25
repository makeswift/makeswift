import { type ElementData } from '@makeswift/controls'

export const elementTree: ElementData = {
  key: '9cbc3e8d-8b15-435f-8836-498e9afc5e32',
  props: {
    children: {
      '@@makeswift/type': 'prop-controllers::grid::v1',
      value: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              count: 12,
              spans: [[12], [12], [12], [12], [12], [12]],
            },
          },
        ],
        elements: [
          {
            key: 'e6c9e7a2-f1c2-41b0-b369-70094524d942',
            props: {
              alignment: {
                '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: 'center',
                  },
                ],
              },
              gutter: [
                {
                  deviceId: 'desktop',
                  value: {
                    unit: 'px',
                    value: 10,
                  },
                },
              ],
              linkTextStyle: {
                '@@makeswift/type': 'prop-controllers::text-style::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      fontFamily: 'var(--font-grenze-gotisch)',
                      fontSize: {
                        unit: 'px',
                        value: 20,
                      },
                      fontStyle: [],
                      fontWeight: 500,
                      letterSpacing: null,
                      textTransform: [],
                    },
                  },
                ],
              },
              links: {
                '@@makeswift/type': 'prop-controllers::navigation-links::v1',
                value: [
                  {
                    id: '9a657d71-f698-48df-9ab8-1ed7fdeced64',
                    payload: {
                      label: 'Home',
                      link: {
                        payload: {
                          block: 'start',
                          elementIdConfig: {
                            elementKey: '6b191363-f9c8-4988-9739-f74ca9cf7cee',
                            propName: 'id',
                          },
                        },
                        type: 'SCROLL_TO_ELEMENT',
                      },
                      textColor: [
                        {
                          deviceId: 'desktop',
                          value: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOjkzYTcxNjk1LWI5ZGEtNDExNC04NGM1LWMzYjBmM2RlY2U3NA==',
                          },
                        },
                      ],
                      variant: [
                        {
                          deviceId: 'desktop',
                          value: 'clear',
                        },
                      ],
                    },
                    type: 'button',
                  },
                  {
                    id: 'b846ce73-62c1-423b-8d08-1eef5a23bee2',
                    payload: {
                      label: 'Why Us',
                      link: {
                        payload: {
                          block: 'start',
                          elementIdConfig: {
                            elementKey: '4e25b048-88c4-4e2a-b74f-2161f2567ac3',
                            propName: 'id',
                          },
                        },
                        type: 'SCROLL_TO_ELEMENT',
                      },
                      textColor: [
                        {
                          deviceId: 'desktop',
                          value: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOjkzYTcxNjk1LWI5ZGEtNDExNC04NGM1LWMzYjBmM2RlY2U3NA==',
                          },
                        },
                      ],
                      variant: [
                        {
                          deviceId: 'desktop',
                          value: 'clear',
                        },
                      ],
                    },
                    type: 'button',
                  },
                ],
              },
              logoWidth: {
                '@@makeswift/type': 'prop-controllers::responsive-length::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      unit: 'px',
                      value: 100,
                    },
                  },
                ],
              },
              showLogo: {
                '@@makeswift/type': 'prop-controllers::checkbox::v1',
                value: false,
              },
            },
            type: './components/Navigation/index.js',
          },
          {
            key: 'aa3bb52a-350b-4bc3-9e80-aa6046f23472',
            props: {
              altText: {
                '@@makeswift/type': 'prop-controllers::text-input::v1',
                value: 'Night sky',
              },
              file: {
                '@@makeswift/type': 'prop-controllers::image::v2',
                value: {
                  id: 'RmlsZToxMDZjODJlNC03ZmEzLTQwOGQtYmVhNy04Zjk1N2IzMDlkZTY=',
                  type: 'makeswift-file',
                  version: 1,
                },
              },
              padding: {
                '@@makeswift/type': 'prop-controllers::padding::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      paddingBottom: {
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
              },
            },
            type: './components/Image/index.js',
          },
          {
            key: '6b191363-f9c8-4988-9739-f74ca9cf7cee',
            props: {
              id: {
                '@@makeswift/type': 'prop-controllers::element-id::v1',
                value: 'hero',
              },
              margin: {
                '@@makeswift/type': 'prop-controllers::margin::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      marginBottom: {
                        unit: 'px',
                        value: 0,
                      },
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: {
                        unit: 'px',
                        value: 45,
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
                        text: 'HUGE Summer Sale',
                        typography: {
                          id: 'VHlwb2dyYXBoeToyYTk5ZTk2NS02OWIzLTQ0YjgtOTdkMS05MmM0ODM4YmUwZTc=',
                          style: [],
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
                key: '5418dd28-b5ac-4377-a616-ff0570396e89',
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
            key: '2334a499-29d8-4fcc-a17f-d9fdd252826c',
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
                      key: '4e25b048-88c4-4e2a-b74f-2161f2567ac3',
                      props: {
                        id: {
                          '@@makeswift/type': 'prop-controllers::element-id::v1',
                          value: 'why-us',
                        },
                        margin: {
                          '@@makeswift/type': 'prop-controllers::margin::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                marginBottom: {
                                  unit: 'px',
                                  value: 0,
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
                        },
                        text: {
                          descendants: [
                            {
                              children: [
                                {
                                  text: 'Why Shop With Us?',
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
                                              'U3dhdGNoOjkzYTcxNjk1LWI5ZGEtNDExNC04NGM1LWMzYjBmM2RlY2U3NA==',
                                          },
                                          fontSize: {
                                            unit: 'px',
                                            value: 32,
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
                          key: '04cbe1c0-5821-4d27-bc4a-e2f0f377e8b6',
                          type: 'makeswift::controls::rich-text-v2',
                          version: 2,
                        },
                        width: {
                          '@@makeswift/type': 'prop-controllers::width::v1',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: {
                                unit: '%',
                                value: 100,
                              },
                            },
                          ],
                        },
                      },
                      type: './components/Text/index.js',
                    },
                    {
                      key: '7581e32e-b699-4d95-80c5-af532cbeef1d',
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
                                  value: 30,
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
                                  text: 'At our store, fashion meets innovation to create a shopping experience like no other. From our Virtual Try-On Studio that lets you preview outfits with precision, to StyleMatch that curates personalized looks just for you, we make finding your perfect fit effortless and fun. Our Fit Guarantee+ ensures every piece feels like it was made for you, while the Closet Companion App helps you build and style a wardrobe you’ll love. Plus, with our EcoEdit Filter, you can shop sustainably without compromising style. And with DropAlert Early Access, you’ll always stay one step ahead of the trends. It’s not just shopping—it’s styling made smart.',
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
                          key: '2e003301-6c89-4cf1-9742-1a412e3c91f0',
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
                        value: 25,
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
                        value: 0,
                      },
                      paddingLeft: {
                        unit: 'px',
                        value: 75,
                      },
                      paddingRight: {
                        unit: 'px',
                        value: 60,
                      },
                      paddingTop: {
                        unit: 'px',
                        value: 0,
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
                      value: 605,
                    },
                  },
                ],
              },
            },
            type: './components/Box/index.js',
          },
          {
            key: 'c0546c23-eefb-41a9-9b6c-b9847ce77687',
            props: {
              children: {
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
                    key: 'b52d97e8-97d2-4dfa-9f53-a38e0359b02c',
                    props: {
                      children: {
                        columns: [
                          {
                            deviceId: 'desktop',
                            value: {
                              count: 12,
                              spans: [
                                [4, 4, 4],
                                [4, 4, 4],
                              ],
                            },
                          },
                          {
                            deviceId: 'mobile',
                            value: {
                              count: 12,
                              spans: [[12], [12], [12], [12], [12], [12]],
                            },
                          },
                          {
                            deviceId: 'tablet',
                            value: {
                              count: 12,
                              spans: [
                                [6, 6],
                                [6, 6],
                                [6, 6],
                              ],
                            },
                          },
                        ],
                        elements: [
                          {
                            key: '9ea11e08-6f11-4c2e-8782-884bb77f10b1',
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
                                      key: 'a80a02b2-0b2a-4719-8aff-7674f894e182',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Virtual Try-On Studio',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: '27b632e8-54eb-41f1-8cea-a86c535e9fa2',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: 'e4c44cbd-8e06-4281-9a5a-a9c67998df1a',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'See it. Style it. Love it. Our Virtual Try-On Studio lets you preview outfits on a 3D model that matches your body type—so you can shop with confidence and skip the dressing room drama.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: 'd6e89952-e90c-4b96-af46-d02db34ca85c',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                          {
                            key: 'cec262a1-0e47-4e1b-9d25-819fcfb781cd',
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
                                      key: '2d5509fc-ef28-44c2-a52d-11278d893e45',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'StyleMatch',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: 'eedfff99-8f77-407d-89e9-c6607a786ab6',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: 'c712307f-4605-4204-9c30-f325c5861170',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Discover your perfect look in seconds. StyleMatch recommends pieces based on your taste, past purchases, and even your mood. It’s like having a personal stylist in your pocket.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: '1c805a5f-dd7e-4d6b-99c2-a11fef7d7ca7',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                          {
                            key: '4da9b876-76dc-49af-aa55-ed35b21dc5ba',
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
                                      key: 'ef06e719-b526-4fd7-95f7-324a0393df43',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Fit Guarantee+',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: '32c86a6e-b39c-44fc-9482-6435f208df6a',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: 'cec3c603-3401-4b1b-8e2f-00d984f4ba71',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Never worry about the wrong size again. Fit Guarantee+ uses data-driven sizing plus free exchanges to make sure every piece fits you perfectly—or we’ll make it right, no questions asked.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: '1b5be247-20e2-4b29-abd9-50f3b867f154',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                          {
                            key: '014044ac-94a4-48bc-b640-885d93a683d8',
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
                                      key: '9a55c845-b91b-4e65-a9bf-7647dff14836',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Closet Companion App',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: '15e34c16-8cab-4a3a-8757-8b70680c1568',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: '89ad1aad-73f7-4e99-962f-ebf7e05a6810',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Build your dream wardrobe digitally. Our Closet Companion App keeps track of what you own, helps you style new outfits, and suggests what to buy next to complete your look.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: 'd7831087-ce29-4018-bc50-8046d4a99389',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                          {
                            key: 'c02dffae-defc-48da-9881-e09f5c54b8c8',
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
                                      key: 'dc706501-3b06-403c-929d-34048393d8f9',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'EcoEdit Filter',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: 'a435cc2b-62f5-41b0-afbe-06cb0880715f',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: 'bd59d14c-7d98-463f-8d8d-46ef53a765b5',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Fashion meets sustainability. Shop guilt-free by filtering our collection for ethically made, recycled, or low-impact pieces—because looking good should also feel good.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: 'df380be9-f86c-4334-b0cf-f2f2136b1f93',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                          {
                            key: '76def0f6-e22c-46d3-be60-e5f41775f5b9',
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
                                      key: '5350c1a7-0cfb-48ba-94b3-43014b3a01f9',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 10,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'DropAlert Early Access',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'tablet',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          color: {
                                                            alpha: 1,
                                                            swatchId:
                                                              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                                                          },
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 28,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'heading-two',
                                            },
                                          ],
                                          key: '5b4ab90f-828b-4fb6-b657-2b450eb87d63',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                    {
                                      key: '988e445b-cc28-46e0-b43d-eab4ed868f1a',
                                      props: {
                                        margin: [
                                          {
                                            deviceId: 'desktop',
                                            value: {
                                              marginBottom: {
                                                unit: 'px',
                                                value: 0,
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
                                        text: {
                                          descendants: [
                                            {
                                              children: [
                                                {
                                                  text: 'Be first in line for the hottest releases. With DropAlert™, you get exclusive early access to limited collections, back-in-stock alerts, and VIP-only styles—before anyone else.',
                                                  typography: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        deviceId: 'desktop',
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 18,
                                                          },
                                                          fontWeight: 400,
                                                          italic: false,
                                                          lineHeight: 1.5,
                                                        },
                                                      },
                                                      {
                                                        deviceId: 'tablet',
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
                                              textAlign: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: 'left',
                                                },
                                              ],
                                              type: 'paragraph',
                                            },
                                          ],
                                          key: 'd542f672-1b9f-4b9b-aa0b-390777d02a1f',
                                          type: 'makeswift::controls::rich-text-v2',
                                          version: 2,
                                        },
                                      },
                                      type: './components/Text/index.js',
                                    },
                                  ],
                                },
                              },
                            },
                            type: './components/Box/index.js',
                          },
                        ],
                      },
                      columnGap: [
                        {
                          deviceId: 'mobile',
                          value: {
                            unit: 'px',
                            value: 0,
                          },
                        },
                        {
                          deviceId: 'desktop',
                          value: {
                            unit: 'px',
                            value: 80,
                          },
                        },
                        {
                          deviceId: 'tablet',
                          value: {
                            unit: 'px',
                            value: 60,
                          },
                        },
                      ],
                      rowGap: [
                        {
                          deviceId: 'desktop',
                          value: {
                            unit: 'px',
                            value: 80,
                          },
                        },
                        {
                          deviceId: 'tablet',
                          value: {
                            unit: 'px',
                            value: 60,
                          },
                        },
                        {
                          deviceId: 'mobile',
                          value: {
                            unit: 'px',
                            value: 50,
                          },
                        },
                      ],
                      width: [
                        {
                          deviceId: 'desktop',
                          value: {
                            unit: 'px',
                            value: 1100,
                          },
                        },
                      ],
                    },
                    type: './components/Box/index.js',
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
                        value: 120,
                      },
                      paddingLeft: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingRight: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingTop: {
                        unit: 'px',
                        value: 45,
                      },
                    },
                  },
                  {
                    deviceId: 'tablet',
                    value: {
                      paddingBottom: {
                        unit: 'px',
                        value: 100,
                      },
                      paddingLeft: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingRight: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingTop: {
                        unit: 'px',
                        value: 100,
                      },
                    },
                  },
                  {
                    deviceId: 'mobile',
                    value: {
                      paddingBottom: {
                        unit: 'px',
                        value: 80,
                      },
                      paddingLeft: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingRight: {
                        unit: 'px',
                        value: 25,
                      },
                      paddingTop: {
                        unit: 'px',
                        value: 80,
                      },
                    },
                  },
                ],
              },
            },
            type: './components/Box/index.js',
          },
          {
            key: '270019c4-4a80-483a-b701-757d4f7956a2',
            props: {
              children: {
                '@@makeswift/type': 'prop-controllers::text-input::v1',
                value: 'Shop now',
              },
              color: {
                '@@makeswift/type': 'prop-controllers::responsive-color::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      alpha: 1,
                      swatchId: 'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==',
                    },
                  },
                ],
              },
              link: {
                '@@makeswift/type': 'prop-controllers::link::v1',
                value: {
                  payload: {
                    openInNewTab: true,
                    pageId: 'UGFnZTpmNTljNGNjNy1mZDhkLTRkZjUtYjM1Yi00NzFhOWViNWMyNjg=',
                  },
                  type: 'OPEN_PAGE',
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
                        value: 45,
                      },
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: {
                        unit: 'px',
                        value: 45,
                      },
                    },
                  },
                ],
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
              width: {
                '@@makeswift/type': 'prop-controllers::width::v1',
                value: [
                  {
                    deviceId: 'desktop',
                    value: {
                      unit: 'px',
                      value: 235,
                    },
                  },
                ],
              },
            },
            type: './components/Button/index.js',
          },
        ],
      },
    },
  },
  type: './components/Root/index.js',
}
