function buildEmotionStyleTag(
  key: string,
  names: string[],
  css: string,
): string {
  return `<style data-emotion="${key} ${names.join(' ')}">${css}</style>`
}

export function flushAndBuildStyles(cache: any, flush: () => string[]): string {
  const names = flush()
  if (names.length === 0) return ''

  let css = ''
  for (const n of names) {
    css += cache.inserted[n]
  }

  return buildEmotionStyleTag(cache.key, names, css)
}
