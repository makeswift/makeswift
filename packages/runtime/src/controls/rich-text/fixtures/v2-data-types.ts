import { RichTextDTO } from '../dto-types'

export const v2DataFixture: RichTextDTO = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'heading-five',
        nodes: [
          {
            marks: [],
            text: 'text',
            object: 'text',
          },
        ],
        object: 'block',
      },
      {
        data: {},
        type: 'heading-four',
        nodes: [
          {
            marks: [],
            text: 'text',
            object: 'text',
          },
        ],
        object: 'block',
      },
      {
        data: {},
        type: 'blockquote',
        nodes: [
          {
            marks: [],
            text: 'text',
            object: 'text',
          },
        ],
        object: 'block',
      },
      {
        data: {},
        type: 'heading-six',
        nodes: [
          {
            marks: [],
            text: 'text',
            object: 'text',
          },
        ],
        object: 'block',
      },
      {
        data: {},
        type: 'default',
        nodes: [
          {
            marks: [],
            text: 'text',
            object: 'text',
          },
        ],
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
