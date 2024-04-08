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
import { wrap } from '@popmotion/popcorn'

import { colorToString } from '../../utils/colorToString'
import { useMediaQuery } from '../../hooks'

import Image from '../Image'
import {
  ElementIDValue,
  ImagesValue,
  ResponsiveNumberValue,
  ResponsiveIconRadioGroupValue,
  GapXValue,
  CheckboxValue,
} from '../../../prop-controllers/descriptors'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { useStyle } from '../../../runtimes/react/use-style'
import { cx } from '@emotion/css'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { useBreakpoints } from '../../../runtimes/react'

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
  id?: ElementIDValue
  images?: ImagesValue
  width?: string
  margin?: string
  pageSize?: ResponsiveNumberValue
  step?: ResponsiveNumberValue
  slideAlignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gap?: GapXValue
  autoplay?: CheckboxValue
  delay?: number
  showArrows?: CheckboxValue
  arrowPosition?: ResponsiveIconRadioGroupValue<'inside' | 'center' | 'outside'>
  arrowColor?: ResponsiveColor | null
  arrowBackground?: ResponsiveColor | null
  showDots?: CheckboxValue
  dotColor?: ResponsiveColor | null
  slideBorder?: string
  slideBorderRadius?: string
}

const SWIPE_THRESHOLD = 20
const swipePower = (dx: number, velocity: number) => dx * (1 + velocity)

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

  const clipMaskClassName = useStyle({ overflow: 'hidden' })
  const pageClassName = useStyle({ position: 'relative', width: '100%' })
  const slideClassName = cx(
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
  const reelClassName = cx(
    useStyle({ display: 'flex', position: 'relative', flexWrap: 'nowrap' }),
    useStyle(
      useResponsiveStyle([gap] as const, ([gap = { value: 0, unit: 'px' }]) => ({
        margin: `0 ${`${-gap.value / 2}${gap.unit}`}`,
        [`& > .${slideClassName}`]: {
          padding: `0 ${`${gap.value / 2}${gap.unit}`}`,
        },
      })),
    ),
  )
  const arrowClassName = cx(
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
  const slopClassName = cx(
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
  const leftSlopClassName = cx(
    slopClassName,
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

      [`&:hover > .${arrowClassName}`]: {
        '& > svg': {
          transform: 'translateX(-2px)',
        },
      },
    }),
  )
  const rightSlopClassName = cx(
    slopClassName,
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

      [`&:hover > .${arrowClassName}`]: {
        '& > svg': {
          transform: 'translateX(2px)',
        },
      },
    }),
  )
  const dotsClassName = cx(
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

  return (
    <div
      ref={ref}
      className={cx(
        useStyle({ position: 'relative', display: 'flex', flexDirection: 'column' }),
        width,
        margin,
        useStyle({ '&:focus': { outline: 0 } }),
      )}
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
      {/* NOTE: We set height to 100% here to fix an issue on IE11 where the child height of a flex column extends too far */}
      <div className={useStyle({ position: 'relative', height: '100%' })}>
        <div className={clipMaskClassName}>
          {/* https://github.com/framer/motion/issues/1723 */}
          {/* @ts-expect-error: React HTMLElement typings conflict with motion components */}
          <motion.div {...bindPage()} className={pageClassName} animate={animation}>
            <motion.div
              className={reelClassName}
              animate={{ x: `${-(100 / pageSize) * startIndex}%` }}
              transition={{
                x: {
                  type: 'tween',
                  ease: [0.165, 0.84, 0.44, 1],
                  duration: 0.5,
                },
              }}
            >
              {images.map(({ props: imageProps, key }) => (
                <motion.div
                  id={key}
                  key={key}
                  className={slideClassName}
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
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
        <div
          onClick={() => paginate(-1)}
          className={leftSlopClassName}
          hidden={!showArrows || isFirstPage}
        >
          <div className={arrowClassName}>
            <LeftChevron />
          </div>
        </div>
        <div
          onClick={() => paginate(1)}
          className={rightSlopClassName}
          hidden={!showArrows || isLastPage}
        >
          <div className={arrowClassName}>
            <RightChevron />
          </div>
        </div>
      </div>
      <div className={dotsClassName}>
        {Array.from({ length: pageCount }).map((_, i) => (
          <Dot key={i} active={i === pageIndex} onClick={() => paginate(i - pageIndex)} />
        ))}
      </div>
    </div>
  )
})

export default Carousel

type DotBaseProps = {
  className?: string
  active: boolean
}

type DotProps = DotBaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof DotBaseProps>

function Dot({ className, active, ...restOfProps }: DotProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
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
        className,
      )}
    />
  )
}
