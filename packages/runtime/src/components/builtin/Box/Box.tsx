import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Element } from '../../../runtimes/react'
import Placeholder from './components/Placeholder'
import { useBoxAnimations } from './animations'
import {
  BorderRadiusValue,
  ElementIDValue,
  WidthValue,
  MarginValue,
  PaddingValue,
  ResponsiveIconRadioGroupValue,
  GridValue,
  GapYValue,
  GapXValue,
  CheckboxValue,
  ResponsiveSelectValue,
  ResponsiveNumberValue,
  BackgroundsValue,
  BorderValue,
  ShadowsValue,
} from '../../../prop-controllers/descriptors'
import {
  cssWidth,
  cssMargin,
  cssPadding,
  cssBorderRadius,
  cssGridItem,
  cssMediaRules,
  cssBorder,
  cssBoxShadow,
} from '../../utils/cssMediaRules'
import { BoxModelHandle, parse, createBox } from '../../../box-model'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { useBorder, useBoxShadow } from '../../hooks'
import { BoxAnimateIn } from './constants'

console.log({
  styled,
  motion,
  useBoxAnimations,
  cssWidth,
  cssMargin,
  cssPadding,
  cssBorderRadius,
  cssGridItem,
  cssMediaRules,
  cssBorder,
  cssBoxShadow,
  BackgroundsContainer,
  useBorder,
  useBoxShadow,
})

type Props = {
  id?: ElementIDValue
  backgrounds?: BackgroundsValue
  width?: WidthValue
  height?: ResponsiveIconRadioGroupValue<'auto' | 'stretch'>
  verticalAlign?: ResponsiveIconRadioGroupValue<
    'flex-start' | 'center' | 'flex-end' | 'space-between'
  >
  margin?: MarginValue
  padding?: PaddingValue
  border?: BorderValue
  borderRadius?: BorderRadiusValue
  boxShadow?: ShadowsValue
  rowGap?: GapYValue
  columnGap?: GapXValue
  boxAnimateType?: ResponsiveSelectValue<BoxAnimateIn>
  boxAnimateDuration?: ResponsiveNumberValue
  boxAnimateDelay?: ResponsiveNumberValue
  itemAnimateType?: ResponsiveSelectValue<BoxAnimateIn>
  itemAnimateDuration?: ResponsiveNumberValue
  itemAnimateDelay?: ResponsiveNumberValue
  itemStaggerDuration?: ResponsiveNumberValue
  hidePlaceholder?: CheckboxValue
  children?: GridValue
}

const Box = forwardRef(function Box(
  { id, children, hidePlaceholder }: Props,
  ref: Ref<BoxModelHandle>,
) {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [boxElement, setBoxElement] = useState<HTMLElement | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      getBoxModel() {
        const paddingBoxElement = innerRef.current
        const borderBoxElement = innerRef.current
        const marginBoxElement = boxElement
        const borderBox = innerRef.current?.getBoundingClientRect()
        const paddingBoxComputedStyle =
          paddingBoxElement?.ownerDocument.defaultView?.getComputedStyle(paddingBoxElement)
        const borderBoxComputedStyle =
          borderBoxElement?.ownerDocument.defaultView?.getComputedStyle(borderBoxElement)
        const marginBoxComputedStyle =
          marginBoxElement?.ownerDocument.defaultView?.getComputedStyle(marginBoxElement)
        const padding = paddingBoxComputedStyle && {
          top: parse(paddingBoxComputedStyle.paddingTop),
          right: parse(paddingBoxComputedStyle.paddingRight),
          bottom: parse(paddingBoxComputedStyle.paddingBottom),
          left: parse(paddingBoxComputedStyle.paddingLeft),
        }
        const border = borderBoxComputedStyle && {
          top: parse(borderBoxComputedStyle.borderTopWidth),
          right: parse(borderBoxComputedStyle.borderRightWidth),
          bottom: parse(borderBoxComputedStyle.borderBottomWidth),
          left: parse(borderBoxComputedStyle.borderLeftWidth),
        }
        const margin = marginBoxComputedStyle && {
          top: parse(marginBoxComputedStyle.marginTop),
          right: parse(marginBoxComputedStyle.marginRight),
          bottom: parse(marginBoxComputedStyle.marginBottom),
          left: parse(marginBoxComputedStyle.marginLeft),
        }

        return borderBox ? createBox({ borderBox, padding, border, margin }) : null
      },
    }),
    [boxElement],
  )

  return (
    <div ref={setBoxElement} id={id}>
      <div ref={innerRef}>
        {children && children.elements.length > 0 ? (
          children.elements.map(child => (
            <div key={child.key}>
              <Element element={child} />
            </div>
          ))
        ) : (
          <Placeholder hide={hidePlaceholder} />
        )}
      </div>
    </div>
  )
})

export default Box
