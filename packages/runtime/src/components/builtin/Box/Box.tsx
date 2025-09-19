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
import { cx } from '@emotion/css'
import { v4 as uuid } from 'uuid'

import { Element } from '../../../runtimes/react/components/Element'
import Placeholder from './components/Placeholder'
import { areBoxAnimationPropsEqual, BoxAnimationProps, useBoxAnimation } from './animations'
import { BoxModelHandle, parse, createBox } from '../../../box-model'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { GridItem } from '../../shared/grid-item'
import { useStyle } from '../../../runtimes/react/use-style'
import {
  type GridData,
  type ResponsiveBackgroundsData,
  type ResponsiveGapData,
  type ResponsiveIconRadioGroupValue,
} from '@makeswift/prop-controllers'

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
  const [animationClassName, replayAnimation, setElement] = useBoxAnimation(
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

        return borderBox ? createBox({ borderBox, padding, border, margin }) : null
      },
    }),
    [],
  )

  const gridItemClassName = useStyle(
    useResponsiveStyle([verticalAlign], ([alignItems = 'flex-start']) => ({ alignItems })),
  )

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

  return (
    <BackgroundsContainer
      ref={boxElementCallbackRef}
      id={id}
      className={cx(
        width,
        margin,
        borderRadius,
        useStyle({ display: 'flex' }),
        useStyle(useResponsiveStyle([height], ([alignSelf = 'auto']) => ({ alignSelf }))),
        animationClassName,
      )}
      backgrounds={backgrounds}
    >
      <div
        ref={innerRef}
        key={key}
        className={cx(
          padding,
          boxShadow,
          border,
          useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' }),
          useStyle(
            useResponsiveStyle([verticalAlign], ([alignContent = 'flex-start']) => ({
              alignContent,
            })),
          ),
        )}
      >
        {children && children.elements.length > 0 ? (
          children.elements.map((child, index) => (
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
          ))
        ) : (
          <Placeholder hide={hidePlaceholder} />
        )}
      </div>
    </BackgroundsContainer>
  )
})

export default Box
