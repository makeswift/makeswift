import 'server-only'
import { cache } from 'react'
import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { StylesheetEngine } from './css-runtime'

type StyleData = {
  css: string
  propName: string | undefined
  key: string
}


/*
  Current spike considerations:
  - we probably want `updateStyle` in `client-css.tsx` to be as simple as possible. This means it should able to replace <style> textContent with a newly
  resolved value, rather than concatenating a series of styles. This is what drove having one <style> per prop
  - while classname currently includes both the element key and the prop name, I'm not using className as a way for the client to
    identify <style> tags because we're probably going to encode/shorten className in the future
*/
export class ServerCSSCollector {
  /*
    Maps an element key to a mapping of className to StyleData

    TODO this is a weird type
  */
  private elementToStylesMap = new Map<string, Map<string, StyleData>>()

  collect(elementKey: string, className: string, css: string, propName?: string) {
    const stylesMap = this.elementToStylesMap.get(elementKey) ?? new Map<string, StyleData>()
    stylesMap.set(className, {
      css,
      propName,
      key: `${elementKey}:${propName}`
    })
    this.elementToStylesMap.set(elementKey, stylesMap)
  }

  getStylesMapForElement(elementKey: string): Map<string, StyleData> | null {
    return this.elementToStylesMap.get(elementKey) ?? null
  }
}

export const getCSSCollector = cache((): ServerCSSCollector => {
  return new ServerCSSCollector()
})

export function createCollectingServerStylesheet(
  breakpoints: Breakpoints,
  elementKey: string,
): Stylesheet {
  const collector = getCSSCollector()

  return new StylesheetEngine(breakpoints, elementKey, undefined, (className, css, _, propName) => {
    collector.collect(elementKey, className, css, propName)
  })
}

export function ElementCSSInjector({ elementKey }: { elementKey: string }) {
  const collector = getCSSCollector()
  const classnameToStylesMap = collector.getStylesMapForElement(elementKey)

  const styleTags = Array.from(classnameToStylesMap?.entries() ?? []).map(([_, perClassnameData]) => (
    <style
      key={perClassnameData.key}
      data-makeswift-rsc-element-key={elementKey}
      data-makeswift-rsc-prop-name={perClassnameData.propName}
    >
        {perClassnameData.css}
    </style>
  ))

  return (
    <>
      {styleTags}
    </>
  )
}
