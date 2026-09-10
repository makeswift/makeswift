import { useContext } from 'react'
import { StylesContext, StylesContextValue } from '../components/styles-context-provider'

export function useStylesContext(): StylesContextValue {
  const context = useContext(StylesContext)
  if (!context) {
    throw new Error(
      'Styles context not found. Did you attempt to render Makeswift content without a <RootStyleRegistry> ancestor?',
    )
  }
  return context
}
