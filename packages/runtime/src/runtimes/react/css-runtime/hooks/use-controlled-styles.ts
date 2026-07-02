import { useCallback, useRef } from "react"
import { ControlledStyles } from "../components/ControlledStyles"
import { BoxDisplayModel, Breakpoints, Stylesheet } from "@makeswift/controls"
import { StylesheetEngine } from "../css-runtime"
import React from "react"
import { useStylesContext } from "./use-styles-context"

export type ControlledStyleData = {
  css: string
  contentHash: string
  counter: number
  joinedPropPath: string | undefined
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}

export type GetStylesheet = ({ breakpointsData, elementKey, propPathComponents }: {
  breakpointsData: Breakpoints;
  elementKey: string;
  propPathComponents: readonly string[];
}) => Stylesheet

export function useControlledStyles() {
  const stylesMap = useRef<Map<string, ControlledStyleData>>(new Map()).current
  const { classNamePrefix } = useStylesContext()

  const getStylesheet = useCallback<GetStylesheet>(({
    breakpointsData,
    elementKey,
    propPathComponents,
  }) => {
    return new StylesheetEngine(breakpointsData, elementKey, propPathComponents, ({ className, css, contentHash, joinedPropPath, onBoxModelChange}) => {
      const existingEntry = stylesMap.get(className)
      const counter = (existingEntry?.counter ?? 0) + 1
      stylesMap.set(className, {
        css,
        contentHash,
        counter,
        joinedPropPath,
        onBoxModelChange
      })
    }, classNamePrefix)
  }, [])
  const styleElements = React.createElement(ControlledStyles, { classNameToStyles: stylesMap })

  return {
    getStylesheet,
    styleElements
  }
}