'use client'

import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { v4 as uuid } from 'uuid'

import { Element } from '../../../runtimes/react'
import Placeholder from './components/Placeholder'
import { areBoxAnimationPropsEqual, BoxAnimationProps, useBoxAnimation } from './animations'
import {
  parse,
  createBox,
  isElementVisible,
  type BoxModelHandle,
} from '../../../state/modules/read-write/box-models'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { GridItem } from '../../shared/grid-item'
import {
  type GridData,
  type ResponsiveBackgroundsData,
  type ResponsiveGapData,
  type ResponsiveIconRadioGroupValue,
} from '@makeswift/prop-controllers'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type Props = {
  id?: string
  backgrounds?: ResponsiveBackgroundsData
  width?: string
  height?: ResponsiveIconRadioGroupValue<'auto' | 'stretch'>
  verticalAlign?: ResponsiveIconRadioGroupValue<
    'flex-start' | 'center' | 'flex-end' | 'space-between'
  >
  margin?: string
  padding?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  rowGap?: ResponsiveGapData
  columnGap?: ResponsiveGapData
  hidePlaceholder?: boolean
  children?: GridData
} & BoxAnimationProps

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
  const boxElementObjectRef = useRef<HTMLElement | null>(null)
  const [animationClassName, animationStyle, replayAnimation, setElement] = useBoxAnimation(
    boxAnimateType,
    boxAnimateDuration,
    boxAnimateDelay,
    itemAnimateType,
  )
  const boxElementCallbackRef = useCallback((current: HTMLElement | null) => {
    boxElementObjectRef.current = current

    setElement(current)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      getDomNode() {
        return boxElementObjectRef.current
      },
      getBoxModel() {
        const paddingBoxElement = innerRef.current
        const borderBoxElement = innerRef.current
        const marginBoxElement = boxElementObjectRef.current
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

        const visible = marginBoxElement ? isElementVisible(marginBoxElement) : undefined

        return borderBox ? createBox({ borderBox, padding, border, margin, visible }) : null
      },
    }),
    [],
  )

  const gridItemCss = useResponsiveStyle([verticalAlign], ([alignItems = 'flex-start']) => ({ alignItems }))
  const { className: gridItemClassName, styleElement: gridItemStyleElement } = useStyle(gridItemCss)

  const [key, setKey] = useState(() => uuid())

  const animationProps = {
    boxAnimateType,
    boxAnimateDuration,
    boxAnimateDelay,
    itemAnimateType,
    itemAnimateDuration,
    itemAnimateDelay,
    itemStaggerDuration,
  }

  const prevAnimationProps = useRef(animationProps)
  useEffect(() => {
    if (!areBoxAnimationPropsEqual(prevAnimationProps.current, animationProps)) {
      replayAnimation()
      setKey(uuid())
      prevAnimationProps.current = animationProps
    }
  }, [replayAnimation, animationProps])

  const { className: containerFlexClassName, styleElement: containerFlexStyle } = useStyle({ display: 'flex' })
  const { className: containerResponsiveStyleClassName, styleElement: containerResponsiveStyle } = useStyle(
    useResponsiveStyle([height], ([alignSelf = 'auto']) => ({ alignSelf }))
)
  const containerClassName = clsx(
    width,
    margin,
    borderRadius,
    containerFlexClassName,
    containerResponsiveStyleClassName,
    animationClassName,
  )

  const { className: innerFlexClassName, styleElement: innerFlexStyle } = useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' })
  const { className: innerResponsiveStylesClassName, styleElement: innerResponsiveStyle } = useStyle(
    useResponsiveStyle([verticalAlign], ([alignContent = 'flex-start']) => ({
      alignContent,
    }))
  )
  const innerClassName = clsx(
    padding,
    boxShadow,
    border,
    innerFlexClassName,
    innerResponsiveStylesClassName
  )

  return (
    <>
      {containerFlexStyle}
      {containerResponsiveStyle}
      {animationStyle}
      <BackgroundsContainer
        ref={boxElementCallbackRef}
        id={id}
        className={containerClassName}
        backgrounds={backgrounds}
      >
        <>
          {innerFlexStyle}
          {innerResponsiveStyle}
          <div
            ref={innerRef}
            key={key}
            className={innerClassName}
          >
            {children && children.elements.length > 0 ? (
              <>
                {gridItemStyleElement}
                {children.elements.map((child, index) => (
                  <GridItem
                    key={child.key}
                    className={gridItemClassName}
                    grid={children.columns}
                    index={index}
                    itemAnimateDuration={itemAnimateDuration}
                    itemAnimateDelay={itemAnimateDelay}
                    itemStaggerDuration={itemStaggerDuration}
                    columnGap={columnGap}
                    rowGap={rowGap}
                  >
                    <Element element={child} />
                  </GridItem>
                ))}
              </>
            ) : (
              <Placeholder hide={hidePlaceholder} />
            )}
          </div>
        </>
      </BackgroundsContainer>
    </>
  )
})

export default Box
