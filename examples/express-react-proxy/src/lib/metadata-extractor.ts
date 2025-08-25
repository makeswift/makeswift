import * as cheerio from 'cheerio'

// TODO: Handle more tags
export function extractMetadataFromHtml(fullHtml: string): {
  metadataTags: string[]
  bodyHtml: string
  headHtml: string
} {
  const metadataTags: string[] = []

  // Match title tags with content
  const titleMatches = fullHtml.match(/<title[^>]*>.*?<\/title>/gi)
  if (titleMatches) {
    metadataTags.push(...titleMatches)
  }

  // Match self-closing meta and link tags
  const metaLinkMatches = fullHtml.match(/<(meta|link)[^>]*\/>/gi)
  if (metaLinkMatches) {
    metadataTags.push(...metaLinkMatches)
  }

  // Remove metadata tags from body HTML
  let bodyHtml = fullHtml
  metadataTags.forEach((tag) => {
    bodyHtml = bodyHtml.replace(tag, '')
  })

  // Generate head HTML string
  const headHtml = metadataTags.join('')

  return { metadataTags, bodyHtml, headHtml }
}

// TODO: Handle more tags
export function removeExistingMetaTags(
  $: cheerio.CheerioAPI,
  metadataTags: string[],
): void {
  metadataTags.forEach((tag) => {
    if (tag.includes('<title>')) {
      $('head title').remove()
    }
  })
}
