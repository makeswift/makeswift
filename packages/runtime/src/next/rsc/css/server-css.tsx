import 'server-only'
import { cache } from 'react'
import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { StylesheetEngine } from './css-runtime'

export type StyleData = {
  css: string
  propName: string | undefined
}

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

// TODO export pieces of this to be used by 
export function ElementCSSInjector({ elementKey }: { elementKey: string }) {
  const collector = getCSSCollector()
  const classnameToStylesMap = collector.getStylesMapForElement(elementKey)

  // Note to self: different from client component <style> tags in that these need to be able to be queried so that their content can be updated
  const styleTags = Array.from(classnameToStylesMap?.entries() ?? []).map(([className, perClassnameData]) => (
    <style
      key={className}
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
