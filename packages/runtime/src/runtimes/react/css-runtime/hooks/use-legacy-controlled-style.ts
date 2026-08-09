import { CSSObject } from '@emotion/serialize'
import { generateClassName } from '../utils'
import React from 'react'
import { useStylesContext } from './use-styles-context'
import { ControlledStyles } from '../components/controlled-styles'
import { toCssStatements } from '../serialize-css'
import { ControlledStyleData } from '../types'
import { useDocumentKey } from '../../hooks/use-document-context'

export function useLegacyControlledStyle(style: CSSObject, elementKey: string, propName: string) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const documentKey = useDocumentKey()
  if (documentKey == null) {
    throw new Error('Root document key not found when attempting to use legacy controlled styles')
  }

  /*
    Namespaced separately from styles for modern control instances in order to avoid
    unintentionally attempting to render the corresponding style elements twice.
  */
  const namespace = `${elementKey}-legacy-${propName}`
  const className = generateClassName({
    data: `${documentKey}-${elementKey}-${propName}`,
    classNamePrefix,
  })

  const { css, contentHash } = toCssStatements(style, className)

  const data: ControlledStyleData = {
    className,
    css,
    cssObject: style,
    contentHash,
    elementKey,
    joinedPropPath: propName,
    onBoxModelChange: undefined,
  }

  stylesRegistry.setControlledStyle({
    namespace,
    className,
    data,
  })

  const styleElement = React.createElement(ControlledStyles, {
    classNameToStyles: new Map([[className, data]]),
  })

  return {
    className,
    styleElement,
  }
}
