'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  Ref,
  ComponentPropsWithoutRef,
} from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useGesture } from '@use-gesture/react'

import { getBaseBreakpoint } from '@makeswift/controls'

import { colorToString } from '../../utils/colorToString'
import { type ResponsiveColor } from '../../utils/types'
import { useMediaQuery } from '../../hooks'

import Image from '../Image'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { useBreakpoints } from '../../../runtimes/react/hooks/use-breakpoints'
import {
  type ResponsiveGapData,
  type ResponsiveNumberValue,
  type ResponsiveIconRadioGroupValue,
  type ImagesData,
} from '@makeswift/prop-controllers'
import { composeStyles, useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'

// Utility to wrap a value within a range. Pulled from:
// https://github.com/Popmotion/popmotion/blob/adf681efd8568ada018ce68082dbd585f25c4c7d/packages/popmotion/src/utils/wrap.ts
function wrap(min: number, max: number, v: number): number {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const LeftChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14">
    <path
      d="M7,13,1,7,7,1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

const RightChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14">
    <path
      d="M3,1,9,7,3,13"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

type Props = {
  id?: string
  images?: ImagesData
  width?: string
  margin?: string
  pageSize?: ResponsiveNumberValue
  step?: ResponsiveNumberValue
  slideAlignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gap?: ResponsiveGapData
  autoplay?: boolean
  delay?: number
  showArrows?: boolean
  arrowPosition?: ResponsiveIconRadioGroupValue<'inside' | 'center' | 'outside'>
  arrowColor?: ResponsiveColor | null
  arrowBackground?: ResponsiveColor | null
  showDots?: boolean
  dotColor?: ResponsiveColor | null
  slideBorder?: string
  slideBorderRadius?: string
}

const SWIPE_THRESHOLD = 20
const swipePower = (dx: number, velocity: number) => dx * (1 + velocity)

// constructs a CSS [class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors),
// returns a compound class selector if the `classname` string includes multiple class names
const classSelector = (classname: string) => `.${classname.split(' ').join('.')}`

const Carousel = forwardRef(function Carousel(
  {
    images = [],
    width,
    margin,
    pageSize: responsivePageSize,
    step: responsiveStep,
    gap,
    slideAlignment,
    showDots,
    showArrows,
    arrowPosition,
    arrowColor,
    arrowBackground,
    dotColor,
    autoplay = false,
    delay = 5,
    slideBorder,
    slideBorderRadius,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const breakpoints = useBreakpoints()
  const [index, setIndex] = useState(0)
  const swipe = useRef(0)
  const startIndex = wrap(0, images.length, index)
  const pageSize = useMediaQuery(responsivePageSize) || 1
  const step = useMediaQuery(responsiveStep) || 1
  const endIndex = startIndex + pageSize
  const pageCount = Math.ceil((images.length - pageSize) / step + 1)
  const pageIndex = Math.ceil(startIndex / step)
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === pageCount - 1
  const paginate = useCallback(
    (pageDistance: number) => {
      if (pageDistance === 0) return

      const direction = pageDistance / Math.abs(pageDistance)
      const remaining = direction > 0 ? images.slice(endIndex) : images.slice(0, startIndex)
      const distance = direction * Math.min(remaining.length, step * Math.abs(pageDistance))

      setIndex(index + distance)
    },
    [images, index, startIndex, endIndex, step],
  )
  // @ts-expect-error: `useAnimation` types expect no arguments.
  const animation = useAnimation({ x: 0, transition: { type: 'spring', stiffness: 100 } })
  const bindPage = useGesture(
    {
      onDrag: ({ movement: [mx], delta: [dx], velocity: [vx] }) => {
        animation.start({ x: mx })
        swipe.current = swipePower(dx, vx)
      },
      onDragEnd: () => {
        animation.start({ x: 0 })

        if (swipe.current > SWIPE_THRESHOLD) paginate(1)
        else if (swipe.current < -SWIPE_THRESHOLD) paginate(-1)
      },
    },
    {
      drag: {
        axis: 'x',
        bounds: { left: 0, right: 0 },
        rubberband: true,
      },
    },
  )

  useEffect(() => {
    if (!autoplay || pageSize !== 0) setIndex(0)
  }, [autoplay, pageSize])

  useEffect(() => {
    if (!autoplay) return () => {}

    const intervalId = setInterval(() => (isLastPage ? setIndex(0) : paginate(1)), delay * 1000)

    return () => clearInterval(intervalId)
  }, [autoplay, delay, paginate, isLastPage])

  const clipMaskStyle = useStyle({ overflow: 'hidden' })
  const pageStyle = useStyle({ position: 'relative', width: '100%' })
  const slideStyles = composeStyles(
    useStyle({ display: 'flex' }),
    useStyle(
      useResponsiveStyle([responsivePageSize] as const, ([pageSize = 1]) => ({
        flexBasis: `${100 / pageSize}%`,
        maxWidth: `${100 / pageSize}%`,
        minWidth: `${100 / pageSize}%`,
      })),
    ),
    useStyle(
      useResponsiveStyle([slideAlignment] as const, ([alignItems = 'center']) => ({ alignItems })),
    ),
  )

  const reelStyles = composeStyles(
    useStyle({ display: 'flex', position: 'relative', flexWrap: 'nowrap' }),
    useStyle(
      useResponsiveStyle([gap] as const, ([gap = { value: 0, unit: 'px' }]) => ({
        margin: `0 ${`${-gap.value / 2}${gap.unit}`}`,
        [`& > ${classSelector(slideStyles.className)}`]: {
          padding: `0 ${`${gap.value / 2}${gap.unit}`}`,
        },
      })),
    ),
  )

  const { className: arrowClassName, styleElements: arrowStyleElements } = composeStyles(
    useStyle({
      padding: 10,
      borderRadius: '50%',
      outline: 0,
      border: 0,
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
    }),
    useStyle(
      useResponsiveStyle(
        [arrowBackground] as const,
        ([background = { swatch: { hue: 0, saturation: 0, lightness: 100 }, alpha: 1 }]) => ({
          background: colorToString(background),
        }),
      ),
    ),
    useStyle({ svg: { transition: 'transform 0.15s', stroke: 'currentcolor' } }),
  )

  const { className: sharedSlopClassName, styleElements: sharedSlopStyleElements } = composeStyles(
    useStyle({
      position: 'absolute',
      top: 0,
      bottom: 0,

      display: 'flex',
      '&[hidden]': {
        display: 'none',
      },

      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 2,
    }),
    useStyle(
      useResponsiveStyle(
        [arrowColor] as const,
        ([color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
          color: colorToString(color),
        }),
      ),
    ),
  )

  const { className: leftSlopClassName, styleElements: leftSlopStyleElements } = composeStyles(
    sharedSlopClassName,
    useStyle(
      useResponsiveStyle([arrowPosition] as const, ([position = 'inside']) => {
        switch (position) {
          case 'inside':
            return { transform: 'translateX(8px)' }

          case 'outside':
            return { transform: 'translateX(calc(-100% - 8px))' }

          default:
            return { transform: 'translateX(calc(-50%))' }
        }
      }),
    ),
    useStyle({
      left: 0,

      [`&:hover > ${classSelector(arrowClassName)}`]: {
        '& > svg': {
          transform: 'translateX(-2px)',
        },
      },
    }),
  )

  const { className: rightSlopClassName, styleElements: rightSlopStyleElements } = composeStyles(
    sharedSlopClassName,
    useStyle(
      useResponsiveStyle([arrowPosition] as const, ([position = 'inside']) => {
        switch (position) {
          case 'inside':
            return { transform: 'translateX(-8px)' }

          case 'outside':
            return { transform: 'translateX(calc(100% + 8px))' }

          default:
            return { transform: 'translateX(calc(50%))' }
        }
      }),
    ),
    useStyle({
      right: 0,
      [`&:hover > ${classSelector(arrowClassName)}`]: {
        '& > svg': {
          transform: 'translateX(2px)',
        },
      },
    }),
  )

  const { className: dotsClassName, styleElements: dotsStyleElements } = composeStyles(
    useStyle({ display: showDots ? 'flex' : 'none', justifyContent: 'center', marginTop: 20 }),
    useStyle(
      useResponsiveStyle(
        [dotColor] as const,
        ([color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
          color: colorToString(color),
        }),
      ),
    ),
  )

  const { className: containerClassName, styleElements: containerStyleElements } = composeStyles(
    useStyle({ position: 'relative', display: 'flex', flexDirection: 'column' }),
    width,
    margin,
    useStyle({ '&:focus': { outline: 0 } })
  )
  const { className: relativePositionDivClassName, styleElement: relativePositionDivStyleElement } = useStyle({
    position: 'relative',
    height: '100%'
  })

  return (
    <>
      {containerStyleElements}
      <div
        ref={ref}
        className={containerClassName}
        tabIndex={-1}
        onKeyDown={e => {
          switch (e.key) {
            case 'ArrowRight':
              paginate(1)
              break
            case 'ArrowLeft':
              paginate(-1)
              break
            default:
          }
        }}
      >
        {relativePositionDivStyleElement}
        {/* NOTE: We set height to 100% here to fix an issue on IE11 where the child height of a flex column extends too far */}
        <div className={relativePositionDivClassName}>
          {sharedSlopStyleElements}
          {clipMaskStyle.styleElement}
          <div className={clipMaskStyle.className}>
            {pageStyle.styleElement}
            {/* https://github.com/framer/motion/issues/1723 */}
            {/* @ts-expect-error: React HTMLElement typings conflict with motion components */}
            <motion.div {...bindPage()} className={pageStyle.className} animate={animation}>
              {reelStyles.styleElements}
              <motion.div
                // @ts-expect-error: Type error when upgrading to @types/react@19.2.7 and @types/react-dom@19.2.3
                // Upgrade framer-motion package to fix type error
                className={reelStyles.className}
                animate={{ x: `${-(100 / pageSize) * startIndex}%` }}
                transition={{
                  x: {
                    type: 'tween',
                    ease: [0.165, 0.84, 0.44, 1],
                    duration: 0.5,
                  },
                }}
              >
                {slideStyles.styleElements}
                {images.map(({ props: imageProps, key }) => (
                  <motion.div
                    key={key}
                    // @ts-expect-error: Type error when upgrading to @types/react@19.2.7 and @types/react-dom@19.2.3
                    // Upgrade framer-motion package to fix type error
                    className={slideStyles.className}
                    onMouseDown={(e: MouseEvent) => e.preventDefault()}
                    onClick={(e: MouseEvent) => {
                      if (swipe.current !== 0) e.preventDefault()
                    }}
                  >
                    <Image
                      width={[
                        {
                          deviceId: getBaseBreakpoint(breakpoints).id,
                          value: { value: 100, unit: '%' },
                        },
                      ]}
                      file={imageProps.file}
                      altText={imageProps.altText}
                      link={imageProps.link}
                      border={slideBorder}
                      borderRadius={slideBorderRadius}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          {leftSlopStyleElements}
          <div
            onClick={() => paginate(-1)}
            className={leftSlopClassName}
            hidden={!showArrows || isFirstPage}
          >
            {arrowStyleElements}
            <div className={arrowClassName}>
              <LeftChevron />
            </div>
          </div>
          {rightSlopStyleElements}
          <div
            onClick={() => paginate(1)}
            className={rightSlopClassName}
            hidden={!showArrows || isLastPage}
          >
            {arrowStyleElements}
            <div className={arrowClassName}>
              <RightChevron />
            </div>
          </div>
        </div>
        {dotsStyleElements}
        <div className={dotsClassName}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <Dot key={i} active={i === pageIndex} onClick={() => paginate(i - pageIndex)} />
          ))}
        </div>
      </div>
    </>
  )
})

export default Carousel

type DotBaseProps = {
  className?: string
  active: boolean
}

type DotProps = DotBaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof DotBaseProps>

function Dot({ className, active, ...restOfProps }: DotProps) {
  const styles = composeStyles(
    useStyle({
      position: 'relative',
      margin: '0 6px',
      borderRadius: '50%',
      cursor: 'pointer',
      width: 16,
      height: 16,

      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        display: 'block',
        borderRadius: '50%',
        transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      '&::before': {
        boxShadow: '0 0 0 2px currentColor',
        transform: 'translate3d(-50%, -50%, 0)',
        width: active ? 16 : 10,
        height: active ? 16 : 10,
      },

      '&::after': {
        background: 'currentColor',
        transform: `translate3d(-50%, -50%, 0) scale(${active ? 1 : 0})`,
        width: 10,
        height: 10,
      },

      '&:hover::after': {
        transform: `translate3d(-50%, -50%, 0) scale(${active ? 1 : 0})`,
      },
    }),
    className
  )
  return (
    <>
      {styles.styleElements}
      <div
        {...restOfProps}
        className={styles.className}
      />
    </>
  )
}
