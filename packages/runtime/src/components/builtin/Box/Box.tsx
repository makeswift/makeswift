import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Element, ReactRuntime } from '../../../react'
import Placeholder from './components/Placeholder'
import {
  BoxAnimateIn,
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_ITEM_ANIMATE_DELAY,
  DEFAULT_ITEM_STAGGER_DURATION,
  useBoxAnimations,
} from './animations'
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
  ResponsiveValue,
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
import {
  BorderPropControllerData,
  BoxShadowPropControllerData,
  useBorder,
  useBoxShadow,
} from '../../hooks'
import { Props } from '../../../prop-controllers'
import { findDeviceOverride } from '../../utils/devices'

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

export default Box

export function registerComponent(runtime: ReactRuntime) {
  function isHiddenBasedOnAnimationType(
    props: Record<string, unknown>,
    deviceId: string,
    property: 'boxAnimateType' | 'itemAnimateType',
  ): boolean {
    const animateIn = props[property] as ResponsiveValue<BoxAnimateIn>
    return (findDeviceOverride<BoxAnimateIn>(animateIn, deviceId)?.value ?? 'none') === 'none'
  }
  const isHiddenBasedOnBoxAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'boxAnimateType')
  const isHiddenBasedOnItemAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'itemAnimateType')

  return runtime.registerComponent(Box, {
    type: './components/Box/index.js',
    label: 'Box',
    props: {
      id: Props.ElementID(),
      backgrounds: Props.Backgrounds(),
      width: Props.Width(),
      height: Props.ResponsiveIconRadioGroup({
        label: 'Height',
        options: [
          { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
          { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
        ],
        defaultValue: 'auto',
      }),
      verticalAlign: Props.ResponsiveIconRadioGroup({
        label: 'Align items',
        options: [
          { value: 'flex-start', label: 'Top', icon: 'VerticalAlignStart16' },
          { value: 'center', label: 'Middle', icon: 'VerticalAlignMiddle16' },
          { value: 'flex-end', label: 'Bottom', icon: 'VerticalAlignEnd16' },
          {
            value: 'space-between',
            label: 'Space between',
            icon: 'VerticalAlignSpaceBetween16',
          },
        ],
        defaultValue: 'flex-start',
      }),
      margin: Props.Margin(),
      padding: Props.Padding({
        preset: [
          {
            deviceId: 'desktop',
            value: {
              paddingTop: { value: 10, unit: 'px' },
              paddingRight: { value: 10, unit: 'px' },
              paddingBottom: { value: 10, unit: 'px' },
              paddingLeft: { value: 10, unit: 'px' },
            },
          },
        ],
      }),
      border: Props.Border(),
      borderRadius: Props.BorderRadius(),
      boxShadow: Props.Shadows(),
      rowGap: Props.GapY(props => ({
        hidden: props.children == null,
      })),
      columnGap: Props.GapX(props => ({
        hidden: props.children == null,
      })),
      boxAnimateType: Props.ResponsiveSelect({
        label: 'Animate box in',
        labelOrientation: 'vertical',
        options: [
          { value: 'none', label: 'None' },
          { value: 'fadeIn', label: 'Fade in' },
          { value: 'fadeRight', label: 'Fade right' },
          { value: 'fadeDown', label: 'Fade down' },
          { value: 'fadeLeft', label: 'Fade left' },
          { value: 'fadeUp', label: 'Fade up' },
          { value: 'blurIn', label: 'Blur in' },
          { value: 'scaleUp', label: 'Scale up' },
          { value: 'scaleDown', label: 'Scale down' },
        ],
        defaultValue: 'none',
      }),
      boxAnimateDuration: Props.ResponsiveNumber((props, device) => ({
        label: 'Box duration',
        defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
        min: 0.1,
        step: 0.05,
        suffix: 's',
        hidden: isHiddenBasedOnBoxAnimation(props, device),
      })),
      boxAnimateDelay: Props.ResponsiveNumber((props, device) => ({
        label: 'Box delay',
        defaultValue: DEFAULT_BOX_ANIMATE_DELAY,
        min: 0,
        step: 0.05,
        suffix: 's',
        hidden: isHiddenBasedOnBoxAnimation(props, device),
      })),
      itemAnimateType: Props.ResponsiveSelect({
        label: 'Animate items in',
        labelOrientation: 'vertical',
        options: [
          { value: 'none', label: 'None' },
          { value: 'fadeIn', label: 'Fade in' },
          { value: 'fadeRight', label: 'Fade right' },
          { value: 'fadeDown', label: 'Fade down' },
          { value: 'fadeLeft', label: 'Fade left' },
          { value: 'fadeUp', label: 'Fade up' },
          { value: 'blurIn', label: 'Blur in' },
          { value: 'scaleUp', label: 'Scale up' },
          { value: 'scaleDown', label: 'Scale down' },
        ],
        defaultValue: 'none',
      }),
      itemAnimateDuration: Props.ResponsiveNumber((props, device) => ({
        label: 'Items duration',
        defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
        min: 0.1,
        step: 0.05,
        suffix: 's',
        hidden: isHiddenBasedOnItemAnimation(props, device),
      })),
      itemAnimateDelay: Props.ResponsiveNumber((props, device) => ({
        label: 'Items delay',
        defaultValue: DEFAULT_ITEM_ANIMATE_DELAY,
        min: 0,
        step: 0.05,
        suffix: 's',
        hidden: isHiddenBasedOnItemAnimation(props, device),
      })),
      itemStaggerDuration: Props.ResponsiveNumber((props, device) => ({
        label: 'Stagger',
        min: 0,
        step: 0.05,
        suffix: 's',
        defaultValue: DEFAULT_ITEM_STAGGER_DURATION,
        hidden: isHiddenBasedOnItemAnimation(props, device),
      })),
      hidePlaceholder: Props.Checkbox(props => ({
        label: 'Hide placeholder',
        hidden: props.children != null,
      })),
      children: Props.Grid(),
    },
  })
}
