import {
  FileFragment,
  GlobalElementFragment,
  SwatchFragment,
  TableFragment,
  TypographyFragment,
} from './fragments'

export const UnversionedResourcesQuery = /* GraphQL */ `
  query UnversionedResources($fileIds: [ID!]!, $tableIds: [ID!]!) {
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

export const TypographyQuery = /* GraphQL */ `
  query Typography($typographyId: ID!) {
    typography(id: $typographyId) {
      ...Typography
    }
  }

  ${TypographyFragment}
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
