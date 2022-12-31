export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

type Scalars = {
  ID: string
  JSON: Json
}

export type CreateTableRecordInput = {
  data: CreateTableRecordInputData
}

export type CreateTableRecordInputData = {
  columns: Array<CreateTableRecordInputDataColumn>
  tableId?: InputMaybe<Scalars['ID']>
}

export type CreateTableRecordInputDataColumn = {
  columnId: Scalars['ID']
  data: Scalars['JSON']
}

export const SnippetLocation = {
  Body: 'BODY',
  Head: 'HEAD',
} as const

export type SnippetLocation = typeof SnippetLocation[keyof typeof SnippetLocation]

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
  publicUrl: string
  extension: string | null
  dimensions: { width: number; height: number } | null
}

export type TypographyFragment = {
  __typename: 'Typography'
  id: string
  name: string
  style: Array<{
    deviceId: string
    value: {
      fontFamily: string | null
      lineHeight: number | null
      letterSpacing: number | null
      fontWeight: number | null
      textAlign: string | null
      uppercase: boolean | null
      underline: boolean | null
      strikethrough: boolean | null
      italic: boolean | null
      fontSize: { value: number | null; unit: string | null } | null
      color: { swatchId: string | null; alpha: number | null } | null
    }
  }>
}

export type PagePathnameSliceFragment = {
  __typename: 'PagePathnameSlice'
  id: string
  pathname: string
}

export type GlobalElementFragment = { __typename: 'GlobalElement'; id: string; data: Json }

export type TableFragment = {
  __typename: 'Table'
  id: string
  name: string
  columns: Array<
    | { __typename: 'CheckboxTableColumn'; id: string; name: string }
    | { __typename: 'EmailTableColumn'; id: string; name: string }
    | { __typename: 'LongTextTableColumn'; id: string; name: string }
    | {
        __typename: 'MultipleSelectTableColumn'
        id: string
        name: string
        options: Array<{ id: string; name: string }>
      }
    | { __typename: 'NumberTableColumn'; id: string; name: string }
    | { __typename: 'PhoneNumberTableColumn'; id: string; name: string }
    | { __typename: 'SingleLineTextTableColumn'; id: string; name: string }
    | {
        __typename: 'SingleSelectTableColumn'
        id: string
        name: string
        options: Array<{ id: string; name: string }>
      }
    | { __typename: 'URLTableColumn'; id: string; name: string }
  >
}

export type SnippetFragment = {
  __typename: 'Snippet'
  id: string
  name: string
  code: string
  cleanup: string | null
  location: SnippetLocation
  shouldAddToNewPages: boolean
  liveEnabled: boolean
  builderEnabled: boolean
}

export type PageFragment = {
  __typename: 'Page'
  id: string
  snippets: Array<{
    __typename: 'Snippet'
    id: string
    name: string
    code: string
    cleanup: string | null
    location: SnippetLocation
    shouldAddToNewPages: boolean
    liveEnabled: boolean
    builderEnabled: boolean
  }>
}

export type SiteFragment = {
  __typename: 'Site'
  id: string
  googleFonts: {
    edges: Array<{
      activeVariants: Array<{ specifier: string }>
      node: { family: string; variants: Array<{ specifier: string }> }
    } | null>
  }
}

export type IntrospectedResourcesQueryVariables = Exact<{
  swatchIds: Array<Scalars['ID']> | Scalars['ID']
  fileIds: Array<Scalars['ID']> | Scalars['ID']
  typographyIds: Array<Scalars['ID']> | Scalars['ID']
  pageIds: Array<Scalars['ID']> | Scalars['ID']
  tableIds: Array<Scalars['ID']> | Scalars['ID']
}>

export type IntrospectedResourcesQueryResult = {
  swatches: Array<{
    __typename: 'Swatch'
    id: string
    hue: number
    saturation: number
    lightness: number
  } | null>
  files: Array<{
    __typename: 'File'
    id: string
    name: string
    publicUrl: string
    extension: string | null
    dimensions: { width: number; height: number } | null
  } | null>
  typographies: Array<{
    __typename: 'Typography'
    id: string
    name: string
    style: Array<{
      deviceId: string
      value: {
        fontFamily: string | null
        lineHeight: number | null
        letterSpacing: number | null
        fontWeight: number | null
        textAlign: string | null
        uppercase: boolean | null
        underline: boolean | null
        strikethrough: boolean | null
        italic: boolean | null
        fontSize: { value: number | null; unit: string | null } | null
        color: { swatchId: string | null; alpha: number | null } | null
      }
    }>
  } | null>
  pagePathnamesById: Array<{ __typename: 'PagePathnameSlice'; id: string; pathname: string } | null>
  tables: Array<{
    __typename: 'Table'
    id: string
    name: string
    columns: Array<
      | { __typename: 'CheckboxTableColumn'; id: string; name: string }
      | { __typename: 'EmailTableColumn'; id: string; name: string }
      | { __typename: 'LongTextTableColumn'; id: string; name: string }
      | {
          __typename: 'MultipleSelectTableColumn'
          id: string
          name: string
          options: Array<{ id: string; name: string }>
        }
      | { __typename: 'NumberTableColumn'; id: string; name: string }
      | { __typename: 'PhoneNumberTableColumn'; id: string; name: string }
      | { __typename: 'SingleLineTextTableColumn'; id: string; name: string }
      | {
          __typename: 'SingleSelectTableColumn'
          id: string
          name: string
          options: Array<{ id: string; name: string }>
        }
      | { __typename: 'URLTableColumn'; id: string; name: string }
    >
  } | null>
}

export type SwatchQueryVariables = Exact<{
  swatchId: Scalars['ID']
}>

export type SwatchQueryResult = {
  swatch: {
    __typename: 'Swatch'
    id: string
    hue: number
    saturation: number
    lightness: number
  } | null
}

export type FileQueryVariables = Exact<{
  fileId: Scalars['ID']
}>

export type FileQueryResult = {
  file: {
    __typename: 'File'
    id: string
    name: string
    publicUrl: string
    extension: string | null
    dimensions: { width: number; height: number } | null
  } | null
}

export type TypographyQueryVariables = Exact<{
  typographyId: Scalars['ID']
}>

export type TypographyQueryResult = {
  typography: {
    __typename: 'Typography'
    id: string
    name: string
    style: Array<{
      deviceId: string
      value: {
        fontFamily: string | null
        lineHeight: number | null
        letterSpacing: number | null
        fontWeight: number | null
        textAlign: string | null
        uppercase: boolean | null
        underline: boolean | null
        strikethrough: boolean | null
        italic: boolean | null
        fontSize: { value: number | null; unit: string | null } | null
        color: { swatchId: string | null; alpha: number | null } | null
      }
    }>
  } | null
}

export type PagePathnamesByIdQueryVariables = Exact<{
  pageIds: Array<Scalars['ID']> | Scalars['ID']
}>

export type PagePathnamesByIdQueryResult = {
  pagePathnamesById: Array<{ __typename: 'PagePathnameSlice'; id: string; pathname: string } | null>
}

export type TableQueryVariables = Exact<{
  tableId: Scalars['ID']
}>

export type TableQueryResult = {
  table: {
    __typename: 'Table'
    id: string
    name: string
    columns: Array<
      | { __typename: 'CheckboxTableColumn'; id: string; name: string }
      | { __typename: 'EmailTableColumn'; id: string; name: string }
      | { __typename: 'LongTextTableColumn'; id: string; name: string }
      | {
          __typename: 'MultipleSelectTableColumn'
          id: string
          name: string
          options: Array<{ id: string; name: string }>
        }
      | { __typename: 'NumberTableColumn'; id: string; name: string }
      | { __typename: 'PhoneNumberTableColumn'; id: string; name: string }
      | { __typename: 'SingleLineTextTableColumn'; id: string; name: string }
      | {
          __typename: 'SingleSelectTableColumn'
          id: string
          name: string
          options: Array<{ id: string; name: string }>
        }
      | { __typename: 'URLTableColumn'; id: string; name: string }
    >
  } | null
}

export type TypographiesQueryVariables = Exact<{
  typographyIds: Array<Scalars['ID']> | Scalars['ID']
}>

export type TypographiesQueryResult = {
  typographies: Array<{
    __typename: 'Typography'
    id: string
    name: string
    style: Array<{
      deviceId: string
      value: {
        fontFamily: string | null
        lineHeight: number | null
        letterSpacing: number | null
        fontWeight: number | null
        textAlign: string | null
        uppercase: boolean | null
        underline: boolean | null
        strikethrough: boolean | null
        italic: boolean | null
        fontSize: { value: number | null; unit: string | null } | null
        color: { swatchId: string | null; alpha: number | null } | null
      }
    }>
  } | null>
}

export type GlobalElementQueryVariables = Exact<{
  globalElementId: Scalars['ID']
}>

export type GlobalElementQueryResult = {
  globalElement: { __typename: 'GlobalElement'; id: string; data: Json } | null
}

export type CreateTableRecordMutationVariables = Exact<{
  input: CreateTableRecordInput
}>

export type CreateTableRecordMutationResult = { createTableRecord: { tableRecord: { id: string } } }

export type SiteQueryVariables = Exact<{
  siteId: Scalars['ID']
}>

export type SiteQueryResult = {
  site: {
    __typename: 'Site'
    id: string
    googleFonts: {
      edges: Array<{
        activeVariants: Array<{ specifier: string }>
        node: { family: string; variants: Array<{ specifier: string }> }
      } | null>
    }
  } | null
}

export type PageQueryVariables = Exact<{
  pageId: Scalars['ID']
}>

export type PageQueryResult = {
  page: {
    __typename: 'Page'
    id: string
    snippets: Array<{
      __typename: 'Snippet'
      id: string
      name: string
      code: string
      cleanup: string | null
      location: SnippetLocation
      shouldAddToNewPages: boolean
      liveEnabled: boolean
      builderEnabled: boolean
    }>
  } | null
}
