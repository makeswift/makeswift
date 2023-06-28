import { DocumentNode } from 'graphql'
export const Swatch = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Swatch' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Swatch' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'saturation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lightness' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const File = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'File' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'File' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'publicUrl' },
            name: { kind: 'Name', value: 'publicUrlV2' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'extension' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'dimensions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                { kind: 'Field', name: { kind: 'Name', value: 'height' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const Typography = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Typography' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Typography' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'style' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'deviceId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'value' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'fontFamily' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fontSize' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'unit' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'color' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'swatchId' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'alpha' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'lineHeight' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'letterSpacing' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fontWeight' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'textAlign' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'uppercase' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'underline' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'strikethrough' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'italic' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const PagePathnameSlice = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PagePathnameSlice' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PagePathnameSlice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pathname' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const GlobalElement = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'GlobalElement' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GlobalElement' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const Table = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Table' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Table' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'columns' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'MultipleSelectTableColumn' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'options' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SingleSelectTableColumn' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'options' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const Snippet = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Snippet' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Snippet' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cleanup' } },
          { kind: 'Field', name: { kind: 'Name', value: 'location' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shouldAddToNewPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'liveEnabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'builderEnabled' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const Page = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Page' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Page' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'snippets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'cleanup' } },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shouldAddToNewPages' } },
                { kind: 'Field', name: { kind: 'Name', value: 'liveEnabled' } },
                { kind: 'Field', name: { kind: 'Name', value: 'builderEnabled' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode
export const Site = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Site' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Site' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'googleFonts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'activeVariants' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'specifier' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'family' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'variants' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'specifier' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode
