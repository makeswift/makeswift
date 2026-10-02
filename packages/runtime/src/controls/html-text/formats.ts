import { type DataType } from '@makeswift/controls'

import { type LinkDefinition } from '../link'

/** The formats that the editor turns on and off for the selected text. */
export const HTML_TEXT_FORMATS = ['bold', 'italic', 'underline', 'strikethrough'] as const

export type HtmlTextFormat = (typeof HTML_TEXT_FORMATS)[number]

/** The link of the selected text. */
export type HtmlTextLink = { href: string; openInNewTab: boolean }

/** The formats of a selection, from a check for each format and its link. */
export function htmlTextFormats(
  hasFormat: (format: HtmlTextFormat) => boolean,
  link: HtmlTextLink | null,
): HtmlTextFormats {
  const formats = Object.fromEntries(HTML_TEXT_FORMATS.map(format => [format, hasFormat(format)]))

  return { ...(formats as Record<HtmlTextFormat, boolean>), link }
}

export function anchorLink(anchor: HTMLAnchorElement): HtmlTextLink {
  return { href: anchor.getAttribute('href') ?? '', openInNewTab: anchor.target === '_blank' }
}

/** The formats of the selected text. */
export type HtmlTextFormats = Record<HtmlTextFormat, boolean> & { link: HtmlTextLink | null }

type LinkData = DataType<LinkDefinition>

/**
 * The Makeswift link of an `href`, for the builder link panel. A link that
 * has no Makeswift type, for example a relative URL, is an "Open URL" link.
 */
export function linkToData(link: HtmlTextLink | null): LinkData | null {
  if (link == null) return null

  const { href, openInNewTab } = link

  if (href.startsWith('mailto:')) {
    const [to = '', search = ''] = href.slice('mailto:'.length).split('?')
    const query = new URLSearchParams(search)

    return {
      type: 'SEND_EMAIL',
      payload: {
        to: decodeURIComponent(to),
        subject: query.get('subject') ?? undefined,
        body: query.get('body') ?? undefined,
      },
    }
  }

  if (href.startsWith('tel:')) {
    return { type: 'CALL_PHONE', payload: { phoneNumber: href.slice('tel:'.length) } }
  }

  return { type: 'OPEN_URL', payload: { url: href, openInNewTab } }
}

/**
 * The `href` of a Makeswift link from the builder link panel. `undefined`
 * means that HTML cannot hold the link: a page link or a scroll link needs
 * the Makeswift resolver.
 */
export function linkFromData(data: unknown): HtmlTextLink | null | undefined {
  if (data == null) return null

  // The link types that HTML can hold. `LinkData` does not narrow by `type`.
  const link = data as
    | { type: 'OPEN_URL'; payload: { url: string; openInNewTab: boolean } }
    | { type: 'SEND_EMAIL'; payload: { to: string; subject?: string; body?: string } }
    | { type: 'CALL_PHONE'; payload: { phoneNumber: string } }
    | { type: 'OPEN_PAGE' | 'SCROLL_TO_ELEMENT' }

  switch (link.type) {
    case 'OPEN_URL':
      return { href: link.payload.url, openInNewTab: link.payload.openInNewTab }

    case 'SEND_EMAIL': {
      const query = new URLSearchParams()

      if (link.payload.subject) query.set('subject', link.payload.subject)
      if (link.payload.body) query.set('body', link.payload.body)

      const search = query.toString()

      return {
        href: `mailto:${link.payload.to}${search === '' ? '' : `?${search}`}`,
        openInNewTab: false,
      }
    }

    case 'CALL_PHONE':
      return { href: `tel:${link.payload.phoneNumber}`, openInNewTab: false }

    default:
      return undefined
  }
}
