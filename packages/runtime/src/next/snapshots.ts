/*
 * @note(Alex): DO NOT tie this to SerializedState.
 *
 * This data format is inherently unchangeable. Once we create snapshots, we will have snapshots in our db
 * with resources in this format. We can only add nullable fields to this.
 *
 * That's why I'm going to pretty great lengths to keep this independent.
 *
 * We will maintain mappings from `MakeswiftResources` to other data formats, like `SerializedState`.
 */
export type IdSpecified<T> = {
  id: string
  value: T
}
export type MakeswiftSnapshotResources = {
  swatches: IdSpecified<SwatchResource>[]
  typographies: IdSpecified<TypographyResource>[]
  files: IdSpecified<FileResource>[]
  pagePathnameSlices: IdSpecified<PathPathnameSliceResource>[]
  globalElements: IdSpecified<GlobalElementResource>[]
  // @todo: Do we need tables?
  snippets: IdSpecified<SnippetResource>[]
  // will use family as id to simplify
  fonts: IdSpecified<FontResource>[]
  pageMetadata: {
    title?: string | null
    description?: string | null
    keywords?: string | null
    socialImage?: {
      id: string
      publicUrl: string
      mimetype: string
    } | null
    favicon?: {
      id: string
      publicUrl: string
      mimetype: string
    } | null
  }
  pageSeo: {
    canonicalUrl?: string | null
    isIndexingBlocked?: boolean | null
  }
}

type SwatchResource = {
  id: string
  hue: number
  saturation: number
  lightness: number
}

type TypographyResource = {
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

type FileResource = {
  id: string
  name: string
  publicUrl: string
  extension: string | null
  dimensions: { width: number; height: number } | null
}

type PathPathnameSliceResource = {
  id: string
  pathname: string
}
type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
type GlobalElementResource = {
  id: string
  data: Json
}
type SnippetResource = {
  id: string
  code: string
  location: 'HEAD' | 'BODY'
  liveEnabled: boolean
  builderEnabled: boolean
  cleanup: string | null
}
type FontResource = { family: string; variants: string[] }

export function normalizeToMakeswiftResources(
  partialResources?: Partial<MakeswiftSnapshotResources>,
): MakeswiftSnapshotResources {
  const resources: MakeswiftSnapshotResources = {
    swatches: partialResources?.swatches || [],
    typographies: partialResources?.typographies || [],
    files: partialResources?.files || [],
    pagePathnameSlices: partialResources?.pagePathnameSlices || [],
    globalElements: partialResources?.globalElements || [],
    snippets: partialResources?.snippets || [],
    fonts: partialResources?.fonts || [],
    pageMetadata: partialResources?.pageMetadata || {},
    pageSeo: partialResources?.pageSeo || {},
  }
  return resources
}
