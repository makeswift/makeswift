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
      publicUrl
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
      publicUrl
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
