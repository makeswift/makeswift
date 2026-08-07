import { useMemo } from 'react'

import { StylesheetEngine } from '../server/css/css-runtime'
import { useClientCSS } from '../server/css/client-css'

import { type StylesheetFactory } from '../stylesheet-factory'

import { useBreakpoints } from './use-breakpoints'

export const useEditableElementStylesheetFactory = ({
  elementKey: baseElementKey,
}: {
  elementKey: string
}): StylesheetFactory => {
  const { updateStyle } = useClientCSS()
  const breakpoints = useBreakpoints()

  const stylesheetEngine = useMemo(
    () =>
      new StylesheetEngine(
        breakpoints,
        baseElementKey,
        undefined,
        (_className, css, elementKey, propName) => {
          if (elementKey && propName) updateStyle(elementKey, propName, css)
        },
      ),
    [breakpoints, baseElementKey, updateStyle],
  )

  return {
    get: (propName: string) => stylesheetEngine.child(propName),
    useDefinedStyles: () => {
      // FIXME
    },
  }
}
