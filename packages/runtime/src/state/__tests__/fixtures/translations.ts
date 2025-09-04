export const accordionFullTree = {
  preTranslation: {
    key: '78f53e7e-ed98-4edd-9dcb-7f02365e73b5',
    props: {
      items: [
        {
          id: '9a0bc946-c95b-428b-9fea-4b97b55c2c16',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Apple' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: 'ae3cdadf-dbe8-481e-a7b0-22fe4e00dbe7',
                  type: 'button',
                  props: { children: { '@@makeswift/type': 'text-input::v1', value: 'Hello' } },
                },
              ],
            },
          },
        },

        {
          id: '59ec3631-eaa4-4b37-a6c7-cb462898579c',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Pear' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: '35747ea7-7caa-42e7-825b-c09c43ed1558',
                  type: 'button',
                  props: { children: { '@@makeswift/type': 'text-input::v1', value: 'Goodbye' } },
                },
              ],
            },
          },
        },
        {
          id: 'd1d4e7b4-cb6f-487d-84ac-49b3c45ec3e1',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Orange' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: '06718dbd-1913-4e15-b277-3d2b8f31a597',
                  type: 'button',
                  props: {
                    children: { '@@makeswift/type': 'text-input::v1', value: 'How are you?' },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    type: 'accordion',
  },

  postTranslation: {
    key: '78f53e7e-ed98-4edd-9dcb-7f02365e73b5',
    props: {
      items: [
        {
          id: '9a0bc946-c95b-428b-9fea-4b97b55c2c16',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Pomme' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: 'ae3cdadf-dbe8-481e-a7b0-22fe4e00dbe7',
                  type: 'button',
                  props: { children: { '@@makeswift/type': 'text-input::v1', value: 'Bonjour' } },
                },
              ],
            },
          },
        },
        {
          id: '59ec3631-eaa4-4b37-a6c7-cb462898579c',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Poire' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: '35747ea7-7caa-42e7-825b-c09c43ed1558',
                  type: 'button',
                  props: { children: { '@@makeswift/type': 'text-input::v1', value: 'Au revoir' } },
                },
              ],
            },
          },
        },
        {
          id: 'd1d4e7b4-cb6f-487d-84ac-49b3c45ec3e1',
          value: {
            title: { '@@makeswift/type': 'text-input::v1', value: 'Orange' },
            content: {
              columns: [{ deviceId: 'desktop', value: { count: 12, spans: [[12]] } }],
              elements: [
                {
                  key: '06718dbd-1913-4e15-b277-3d2b8f31a597',
                  type: 'button',
                  props: {
                    children: { '@@makeswift/type': 'text-input::v1', value: 'Comment vas-tu?' },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    type: 'accordion',
  },

  translationDto: {
    '78f53e7e-ed98-4edd-9dcb-7f02365e73b5:items': {
      '9a0bc946-c95b-428b-9fea-4b97b55c2c16': {
        title: {
          '@@makeswift/type': 'text-input::v1',
          value: 'Pomme',
        },
        content: null,
      },
      '59ec3631-eaa4-4b37-a6c7-cb462898579c': {
        title: {
          '@@makeswift/type': 'text-input::v1',
          value: 'Poire',
        },
        content: null,
      },
      'd1d4e7b4-cb6f-487d-84ac-49b3c45ec3e1': {
        title: {
          '@@makeswift/type': 'text-input::v1',
          value: 'Orange',
        },
        content: null,
      },
    },
    'ae3cdadf-dbe8-481e-a7b0-22fe4e00dbe7:children': {
      '@@makeswift/type': 'text-input::v1',
      value: 'Bonjour',
    },
    '35747ea7-7caa-42e7-825b-c09c43ed1558:children': {
      '@@makeswift/type': 'text-input::v1',
      value: 'Au revoir',
    },
    '06718dbd-1913-4e15-b277-3d2b8f31a597:children': {
      '@@makeswift/type': 'text-input::v1',
      value: 'Comment vas-tu?',
    },
  },
}

export const accordionPartialTree = {
  preTranslation: {
    key: '1eec4bc0-c83b-4bdc-80df-f52648e2a69e',
    type: 'slot-list',
    props: {
      items: [
        {
          id: '625924cd-70c7-40cf-a2f7-22e291f4af1a',
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
                key: '6d5e7984-7042-4ca5-bf09-ad663885de75',
                type: 'button',
                props: {
                  children: {
                    '@@makeswift/type': 'text-input::v1',
                    value: 'Hello',
                  },
                },
              },
            ],
          },
        },
        { id: 'eafe6366-f61a-4f30-84ac-d67750985485' },
      ],
    },
  },

  postTranslation: {
    key: '1eec4bc0-c83b-4bdc-80df-f52648e2a69e',
    type: 'slot-list',
    props: {
      items: [
        {
          id: '625924cd-70c7-40cf-a2f7-22e291f4af1a',
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
                key: '6d5e7984-7042-4ca5-bf09-ad663885de75',
                type: 'button',
                props: {
                  children: {
                    '@@makeswift/type': 'text-input::v1',
                    value: 'Bonjour',
                  },
                },
              },
            ],
          },
        },
        { id: 'eafe6366-f61a-4f30-84ac-d67750985485' },
      ],
    },
  },

  translationDto: {
    '1eec4bc0-c83b-4bdc-80df-f52648e2a69e:items': {
      '625924cd-70c7-40cf-a2f7-22e291f4af1a': null,
      'eafe6366-f61a-4f30-84ac-d67750985485': null,
    },
    '6d5e7984-7042-4ca5-bf09-ad663885de75:children': {
      '@@makeswift/type': 'text-input::v1',
      value: 'Bonjour',
    },
  },
}
