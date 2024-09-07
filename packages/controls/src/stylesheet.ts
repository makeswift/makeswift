import { type Breakpoint, type Breakpoints } from './breakpoints'
import { type BoxModel } from './common/types'
import { type ResolvedStyleData, type StyleProperty } from './controls/style'
import { type ResolvedStyle as ResolvedTypographyStyle } from './controls/typography/style'

export type ResolvedStyleV1 = {
  properties: StyleProperty[]
  styleData: ResolvedStyleData
}

export interface ResolvedStyleV2<RuntimeStylesObject = unknown> {
  getStyle(breakpoint: Breakpoint): RuntimeStylesObject
}

export type ResolvedStyle =
  | ResolvedStyleV2
  | ResolvedStyleV1
  | ResolvedTypographyStyle

export interface Stylesheet {
  breakpoints(): Breakpoints
  defineStyle(
    style: ResolvedStyle,
    onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string

  child(id: string): Stylesheet
}
