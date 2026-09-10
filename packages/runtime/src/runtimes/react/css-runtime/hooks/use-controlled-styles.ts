import React, { useCallback } from 'react'
import { ControlledStyles } from '../components/controlled-styles'
import { ControlledStyleData, GetStylesheet } from '../types'
import { useStylesContext } from './use-styles-context'
import { StylesheetEngine } from '../stylesheet-engine'
import { useDocumentKey } from '../../hooks/use-document-context'

export function useControlledStyles({ namespace }: { namespace: string }) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const documentKey = useDocumentKey()
  if (documentKey == null) {
    throw new Error('Root document key not found when attempting to use controlled styles')
  }

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
      return new StylesheetEngine({
        breakpointsData,
        documentKey,
        elementKey,
        propPathComponents,
        onDefineStyle,
        classNamePrefix,
      })
    },
    [classNamePrefix, stylesRegistry, namespace, documentKey],
  )

  const styleElements = React.createElement(ControlledStyles, {
    classNameToStyles: stylesRegistry.getControlledStyles(namespace),
  })

  return {
    getStylesheet,
    styleElements,
  }
}
