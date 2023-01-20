import { Page } from '../../../dist/next.es'

export async function getStaticPaths() {
  return {
    paths: [{ params: { path: [] } }],
    fallback: 'blocking',
  }
}

export async function getStaticProps(ctx) {
  return { props: { snapshot } }
}

export default Page

const snapshot = {
  document: {
    id: 'UGFnZToyNTE5MzI4Yi1lZDVlLTQyMTAtYWMyYy03MWZiZjE4NTFkZjU=',
    data: {
      key: '50d1d6d1-4503-4342-8342-03e59ec2087d',
      type: './components/Root/index.js',
      props: {
        children: {
          columns: [
            {
              value: { count: 12, spans: [[12], [12]] },
              deviceId: 'desktop',
            },
          ],
          elements: [
            {
              key: '62786fb3-6c07-4861-8f51-193ae7605b22',
              type: './components/Box/index.js',
              props: {
                padding: [
                  {
                    value: {
                      paddingTop: { unit: 'px', value: 15 },
                      paddingLeft: { unit: 'px', value: 25 },
                      paddingRight: { unit: 'px', value: 25 },
                      paddingBottom: { unit: 'px', value: 15 },
                    },
                    deviceId: 'desktop',
                  },
                ],
                children: {
                  columns: [
                    {
                      value: { count: 12, spans: [[12]] },
                      deviceId: 'desktop',
                    },
                  ],
                  elements: [
                    {
                      key: 'b6fbcc6f-190c-4e61-90d0-2acaedbb0c68',
                      type: './components/Navigation/index.js',
                      props: {
                        links: [
                          {
                            id: 'c022b6cc-f095-4d17-a8ef-ae3bf7062326',
                            type: 'button',
                            payload: {
                              label: 'Team',
                              variant: [{ value: 'clear', deviceId: 'desktop' }],
                              textStyle: [
                                {
                                  value: {
                                    fontSize: { unit: 'px', value: 16 },
                                    fontStyle: [],
                                    fontWeight: null,
                                    letterSpacing: null,
                                    textTransform: [],
                                  },
                                  deviceId: 'desktop',
                                },
                              ],
                            },
                          },
                          {
                            id: '9ff6b8e9-f4e7-49d5-bf1b-60a3ff950a51',
                            type: 'button',
                            payload: {
                              label: 'Features',
                              variant: [{ value: 'clear', deviceId: 'desktop' }],
                              textStyle: [
                                {
                                  value: {
                                    fontSize: { unit: 'px', value: 16 },
                                    fontStyle: [],
                                    fontWeight: null,
                                    letterSpacing: null,
                                    textTransform: [],
                                  },
                                  deviceId: 'desktop',
                                },
                              ],
                            },
                          },
                          {
                            id: '754b3e5d-d77e-4f2f-92f8-2aa27cf3b319',
                            type: 'button',
                            payload: {
                              label: 'Blog',
                              variant: [{ value: 'clear', deviceId: 'desktop' }],
                              textStyle: [
                                {
                                  value: {
                                    fontSize: { unit: 'px', value: 16 },
                                    fontStyle: [],
                                    fontWeight: null,
                                    letterSpacing: null,
                                    textTransform: [],
                                  },
                                  deviceId: 'desktop',
                                },
                              ],
                            },
                          },
                          {
                            id: '026d388d-b5bc-4e19-a524-667d60834721',
                            type: 'button',
                            payload: {
                              label: 'Contact',
                              variant: [{ value: 'flat', deviceId: 'desktop' }],
                              textStyle: [
                                {
                                  value: {
                                    fontSize: { unit: 'px', value: 16 },
                                    fontStyle: [],
                                    fontWeight: null,
                                    letterSpacing: null,
                                    textTransform: [],
                                  },
                                  deviceId: 'desktop',
                                },
                              ],
                            },
                          },
                        ],
                        width: [
                          {
                            value: { unit: 'px', value: 1100 },
                            deviceId: 'desktop',
                          },
                        ],
                        gutter: [
                          {
                            value: { unit: 'px', value: 10 },
                            deviceId: 'desktop',
                          },
                        ],
                        showLogo: true,
                        logoWidth: [
                          {
                            value: { unit: 'px', value: 100 },
                            deviceId: 'desktop',
                          },
                        ],
                        mobileMenuAnimation: [{ value: 'coverRight', deviceId: 'mobile' }],
                      },
                    },
                  ],
                },
                columnGap: [
                  {
                    value: { unit: 'px', value: 0 },
                    deviceId: 'mobile',
                  },
                ],
                backgrounds: [
                  {
                    value: [
                      {
                        id: '0bb47cce-0bec-43a2-a6ad-298208cf7e59',
                        type: 'color',
                        payload: { alpha: 1, swatchId: null },
                      },
                    ],
                    deviceId: 'desktop',
                  },
                ],
              },
            },
            {
              key: '9c62fab7-5009-4abb-a6ae-72ce3e7c9fbf',
              type: './components/Box/index.js',
              props: {
                padding: [
                  {
                    value: {
                      paddingTop: { unit: 'px', value: 200 },
                      paddingLeft: { unit: 'px', value: 25 },
                      paddingRight: { unit: 'px', value: 25 },
                      paddingBottom: { unit: 'px', value: 200 },
                    },
                    deviceId: 'desktop',
                  },
                  {
                    value: {
                      paddingTop: { unit: 'px', value: 120 },
                      paddingLeft: { unit: 'px', value: 25 },
                      paddingRight: { unit: 'px', value: 25 },
                      paddingBottom: { unit: 'px', value: 120 },
                    },
                    deviceId: 'mobile',
                  },
                ],
                children: {
                  columns: [
                    {
                      value: { count: 12, spans: [[12]] },
                      deviceId: 'desktop',
                    },
                  ],
                  elements: [
                    {
                      key: '7657a5af-51fb-4951-b03d-0191f1e682c9',
                      type: './components/Box/index.js',
                      props: {
                        width: [
                          {
                            value: { unit: 'px', value: 1100 },
                            deviceId: 'desktop',
                          },
                        ],
                        children: {
                          columns: [
                            {
                              value: {
                                count: 12,
                                spans: [[12], [12], [12]],
                              },
                              deviceId: 'desktop',
                            },
                          ],
                          elements: [
                            {
                              key: '414dc6b6-5e8d-4de2-a776-8294c16b906e',
                              type: './components/Text/index.js',
                              props: {
                                text: {
                                  object: 'value',
                                  document: {
                                    data: {},
                                    nodes: [
                                      {
                                        data: {
                                          textAlign: [
                                            {
                                              value: 'center',
                                              deviceId: 'desktop',
                                            },
                                          ],
                                        },
                                        type: 'heading-one',
                                        nodes: [
                                          {
                                            text: 'This is a headline',
                                            marks: [
                                              {
                                                data: {
                                                  value: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 56,
                                                          },
                                                          fontWeight: 400,
                                                          lineHeight: 1.2,
                                                        },
                                                        deviceId: 'desktop',
                                                      },
                                                      {
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 48,
                                                          },
                                                        },
                                                        deviceId: 'tablet',
                                                      },
                                                      {
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 40,
                                                          },
                                                        },
                                                        deviceId: 'mobile',
                                                      },
                                                    ],
                                                  },
                                                },
                                                type: 'typography',
                                                object: 'mark',
                                              },
                                            ],
                                            object: 'text',
                                          },
                                        ],
                                        object: 'block',
                                      },
                                    ],
                                    object: 'document',
                                  },
                                },
                                margin: [
                                  {
                                    value: {
                                      marginTop: { unit: 'px', value: 0 },
                                      marginLeft: 'auto',
                                      marginRight: 'auto',
                                      marginBottom: { unit: 'px', value: 15 },
                                    },
                                    deviceId: 'desktop',
                                  },
                                  {
                                    value: {
                                      marginTop: { unit: 'px', value: 0 },
                                      marginLeft: 'auto',
                                      marginRight: 'auto',
                                      marginBottom: { unit: 'px', value: 15 },
                                    },
                                    deviceId: 'mobile',
                                  },
                                ],
                              },
                            },
                            {
                              key: '596aa103-ac56-4499-8aae-4ce564fdbff4',
                              type: './components/Text/index.js',
                              props: {
                                text: {
                                  object: 'value',
                                  document: {
                                    data: {},
                                    nodes: [
                                      {
                                        data: {
                                          textAlign: [
                                            {
                                              value: 'center',
                                              deviceId: 'desktop',
                                            },
                                          ],
                                        },
                                        type: 'paragraph',
                                        nodes: [
                                          {
                                            text: 'This is a subheader about this company and what they do.',
                                            marks: [
                                              {
                                                data: {
                                                  value: {
                                                    id: null,
                                                    style: [
                                                      {
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 24,
                                                          },
                                                          lineHeight: 1.5,
                                                        },
                                                        deviceId: 'desktop',
                                                      },
                                                      {
                                                        value: {
                                                          fontSize: {
                                                            unit: 'px',
                                                            value: 20,
                                                          },
                                                        },
                                                        deviceId: 'mobile',
                                                      },
                                                    ],
                                                  },
                                                },
                                                type: 'typography',
                                                object: 'mark',
                                              },
                                            ],
                                            object: 'text',
                                          },
                                        ],
                                        object: 'block',
                                      },
                                    ],
                                    object: 'document',
                                  },
                                },
                                margin: [
                                  {
                                    value: {
                                      marginTop: { unit: 'px', value: 0 },
                                      marginLeft: 'auto',
                                      marginRight: 'auto',
                                      marginBottom: { unit: 'px', value: 50 },
                                    },
                                    deviceId: 'desktop',
                                  },
                                  {
                                    value: {
                                      marginTop: { unit: 'px', value: 0 },
                                      marginLeft: 'auto',
                                      marginRight: 'auto',
                                      marginBottom: { unit: 'px', value: 40 },
                                    },
                                    deviceId: 'mobile',
                                  },
                                ],
                              },
                            },
                            {
                              key: 'effaef12-d16a-4c0c-91fb-5dfadc8126a4',
                              type: './components/Button/index.js',
                              props: {
                                size: [
                                  {
                                    value: 'large',
                                    deviceId: 'desktop',
                                  },
                                ],
                                shape: [
                                  {
                                    value: 'rounded',
                                    deviceId: 'desktop',
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        columnGap: [
                          {
                            value: { unit: 'px', value: 0 },
                            deviceId: 'mobile',
                          },
                        ],
                      },
                    },
                  ],
                },
                columnGap: [
                  {
                    value: { unit: 'px', value: 0 },
                    deviceId: 'mobile',
                  },
                ],
                backgrounds: [
                  {
                    value: [
                      {
                        id: '1c942da5-813d-409f-a91f-5d1561f406b4',
                        type: 'color',
                        payload: { alpha: 0.08, swatchId: null },
                      },
                    ],
                    deviceId: 'desktop',
                  },
                ],
              },
            },
          ],
        },
      },
    },
    snippets: [],
    fonts: [
      { family: 'Covered By Your Grace', variants: ['regular'] },
      { family: 'JetBrains Mono', variants: ['regular', '500'] },
      {
        family: 'Spline Sans',
        variants: ['300', 'regular', '600', '700'],
      },
    ],
    meta: {
      title: null,
      description: null,
      keywords: null,
      socialImage: null,
      favicon: null,
    },
    seo: { canonicalUrl: null, isIndexingBlocked: null },
    site: { id: 'U2l0ZTphODQxNWY4OS03MWU2LTQ2NzItOTJjYi1mMWU3MjYwYTZiZDk=' },
  },
  apiOrigin: 'https://api.makeswift.com/',
  cacheData: [
    ['Swatch', []],
    ['File', []],
    ['Typography', []],
    ['PagePathnameSlice', []],
    ['Table', []],
  ],
  preview: false,
}
