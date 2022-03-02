import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Element } from '../../react'
import Placeholder from './components/Placeholder'
import { BoxAnimateIn, useBoxAnimations } from './animations'
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
} from '../../prop-controllers/descriptors'
import {
  cssWidth,
  cssMargin,
  cssPadding,
  cssBorderRadius,
  cssGridItem,
  cssMediaRules,
  cssBorder,
  cssBoxShadow,
} from '../utils/cssMediaRules'
import { BoxModelHandle, parse, createBox } from '../../box-model'
import BackgroundsContainer from '../BackgroundsContainer'
import {
  BorderPropControllerData,
  BoxShadowPropControllerData,
  useBorder,
  useBoxShadow,
} from '../hooks'

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

const StyledBackgroundsContainer = styled(BackgroundsContainer)<{
  width: Props['width']
  margin: Props['margin']
  borderRadius: Props['borderRadius']
  alignSelf: Props['height']
}>`
  display: flex;
  ${cssWidth()}
  ${cssMargin()}
  ${cssBorderRadius()}
  ${props => cssMediaRules([props.alignSelf] as const, ([alignSelf = 'auto']) => ({ alignSelf }))}
`

const Grid = styled(motion.div)<{
  padding: Props['padding']
  border: BorderPropControllerData | null | undefined
  boxShadow: BoxShadowPropControllerData | null | undefined
  alignContent: Props['verticalAlign']
}>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  ${cssPadding()}
  ${cssBorder()}
  ${cssBoxShadow()}
  ${props =>
    cssMediaRules([props.alignContent] as const, ([alignContent = 'flex-start']) => ({
      alignContent,
    }))}
`
const GridItem = styled(motion.div)<{
  grid: NonNullable<Props['children']>['columns']
  alignItems: Props['verticalAlign']
  index: number
  columnGap: Props['columnGap']
  rowGap: Props['rowGap']
}>`
  display: flex;

  /* IE11 doesn't recognize space-between and treats it as stretch, so we fall back to flex-start */
  align-items: flex-start;
  ${cssGridItem()}
  ${props =>
    cssMediaRules([props.alignItems] as const, ([alignItems = 'flex-start']) => ({ alignItems }))}
`

export default forwardRef(function Box(
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

  useImperativeHandle(
    ref,
    () => ({
      getBoxModel() {
        const paddingBoxElement = innerRef.current
        const borderBoxElement = innerRef.current
        const marginBoxElement = boxElement
        const borderBox = innerRef.current?.getBoundingClientRect()
        const paddingBoxComputedStyle = paddingBoxElement?.ownerDocument.defaultView?.getComputedStyle(
          paddingBoxElement,
        )
        const borderBoxComputedStyle = borderBoxElement?.ownerDocument.defaultView?.getComputedStyle(
          borderBoxElement,
        )
        const marginBoxComputedStyle = marginBoxElement?.ownerDocument.defaultView?.getComputedStyle(
          marginBoxElement,
        )
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
    <StyledBackgroundsContainer
      ref={setBoxElement}
      id={id}
      backgrounds={backgrounds}
      width={width}
      margin={margin}
      borderRadius={borderRadius}
      alignSelf={height}
      animate={animate?.container}
      initial={initial?.container}
      variants={variants?.container}
      transition={transition?.container}
      key={key?.container}
    >
      <Grid
        ref={innerRef}
        padding={padding}
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
              key={child.key}
              grid={children.columns}
              index={index}
              columnGap={columnGap}
              rowGap={rowGap}
              alignItems={verticalAlign}
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
    </StyledBackgroundsContainer>
  )
})
