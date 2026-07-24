import { CSSObject } from "@emotion/serialize"
import { BoxDisplayModel, Breakpoints, Stylesheet } from "@makeswift/controls"

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
export type MakeswiftStylePrecedence = typeof MakeswiftStylePrecedence[keyof typeof MakeswiftStylePrecedence]

// What a Makeswift Stylesheet outputs during prop resolution
export type StylesheetDefinedStyleData = {
  className: string,
  css: string,
  cssObject: CSSObject,
  contentHash: string,
  elementKey: string,
  joinedPropPath: string,
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}

export type GetStylesheet = ({ breakpointsData, elementKey, propPathComponents }: {
  breakpointsData: Breakpoints;
  elementKey: string;
  propPathComponents: readonly string[];
}) => Stylesheet

export type ControlledStyleData = StylesheetDefinedStyleData & {
  counter: number
}

export type UncontrolledStyleData = {
  css: string
  cssObject: CSSObject
}

export type CssResetData = {
  css: string

  // This array type is to accommodate our use of `normalize` from `polished`
  cssObjects: Array<CSSObject>
}

// TODO type cleanup?
export type BaseStylesData = UncontrolledStyleData

export interface BrowserStyleApplier {
  apply({ className, css }: { className: string, css: string }): void
  dispose?(): void
}

export type OnControlledStyleDataWrite = ({ className, data }: { className: string, data: ControlledStyleData }) => void
