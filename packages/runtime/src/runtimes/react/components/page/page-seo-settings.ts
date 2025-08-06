export type PageMetadataSettings = {
  title?: boolean
  description?: boolean
  keywords?: boolean
  socialImage?: boolean
  canonicalUrl?: boolean
  indexingBlocked?: boolean
  favicon?: boolean
}

export function flattenMetadataSettings(
  settings?: boolean | PageMetadataSettings,
): PageMetadataSettings {
  if (typeof settings === 'boolean')
    return {
      title: settings,
      description: settings,
      keywords: settings,
      socialImage: settings,
      canonicalUrl: settings,
      indexingBlocked: settings,
      favicon: settings,
    }
  if (settings == null) return {}
  return settings
}
