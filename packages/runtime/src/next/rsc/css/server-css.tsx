import 'server-only'
import { cache } from 'react'
import { BoxDisplayModel, type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { StylesheetEngine } from './css-runtime'

export type StyleData = {
  css: string
  joinedPropPath: string | undefined
}

export type RSCStyleData = StyleData & {
  shouldPollBoxModel: boolean
}

export class ServerCSSCollector {
  /*
    Maps an element key to a mapping of className to StyleData

    TODO this is a weird type
  */
  private elementToStylesMap = new Map<string, Map<string, RSCStyleData>>()

  collect(elementKey: string, className: string, css: string, joinedPropPath?: string, onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void) {
    const stylesMap = this.elementToStylesMap.get(elementKey) ?? new Map<string, RSCStyleData>()
    stylesMap.set(className, {
      css,
      joinedPropPath,
      shouldPollBoxModel: onBoxModelChange != null,
    })
    this.elementToStylesMap.set(elementKey, stylesMap)
  }

  getStylesMapForElement(elementKey: string): Map<string, RSCStyleData> | null {
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

  return new StylesheetEngine(breakpoints, elementKey, [], ({ className, css, joinedPropPath, onBoxModelChange }) => {
    collector.collect(elementKey, className, css, joinedPropPath, onBoxModelChange)
  })
}

export function ElementCSSInjector({ elementKey }: { elementKey: string }) {
  const collector = getCSSCollector()
  const classnameToStylesMap = collector.getStylesMapForElement(elementKey)

  // Note to self: different from client component <style> tags in that these need to be able to be queried so that their content can be updated
  const styleTags = Array.from(classnameToStylesMap?.entries() ?? []).map(([className, perClassnameData]) => (
    <style
      key={className}
      data-makeswift-rsc-element-key={elementKey}
      data-makeswift-rsc-prop-path={perClassnameData.joinedPropPath}
      data-makeswift-rsc-classname={className}
      data-makeswift-rsc-should-poll-box-model={perClassnameData.shouldPollBoxModel }
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
