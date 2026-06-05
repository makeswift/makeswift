import { useCallback, useRef } from "react"
import { ControlledStyles } from "../components/ControlledStyles"
import { BoxDisplayModel, Breakpoints, Stylesheet } from "@makeswift/controls"
import { StylesheetEngine } from "../css-runtime"
import React from "react"

export type ControlledStyleData = {
  css: string
  counter: number
  joinedPropPath: string | undefined
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}

export function useControlledStyles() {
  const stylesMap = useRef<Map<string, ControlledStyleData>>(new Map()).current

  const getStylesheet = useCallback(({
    breakpointsData,
    elementKey,
    propPathComponents,
  }: {
    breakpointsData: Breakpoints,
    elementKey: string,
    propPathComponents: readonly string[],
  }): Stylesheet => {
    return new StylesheetEngine(breakpointsData, elementKey, propPathComponents, ({ className, css, joinedPropPath, onBoxModelChange}) => {
      const existingEntry = stylesMap.get(className)
      const counter = (existingEntry?.counter ?? 0) + 1
      stylesMap.set(className, {
        css,
        counter,
        joinedPropPath,
        onBoxModelChange
      })
    })
  }, [])

  const renderControlledStyles = useCallback(() => {
    return React.createElement(ControlledStyles, { classNameToStyles: stylesMap })
  }, [])

  return {
    getStylesheet,
    renderControlledStyles,
  }
}