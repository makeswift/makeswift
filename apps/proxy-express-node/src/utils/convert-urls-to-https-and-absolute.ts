import * as cheerio from 'cheerio'

function convertToSecureAbsoluteUrl(url: string, host: string): string {
  if (url.startsWith('//')) {
    return `https:${url}`
  } else if (url.startsWith('/')) {
    return `${host}${url}`
  } else if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

function convertUrlsInAttribute(
  $: cheerio.CheerioAPI,
  selector: string,
  attr: string,
  host: string,
) {
  $(selector).each((_, elem) => {
    const url = $(elem).attr(attr)
    if (url) {
      $(elem).attr(attr, convertToSecureAbsoluteUrl(url, host))
    }
  })
}

export function convertAllUrlsToHttpsAndAbsolute(
  $: cheerio.CheerioAPI,
  host: string,
) {
  // Convert standard URL attributes to HTTPS
  convertUrlsInAttribute($, 'link[href]', 'href', host)
  convertUrlsInAttribute($, 'script[src]', 'src', host)
  convertUrlsInAttribute($, 'img[src]', 'src', host)

  // Handle srcset attribute separately as it contains multiple URLs
  $('img[srcset]').each((_, elem) => {
    const srcset = $(elem).attr('srcset')
    if (srcset) {
      const rewrittenSrcset = srcset
        .split(',')
        .map((src) => {
          const [url, descriptor] = src.trim().split(/\s+/)
          const newUrl = convertToSecureAbsoluteUrl(url, host)
          return descriptor ? `${newUrl} ${descriptor}` : newUrl
        })
        .join(', ')

      $(elem).attr('srcset', rewrittenSrcset)
    }
  })
}
