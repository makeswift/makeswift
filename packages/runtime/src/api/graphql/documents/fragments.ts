/**
 * We _cannot_ interpolate fragments into other fragments. Doing so results in a document with
 * multiple fragment definitions, which is ambiguous when attempting to read a fragment from the
 * cache. This ambiguity results in an error being thrown by `@apollo/client` in the Makeswift
 * builder when attempting to send API resources to the host's runtime.
 */

export const SwatchFragment = /* GraphQL */ `
  fragment Swatch on Swatch {
    __typename
    id
    hue
    saturation
    lightness
  }
`

export const FileFragment = /* GraphQL */ `
  fragment File on File {
    __typename
    id
    name
    publicUrl: publicUrlV2
    extension
    dimensions {
      width
      height
    }
  }
`

export const TypographyFragment = /* GraphQL */ `
  fragment Typography on Typography {
    __typename
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

export const PagePathnameSliceFragment = /* GraphQL */ `
  fragment PagePathnameSlice on PagePathnameSlice {
    __typename
    id
    pathname
  }
`

export const GlobalElementFragment = /* GraphQL */ `
  fragment GlobalElement on GlobalElement {
    __typename
    id
    data

    localized(locale: $locale) {
      __typename
      id
      data
    }
  }
`

export const TableFragment = /* GraphQL */ `
  fragment Table on Table {
    __typename
    id
    name
    columns {
      __typename
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
`

export const SnippetFragment = /* GraphQL */ `
  fragment Snippet on Snippet {
    __typename
    id
    name
    code
    cleanup
    location
    shouldAddToNewPages
    liveEnabled
    builderEnabled
  }
`

export const PageFragment = /* GraphQL */ `
  fragment Page on Page {
    __typename
    id
    snippets {
      __typename
      id
      name
      code
      cleanup
      location
      shouldAddToNewPages
      liveEnabled
      builderEnabled
    }
  }
`

export const SiteFragment = /* GraphQL */ `
  fragment Site on Site {
    __typename
    id
    googleFonts {
      edges {
        activeVariants {
          specifier
        }
        node {
          family
          variants {
            specifier
          }
        }
      }
    }
  }
`
