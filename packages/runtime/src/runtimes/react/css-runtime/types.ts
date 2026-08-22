import { CSSObject } from '@emotion/serialize'
import { BoxDisplayModel, Breakpoints, Stylesheet } from '@makeswift/controls'

/*
  Per React's `<style>` documentation:
  "React will infer that precedence values it discovers first are 'lower' and precedence
  values it discovers later are 'higher'"
*/
export const MakeswiftStylePrecedence = {
  RESET: 'reset',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const
export type MakeswiftStylePrecedence =
  (typeof MakeswiftStylePrecedence)[keyof typeof MakeswiftStylePrecedence]

export interface BrowserStyleApplier {
  apply({ className, css }: { className: string; css: string }): void
  dispose?(): void
}

export type GetStylesheet = ({
  breakpointsData,
  elementKey,
  propPathComponents,
}: {
  breakpointsData: Breakpoints
  elementKey: string
  propPathComponents: readonly string[]
}) => Stylesheet

export type ClassStyleData = {
  className: string
  css: string
  cssObject: CSSObject
}

export type ControlledStyleData = ClassStyleData & {
  contentHash: string
  elementKey: string
  joinedPropPath: string
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}

export type OnControlledStyleDataWrite = ({
  className,
  currentData,
  initialData,
}: {
  className: string
  currentData: ControlledStyleData
  initialData: ControlledStyleData
}) => void

export type CssResetData = {
  css: string
  contentHash: string

  // This array type is to accommodate our use of `normalize` from `polished`
  cssObjects: Array<CSSObject>
}

export type KeyframesData = {
  keyframesName: string
  css: string
}

export type BaseStylesData = {
  css: string
  contentHash: string
  cssObject: CSSObject
}
