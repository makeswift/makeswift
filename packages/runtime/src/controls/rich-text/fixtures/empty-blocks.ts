import { RichTextDTO } from '../dto-types'

export const emptyBlockFixture: RichTextDTO = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'blockquote',
        nodes: [],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: undefined,
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: [
          {
            text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
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
      {
        data: {},
        type: 'blockquote',
        nodes: [],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: undefined,
        object: 'block',
      },
    ],
    object: 'document',
  },
  selection: {
    focus: {
      path: [1, 2],
      object: 'point',
      offset: 0,
    },
    marks: undefined,
    anchor: {
      path: [0, 0],
      object: 'point',
      offset: 0,
    },
    object: 'selection',
    isFocused: false,
  },
}

export const fixedEmptyBlockFixture: RichTextDTO = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'blockquote',
        nodes: [{ marks: [], object: 'text', text: '' }],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: [{ marks: [], object: 'text', text: '' }],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: [
          {
            text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
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
      {
        data: {},
        type: 'blockquote',
        nodes: [{ marks: [], object: 'text', text: '' }],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: [{ marks: [], object: 'text', text: '' }],
        object: 'block',
      },
    ],
    object: 'document',
  },
  selection: {
    focus: {
      path: [1, 2],
      object: 'point',
      offset: 0,
    },
    marks: undefined,
    anchor: {
      path: [0, 0],
      object: 'point',
      offset: 0,
    },
    object: 'selection',
    isFocused: false,
  },
}
