import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { cx } from '@emotion/css'

import { Element } from '../../../runtimes/react'
import Placeholder from './components/Placeholder'
import { useBoxAnimations } from './animations'
import {
  ElementIDValue,
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
import { cssMediaRules, cssBorder, cssBoxShadow } from '../../utils/cssMediaRules'
import { BoxModelHandle, parse, createBox } from '../../../box-model'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import {
  BorderPropControllerData,
  BoxShadowPropControllerData,
  useBorder,
  useBoxShadow,
} from '../../hooks'
import { BoxAnimateIn } from './constants'
import { responsiveStyle } from '../../utils/responsive-style'
import { GridItem } from '../../shared/grid-item'
import { useStyle } from '../../../runtimes/react/use-style'

type Props = {
  id?: ElementIDValue
  backgrounds?: BackgroundsValue
  width?: string
  height?: ResponsiveIconRadioGroupValue<'auto' | 'stretch'>
  verticalAlign?: ResponsiveIconRadioGroupValue<
    'flex-start' | 'center' | 'flex-end' | 'space-between'
  >
  margin?: string
  padding?: string
  border?: BorderValue
  borderRadius?: string
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

const Grid = styled.div.withConfig({
  shouldForwardProp: prop => !['border', 'boxShadow', 'alignContent'].includes(prop),
})<{
  border: BorderPropControllerData | null | undefined
  boxShadow: BoxShadowPropControllerData | null | undefined
  alignContent: Props['verticalAlign']
}>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  ${cssBorder()}
  ${cssBoxShadow()}
  ${props =>
    cssMediaRules([props.alignContent] as const, ([alignContent = 'flex-start']) => ({
      alignContent,
    }))}
`

const Box = forwardRef(function Box(
  {
    id,
    backgrounds,
    width,
    height,
    margin,
    padding,
    border,
    children,
    borderRadius,
    boxShadow,
    rowGap,
    columnGap,
    hidePlaceholder,
    verticalAlign,
    boxAnimateType,
    boxAnimateDuration,
    boxAnimateDelay,
    itemAnimateDelay,
    itemAnimateType,
    itemAnimateDuration,
    itemStaggerDuration,
  }: Props,
  ref: Ref<BoxModelHandle>,
) {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [boxElement, setBoxElement] = useState<HTMLElement | null>(null)
  const hasAnimations = boxAnimateType != null || itemAnimateType != null

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

  const borderData = useBorder(border)
  const boxShadowData = useBoxShadow(boxShadow)

  const gridItemClassName = useStyle(
    responsiveStyle([verticalAlign], ([alignItems = 'flex-start']) => ({ alignItems })),
  )

  const { initial, animate, variants, transition, key } = useBoxAnimations({
    boxAnimateType,
    boxAnimateDuration,
    boxAnimateDelay,
    itemAnimateDelay,
    itemAnimateType,
    itemAnimateDuration,
    itemStaggerDuration,
    boxElement,
    elements: children?.elements,
  })

  return (
    <BackgroundsContainer
      ref={setBoxElement}
      hasAnimations={hasAnimations}
      id={id}
      className={cx(
        width,
        margin,
        borderRadius,
        useStyle({ display: 'flex' }),
        useStyle(responsiveStyle([height], ([alignSelf = 'auto']) => ({ alignSelf }))),
      )}
      backgrounds={backgrounds}
      animate={animate?.container}
      initial={initial?.container}
      variants={variants?.container}
      transition={transition?.container}
      key={key?.container}
    >
      <Grid
        as={hasAnimations ? motion.div : 'div'}
        ref={innerRef}
        className={cx(padding)}
        border={borderData}
        boxShadow={boxShadowData}
        alignContent={verticalAlign}
        animate={animate?.parent}
        initial={initial?.parent}
        transition={transition?.parent}
      >
        {children && children.elements.length > 0 ? (
          children.elements.map((child, index) => (
            <GridItem
              as={hasAnimations ? motion.div : 'div'}
              key={child.key}
              className={gridItemClassName}
              grid={children.columns}
              index={index}
              columnGap={columnGap}
              rowGap={rowGap}
              // @ts-ignore: `variants` is not a prop for `div`, but it is for `motion.div`.
              variants={variants?.child}
              transition={transition?.child}
            >
              <Element element={child} />
            </GridItem>
          ))
        ) : (
          <Placeholder hide={hidePlaceholder} />
        )}
      </Grid>
    </BackgroundsContainer>
  )
})

export default Box
