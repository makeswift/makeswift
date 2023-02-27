import { RichTextDTO } from '../dto-types'

export const listFixture: RichTextDTO = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'unordered-list',
        nodes: [
          {
            data: {},
            type: 'list-item',
            nodes: [
              {
                data: {},
                type: 'list-item-child',
                nodes: [
                  {
                    text: 'Point1',
                    marks: [
                      {
                        data: {
                          value: {
                            id: 'VHlwb2dyYXBoeTpiZjFhNzNlNi0yMGNkLTQwZjEtOThmMC02MDc5OWU2ZWJmZmE=',
                            style: [],
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
            object: 'block',
          },
          {
            data: {},
            type: 'list-item',
            nodes: [
              {
                data: {},
                type: 'list-item-child',
                nodes: [
                  {
                    text: 'POint 2',
                    marks: [
                      {
                        data: {
                          value: {
                            id: 'VHlwb2dyYXBoeTpiZjFhNzNlNi0yMGNkLTQwZjEtOThmMC02MDc5OWU2ZWJmZmE=',
                            style: [],
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
            object: 'block',
          },
          {
            data: {},
            type: 'list-item',
            nodes: [
              {
                data: {},
                type: 'list-item-child',
                nodes: [
                  {
                    text: 'POint 3',
                    marks: [
                      {
                        data: {
                          value: {
                            id: 'VHlwb2dyYXBoeTpiZjFhNzNlNi0yMGNkLTQwZjEtOThmMC02MDc5OWU2ZWJmZmE=',
                            style: [],
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
            object: 'block',
          },
        ],
        object: 'block',
      },
    ],
    object: 'document',
  },
  selection: undefined,
}
