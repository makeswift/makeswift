import type { ElementData } from '@makeswift/controls'

export const translatableContentSampleElementTree: ElementData = {
  key: 'b21e20d7-083c-447f-b0da-92d8e8ec8794',
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
            key: 'efc8169c-3d63-43f4-8dac-a348116a775c',
            props: {
              backgrounds: {
                '@@makeswift/type': 'prop-controllers::backgrounds::v2',
                value: [
                  {
                    deviceId: 'desktop',
                    value: [
                      {
                        id: '0fbde3f3-b878-4594-ac92-bf8d845b0226',
                        payload: {
                          alpha: 1,
                          swatchId: 'U3dhdGNoOmVjMWZjYTU3LTUwZWYtNDBhOC05Mzg2LWUwYzg0NDgzODY3NA==',
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
                        spans: [[12], [12], [12], [12], [12]],
                      },
                    },
                  ],
                  elements: [
                    {
                      key: '315bf007-b78f-4565-b450-2ed36d47c984',
                      props: {
                        backgrounds: {
                          '@@makeswift/type': 'prop-controllers::backgrounds::v2',
                          value: [
                            {
                              deviceId: 'desktop',
                              value: [
                                {
                                  id: 'bb3d1239-c737-44c1-8a4a-47af38428d90',
                                  payload: { alpha: 1, swatchId: 'U3dhdGNoOmVjMWZjYTU3LTUwZWYtNDBhOC05Mzg2LWUwYzg0NDgzODY3NA==' },
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
                                value: { count: 12, spans: [[12], [12]] },
                              },
                            ],
                            elements: [
                              {
                                key: '00f15da7-28cb-4833-85d2-7af5222b20e5',
                                props: {
                                  file: {
                                    '@@makeswift/type': 'prop-controllers::image::v2',
                                    value: {
                                      id: 'RmlsZTphYTUzYTBjNy0yYjUwLTQwZjEtYjQ2Ny1kMGEzYjkyYmUwNGE=',
                                      type: 'makeswift-file',
                                      version: 1,
                                    },
                                  },
                                  margin: {
                                    '@@makeswift/type': 'prop-controllers::margin::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: { marginLeft: 'auto', marginRight: 'auto' },
                                      },
                                    ],
                                  },
                                  padding: {
                                    '@@makeswift/type': 'prop-controllers::padding::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          paddingBottom: { unit: 'px', value: 0 },
                                          paddingRight: { unit: 'px', value: 0 },
                                          paddingTop: { unit: 'px', value: 0 },
                                        },
                                      },
                                    ],
                                  },
                                  width: {
                                    '@@makeswift/type': 'prop-controllers::width::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: { unit: '%', value: 50 },
                                      },
                                    ],
                                  },
                                },
                                type: './components/Image/index.js',
                              },
                              {
                                key: 'd9cb4bc3-9a21-43cc-b300-9aa896c3672d',
                                props: {
                                  margin: [
                                    {
                                      deviceId: 'desktop',
                                      value: {
                                        marginBottom: { unit: 'px', value: 20 },
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
                                            text: 'D A K A R',
                                            typography: {
                                              id: 'VHlwb2dyYXBoeTplMmMxYzdjNS1iZjgwLTQ2ZTktYTUxNy00YjViMWNkZTE5NjE=',
                                              style: [
                                                {
                                                  deviceId: 'desktop',
                                                  value: {
                                                    fontSize: { unit: 'px', value: 43 },
                                                    letterSpacing: 5.2,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        textAlign: [{ deviceId: 'desktop', value: 'center' }],
                                        type: 'default',
                                      },
                                    ],
                                    key: '005dfc29-efbc-46ed-97e4-224c03ac1603',
                                    type: 'makeswift::controls::rich-text-v2',
                                    version: 2,
                                  },
                                  width: [
                                    {
                                      deviceId: 'desktop',
                                      value: { unit: 'px', value: 700 },
                                    },
                                  ],
                                },
                                type: './components/Text/index.js',
                              },
                              {
                                key: '10529c61-6d2c-4724-966a-c8ae579df487',
                                props: {
                                  margin: [
                                    {
                                      deviceId: 'desktop',
                                      value: {
                                        marginBottom: { unit: 'px', value: 20 },
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
                                            text: 'Introducing the New Land Rover Defender Dakar, a vehicle designed for adventure and exploration. This iconic SUV combines rugged durability with cutting-edge technology, offering unmatched off-road capability and powerful performance. Its innovative design and luxurious comfort make it stand out, while state-of-the-art technology keeps you connected and in control. Whether navigating city streets or uncharted paths, the Defender Dakar is your ultimate companion, embodying a lifestyle of confidence and style. Discover the world without limits with the Land Rover Defender Dakar.',
                                            typography: {
                                              id: 'VHlwb2dyYXBoeTplMmMxYzdjNS1iZjgwLTQ2ZTktYTUxNy00YjViMWNkZTE5NjE=',
                                              style: [],
                                            },
                                          },
                                        ],
                                        textAlign: [{ deviceId: 'desktop', value: 'justify' }],
                                        type: 'default',
                                      },
                                    ],
                                    key: '96d759e0-28d1-45ed-9d33-cbec53cb7af7',
                                    type: 'makeswift::controls::rich-text-v2',
                                    version: 2,
                                  },
                                  width: [
                                    {
                                      deviceId: 'desktop',
                                      value: { unit: 'px', value: 700 },
                                    },
                                  ],
                                },
                                type: './components/Text/index.js',
                              },
                              {
                                key: 'beef2474-13dd-4df5-8b63-89a79b3e59f6',
                                props: {
                                  children: {
                                    '@@makeswift/type': 'prop-controllers::text-input::v1',
                                    value: 'Read more',
                                  },
                                  margin: {
                                    '@@makeswift/type': 'prop-controllers::margin::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          marginBottom: { unit: 'px', value: 20 },
                                          marginLeft: 'auto',
                                          marginRight: 'auto',
                                          marginTop: { unit: 'px', value: 0 },
                                        },
                                      },
                                    ],
                                  },
                                  size: {
                                    '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                                    value: [{ deviceId: 'desktop', value: 'large' }],
                                  },
                                  variant: {
                                    '@@makeswift/type': 'prop-controllers::responsive-select::v1',
                                    value: [{ deviceId: 'desktop', value: 'primary' }],
                                  },
                                  width: {
                                    '@@makeswift/type': 'prop-controllers::width::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: { unit: 'px', value: 700 },
                                      },
                                    ],
                                  },
                                },
                                type: './components/Button/index.js',
                              },
                              {
                                key: 'a254c640-ff21-406b-bffc-b9e95157a538',
                                props: {
                                  children: {
                                    '@@makeswift/type': 'prop-controllers::text-input::v1',
                                    value: 'Buy now',
                                  },
                                  margin: {
                                    '@@makeswift/type': 'prop-controllers::margin::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: {
                                          marginBottom: { unit: 'px', value: 20 },
                                          marginLeft: 'auto',
                                          marginRight: 'auto',
                                          marginTop: { unit: 'px', value: 0 },
                                        },
                                      },
                                    ],
                                  },
                                  size: {
                                    '@@makeswift/type': 'prop-controllers::responsive-icon-radio-group::v1',
                                    value: [{ deviceId: 'desktop', value: 'large' }],
                                  },
                                  variant: {
                                    '@@makeswift/type': 'prop-controllers::responsive-select::v1',
                                    value: [{ deviceId: 'desktop', value: 'primary' }],
                                  },
                                  width: {
                                    '@@makeswift/type': 'prop-controllers::width::v1',
                                    value: [
                                      {
                                        deviceId: 'desktop',
                                        value: { unit: 'px', value: 700 },
                                      },
                                    ],
                                  },
                                },
                                type: './components/Button/index.js',
                              },
                              {
                                key: '67695acd-2b18-4226-a76a-27d682200036',
                                props: {},
                                type: './components/Login/index.js',
                              },
                            ],
                          },
                        },
                        padding: [
                          {
                            deviceId: 'desktop',
                            value: {
                              paddingBottom: { unit: 'px', value: 10 },
                              paddingLeft: { unit: 'px', value: 10 },
                              paddingRight: { unit: 'px', value: 10 },
                              paddingTop: { unit: 'px', value: 10 },
                            },
                          },
                        ],
                      },
                      type: './components/Box/index.js',
                    },
                  ],
                },
              },
              padding: [
                {
                  deviceId: 'desktop',
                  value: {
                    paddingBottom: { unit: 'px', value: 10 },
                    paddingLeft: { unit: 'px', value: 10 },
                    paddingRight: { unit: 'px', value: 10 },
                    paddingTop: { unit: 'px', value: 10 },
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
