import React, { useCallback } from 'react'
import { ControlledStyles } from '../components/controlled-styles'
import { ControlledStyleData, GetStylesheet } from '../types'
import { useStylesContext } from './use-styles-context'
import { StylesheetEngine } from '../stylesheet-engine'

export function useControlledStyles({ namespace }: { namespace: string }) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()

  const getStylesheet = useCallback<GetStylesheet>(
    ({ breakpointsData, elementKey, propPathComponents }) => {
      const onDefineStyle = (definedStyle: ControlledStyleData) => {
        stylesRegistry.setControlledStyle({
          namespace,
          className: definedStyle.className,
          data: {
            ...definedStyle,
          },
        })
      }
      return new StylesheetEngine(
        breakpointsData,
        elementKey,
        propPathComponents,
        onDefineStyle,
        classNamePrefix,
      )
    },
    [classNamePrefix, stylesRegistry, namespace],
  )

  const styleElements = React.createElement(ControlledStyles, {
    classNameToStyles: stylesRegistry.getControlledStyles(namespace),
  })

  return {
    getStylesheet,
    styleElements,
  }
}
