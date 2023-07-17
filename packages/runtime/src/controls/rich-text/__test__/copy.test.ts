import { describe, test, expect } from 'vitest'
import { RichTextControlData, RichTextControlType } from '../rich-text'
import { copy } from '../../control'
import { ReplacementContext } from '../../../state/react-page'

const copyFixture: RichTextControlData = {
  object: 'value',
  document: {
    data: {},
    nodes: [
      {
        data: {},
        type: 'paragraph',
        nodes: [
          {
            text: 'Hello world',
            marks: [
              {
                data: {
                  value: {
                    id: 'VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=',
                    style: [
                      {
                        value: {
                          color: {
                            alpha: 1,
                            swatchId:
                              'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
                          },
                          fontSize: {
                            unit: 'px',
                            value: 23,
                          },
                          lineHeight: 2.5,
                          strikethrough: true,
                        },
                        deviceId: 'desktop',
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
  selection: {
    focus: {
      path: [0, 0],
      object: 'point',
      offset: 0,
    },
    anchor: {
      path: [0, 0],
      object: 'point',
      offset: 0,
    },
    object: 'selection',
    isFocused: false,
  },
}

describe('GIVEN copying RichText', () => {
  test('replaces the swatch and typography ids', () => {
    const expected = JSON.parse(
      JSON.stringify(copyFixture)
        .replace('U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'swatch-testing')
        .replace(
          'VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=',
          'typography-testing',
        ),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map([
        ['U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'swatch-testing'],
      ]),
      fileIds: new Map(),
      typographyIds: new Map([
        ['VHlwb2dyYXBoeTo5ODE1NWY0Ni1mNmQzLTQ1M2YtODk5OC02ZWY5NzJhNTBlY2U=', 'typography-testing'],
      ]),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    const result = copy({ type: RichTextControlType }, copyFixture, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    expect(result).toMatchObject(expected)
  })
})
