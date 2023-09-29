import {
  FileFragment,
  GlobalElementFragment,
  SwatchFragment,
  TableFragment,
  TypographyFragment,
} from './fragments'

export const IntrospectedResourcesQuery = /* GraphQL */ `
  query IntrospectedResources($fileIds: [ID!]!, $tableIds: [ID!]!) {
    files(ids: $fileIds) {
      ...File
    }

    tables(ids: $tableIds) {
      ...Table
    }
  }

  ${FileFragment}
  ${TableFragment}
`

export const SwatchQuery = /* GraphQL */ `
  query Swatch($swatchId: ID!) {
    swatch(id: $swatchId) {
      ...Swatch
    }
  }

  ${SwatchFragment}
`

export const FileQuery = /* GraphQL */ `
  query File($fileId: ID!) {
    file(id: $fileId) {
      ...File
    }
  }

  ${FileFragment}
`

export const TypographyQuery = /* GraphQL */ `
  query Typography($typographyId: ID!) {
    typography(id: $typographyId) {
      ...Typography
    }
  }

  ${TypographyFragment}
`

export const TableQuery = /* GraphQL */ `
  query Table($tableId: ID!) {
    table(id: $tableId) {
      ...Table
    }
  }

  ${TableFragment}
`

export const TypographiesQuery = /* GraphQL */ `
  query Typographies($typographyIds: [ID!]!) {
    typographies(ids: $typographyIds) {
      ...Typography
    }
  }

  ${TypographyFragment}
`

export const GlobalElementQuery = /* GraphQL */ `
  query GlobalElement($globalElementId: ID!) {
    globalElement(id: $globalElementId) {
      ...GlobalElement
    }
  }

  ${GlobalElementFragment}
`

export const CreateTableRecordMutation = /* GraphQL */ `
  mutation CreateTableRecord($input: CreateTableRecordInput!) {
    createTableRecord(input: $input) {
      tableRecord {
        id
      }
    }
  }
`
