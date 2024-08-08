import { RichTextDTO } from '../dto'

export const SWATCH_ID = 'SWATCH_ID='
export const TYPOGRAPHY_ID = 'TYPOGRAPHY_ID='
export const PAGE_ID = 'PAGE_ID='

export const introspection: RichTextDTO = {
  object: 'value',
  annotations: undefined,
  data: undefined,
  document: {
    data: undefined,
    nodes: [
      {
        data: {},
        type: 'blockquote',
        nodes: [
          {
            object: 'inline',
            type: 'link',
            data: {
              type: 'OPEN_PAGE',
              payload: {
                pageId: PAGE_ID,
                openInNewTab: false,
              },
            },
            nodes: [
              {
                text: 'Credibly implement global synergy, then collaboratively implement goal-oriented sprints. Rapidiously initiate standards compliant clouds. ',
                marks: [
                  {
                    data: {
                      value: {
                        id: TYPOGRAPHY_ID,
                        style: [
                          {
                            value: {
                              color: {
                                swatchId: SWATCH_ID,
                                alpha: 1,
                              },
                            },
                          },
                          {
                            value: {
                              fontWeight: 500,
                            },
                          },
                          {
                            value: {
                              color: {
                                swatchId: undefined,
                                alpha: 1,
                              },
                            },
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
