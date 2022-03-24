import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type SwatchFragment = {
  __typename: 'Swatch'
  id: string
  hue: number
  saturation: number
  lightness: number
}

export type FileFragment = {
  __typename: 'File'
  id: string
  name: string
  publicUrl: any
  extension?: string | null
  dimensions?: { __typename?: 'ImageDimensions'; width: number; height: number } | null
}

export type TypographyFragment = {
  __typename: 'Typography'
  id: string
  name: string
  style: Array<{
    __typename?: 'TypographyStyle'
    deviceId: string
    value: {
      __typename?: 'TypographyStyleValue'
      fontFamily?: string | null
      lineHeight?: number | null
      letterSpacing?: number | null
      fontWeight?: number | null
      textAlign?: string | null
      uppercase?: boolean | null
      underline?: boolean | null
      strikethrough?: boolean | null
      italic?: boolean | null
      fontSize?: { __typename?: 'Length'; value?: number | null; unit?: string | null } | null
      color?: { __typename?: 'Color'; swatchId?: string | null; alpha?: number | null } | null
    }
  }>
}

export type PagePathnameSliceFragment = {
  __typename: 'PagePathnameSlice'
  id: string
  pathname: any
}

export type GlobalElementFragment = { __typename: 'GlobalElement'; id: string; data: any }

export type TableFragment = {
  __typename: 'Table'
  id: string
  name: string
  columns: Array<
    | { __typename?: 'CheckboxTableColumn'; id: string; name: string }
    | { __typename?: 'EmailTableColumn'; id: string; name: string }
    | { __typename?: 'LongTextTableColumn'; id: string; name: string }
    | {
        __typename?: 'MultipleSelectTableColumn'
        id: string
        name: string
        options: Array<{ __typename?: 'MultipleSelectTableColumnOption'; id: string; name: string }>
      }
    | { __typename?: 'NumberTableColumn'; id: string; name: string }
    | { __typename?: 'PhoneNumberTableColumn'; id: string; name: string }
    | { __typename?: 'SingleLineTextTableColumn'; id: string; name: string }
    | {
        __typename?: 'SingleSelectTableColumn'
        id: string
        name: string
        options: Array<{ __typename?: 'SingleSelectTableColumnOption'; id: string; name: string }>
      }
    | { __typename?: 'URLTableColumn'; id: string; name: string }
  >
}

export const SwatchFragmentDoc = {
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
} as unknown as DocumentNode<SwatchFragment, unknown>
export const FileFragmentDoc = {
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
          { kind: 'Field', name: { kind: 'Name', value: 'publicUrl' } },
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
} as unknown as DocumentNode<FileFragment, unknown>
export const TypographyFragmentDoc = {
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
} as unknown as DocumentNode<TypographyFragment, unknown>
export const PagePathnameSliceFragmentDoc = {
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
} as unknown as DocumentNode<PagePathnameSliceFragment, unknown>
export const GlobalElementFragmentDoc = {
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
} as unknown as DocumentNode<GlobalElementFragment, unknown>
export const TableFragmentDoc = {
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
} as unknown as DocumentNode<TableFragment, unknown>
