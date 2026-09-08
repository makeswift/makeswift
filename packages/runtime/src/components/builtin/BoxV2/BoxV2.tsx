'use client'

import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cx } from '@emotion/css'
import { v4 as uuid } from 'uuid'

import { Element } from '../../../runtimes/react'
import Placeholder from '../Box/components/Placeholder'
import {
  areBoxAnimationPropsEqual,
  BoxAnimationProps,
  useBoxAnimation,
  useItemAnimation,
} from '../Box/animations'
import {
  parse,
  createBox,
  isElementVisible,
  type BoxModelHandle,
} from '../../../state/modules/read-write/box-models'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import {
  defaultMarginCustomProperty,
  useResponsiveStyle,
} from '../../utils/responsive-style'
import { gridItemIdentifierClassName } from '../../shared/grid-item'
import { useStyle } from '../../../runtimes/react/use-style'
import {
  type GridData,
  type ResponsiveBackgroundsData,
  type ResponsiveGapData,
  type ResponsiveIconRadioGroupValue,
  type ResponsiveNumberValue,
  type ResponsiveSelectValue,
} from '@makeswift/prop-controllers'

type FlexDirection = 'row' | 'column'

type BoxAlignmentPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

// The '-between' suffix distributes items along the main axis (space-between).
type BoxAlignment = BoxAlignmentPosition | `${BoxAlignmentPosition}-between`

const alignmentKeywordToFlex = {
  top: 'flex-start',
  left: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
  right: 'flex-end',
} as const

type Props = {
  id?: string
  backgrounds?: ResponsiveBackgroundsData
  width?: string
  height?: ResponsiveIconRadioGroupValue<'auto' | 'stretch'>
  direction?: ResponsiveSelectValue<FlexDirection>
  alignItems?: ResponsiveSelectValue<BoxAlignment>
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

type FlexItemProps = {
  index: number
  itemAnimateDuration?: ResponsiveNumberValue
  itemAnimateDelay?: ResponsiveNumberValue
  itemStaggerDuration?: ResponsiveNumberValue
  children?: ReactNode
}

function FlexItem({
  index,
  itemAnimateDuration,
  itemAnimateDelay,
  itemStaggerDuration,
  children,
}: FlexItemProps) {
  // Animation styles target the child since display:contents elements don't render effects.
  const animationClassName = useItemAnimation(
    itemAnimateDuration,
    itemAnimateDelay,
    itemStaggerDuration,
    index,
    '& > *',
  )

  return (
    <div
      className={cx(
        useStyle({ display: 'contents' }),
        animationClassName,
        gridItemIdentifierClassName,
      )}
    >
      {children}
    </div>
  )
}

const BoxV2 = forwardRef(function BoxV2(
  {
    id,
    backgrounds,
    width,
    height,
    direction,
    alignItems,
    margin,
    padding,
    border,
    children,
    borderRadius,
    boxShadow,
    rowGap,
    columnGap,
    hidePlaceholder,
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
    `& > div > .${gridItemIdentifierClassName} > *`,
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
          useStyle({
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            [defaultMarginCustomProperty]: '0px',
          }),
          useStyle(
            useResponsiveStyle([direction, alignItems], values => {
              const [flexDirection = 'row', alignment = 'top-left'] = values as [
                FlexDirection | undefined,
                BoxAlignment | undefined,
              ]
              const isBetween = alignment.endsWith('-between')
              const position = (
                isBetween ? alignment.slice(0, -'-between'.length) : alignment
              ) as BoxAlignmentPosition
              const [vertical, horizontal] = position.split('-') as [
                'top' | 'center' | 'bottom',
                'left' | 'center' | 'right',
              ]
              const horizontalFlex = alignmentKeywordToFlex[horizontal]
              const verticalFlex = alignmentKeywordToFlex[vertical]
              const isRow = flexDirection === 'row'
              const crossAxis = isRow ? verticalFlex : horizontalFlex

              return {
                flexDirection,
                justifyContent: isBetween
                  ? 'space-between'
                  : isRow
                    ? horizontalFlex
                    : verticalFlex,
                alignItems: crossAxis,
                alignContent: crossAxis,
              }
            }),
          ),
          useStyle(
            useResponsiveStyle(
              [rowGap, columnGap],
              ([rowGap = { value: 0, unit: 'px' }, columnGap = { value: 0, unit: 'px' }]) => ({
                rowGap: `${rowGap.value}${rowGap.unit}`,
                columnGap: `${columnGap.value}${columnGap.unit}`,
              }),
            ),
          ),
        )}
      >
        {children && children.elements.length > 0 ? (
          children.elements.map((child, index) => (
            <FlexItem
              key={child.key}
              index={index}
              itemAnimateDuration={itemAnimateDuration}
              itemAnimateDelay={itemAnimateDelay}
              itemStaggerDuration={itemStaggerDuration}
            >
              <Element element={child} />
            </FlexItem>
          ))
        ) : (
          <Placeholder hide={hidePlaceholder} />
        )}
      </div>
    </BackgroundsContainer>
  )
})

export default BoxV2
