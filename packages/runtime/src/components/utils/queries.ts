import { gql } from '@apollo/client'

export const SWATCHES_BY_ID = gql`
  query SwatchesById($ids: [ID!]!) {
    swatches(ids: $ids) {
      id
      hue
      saturation
      lightness
    }
  }
`

export const FILE_BY_ID = gql`
  query FileById($id: ID!) {
    file(id: $id) {
      id
      name
      publicUrl: publicUrlV2
      extension
      dimensions {
        width
        height
      }
    }
  }
`

export const FILES_BY_ID = gql`
  query FilesById($ids: [ID!]!) {
    files(ids: $ids) {
      id
      name
      publicUrl: publicUrlV2
      extension
      dimensions {
        width
        height
      }
    }
  }
`

export const PAGE_PATHNAMES_BY_ID = gql`
  query PagePathnamesById($ids: [ID!]!) {
    pagePathnamesById(ids: $ids) {
      id
      pathname
    }
  }
`

export const TYPOGRAPHY_FRAGMENT = gql`
  fragment Typography on Typography {
    id
    name
    style {
      deviceId
      value {
        fontFamily
        fontSize {
          value
          unit
        }
        color {
          swatchId
          alpha
        }
        lineHeight
        letterSpacing
        fontWeight
        textAlign
        uppercase
        underline
        strikethrough
        italic
      }
    }
  }
`

export const TYPOGRAPHIES_BY_ID = gql`
  query TypographiesById($ids: [ID!]!) {
    typographies(ids: $ids) {
      ...Typography
    }
  }

  ${TYPOGRAPHY_FRAGMENT}
`

export const TABLE_BY_ID = gql`
  query TableById($id: ID!) {
    table(id: $id) {
      id
      name
      columns {
        id
        name
        ... on MultipleSelectTableColumn {
          options {
            id
            name
          }
        }
        ... on SingleSelectTableColumn {
          options {
            id
            name
          }
        }
      }
    }
  }
`

export const ELEMENT_REFERENCE_GLOBAL_ELEMENT = gql`
  query ElementReferenceGlobalElement($id: ID!) {
    globalElement(id: $id) {
      id
      data
    }
  }
`

export const INTROSPECTION_QUERY = gql`
  query Introspection(
    $swatchIds: [ID!]!
    $fileIds: [ID!]!
    $pageIds: [ID!]!
    $typographyIds: [ID!]!
    $tableIds: [ID!]!
  ) {
    swatches(ids: $swatchIds) {
      id
      hue
      saturation
      lightness
    }

    files(ids: $fileIds) {
      id
      name
      publicUrlV2
      extension
      dimensions {
        width
        height
      }
    }

    pagePathnamesById(ids: $pageIds) {
      id
      pathname
    }

    typographies(ids: $typographyIds) {
      ...Typography
    }

    tables(ids: $tableIds) {
      id
      name
      columns {
        id
        name
        ... on MultipleSelectTableColumn {
          options {
            id
            name
          }
        }
        ... on SingleSelectTableColumn {
          options {
            id
            name
          }
        }
      }
    }
  }

  ${TYPOGRAPHY_FRAGMENT}
`
