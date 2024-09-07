import { type Breakpoints } from './breakpoints'
import { type BoxModel } from './common/types'
import { type ResolvedStyleData, type StyleProperty } from './controls/style'
import { type ResolvedStyle as ResolvedTypographyStyle } from './controls/typography/style'

export interface Stylesheet {
  breakpoints(): Breakpoints
  defineStyle(
    props: StyleProperty[],
    style: ResolvedTypographyStyle | ResolvedStyleData,
    onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string

  child(id: string): Stylesheet
}
