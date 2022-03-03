import { useState, useRef, useEffect, useCallback, forwardRef, Ref } from 'react'
import styled, { css } from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import { useGesture } from 'react-use-gesture'
import { wrap } from '@popmotion/popcorn'

import { cssMediaRules, cssWidth, cssMargin } from '../../utils/cssMediaRules'
import { colorToString } from '../../utils/colorToString'
import { ColorValue as Color } from '../../utils/types'
import { useColor, useMediaQuery } from '../../hooks'

import Image from '../Image'
import {
  ResponsiveValue,
  ElementIDValue,
  ImagesValue,
  MarginValue,
  ResponsiveNumberValue,
  WidthValue,
  ResponsiveIconRadioGroupValue,
  GapXValue,
  CheckboxValue,
  NumberValue,
  ResponsiveColorValue,
  BorderValue,
  BorderRadiusValue,
} from '../../../prop-controllers/descriptors'

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

// NOTE: We set height to 100% here to fix an issue on IE11 where the child height of a flex column extends too far
const Container = styled.div`
  position: relative;
  height: 100%;
`

type Props = {
  id?: ElementIDValue
  images?: ImagesValue
  width?: WidthValue
  margin?: MarginValue
  pageSize?: ResponsiveNumberValue
  step?: ResponsiveNumberValue
  slideAlignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gap?: GapXValue
  autoplay?: CheckboxValue
  delay?: NumberValue
  showArrows?: CheckboxValue
  arrowPosition?: ResponsiveIconRadioGroupValue<'inside' | 'center' | 'outside'>
  arrowColor?: ResponsiveColorValue
  arrowBackground?: ResponsiveColorValue
  showDots?: CheckboxValue
  dotColor?: ResponsiveColorValue
  slideBorder?: BorderValue
  slideBorderRadius?: BorderRadiusValue
}

const Wrapper = styled.div<{ width: Props['width']; margin: Props['margin'] }>`
  position: relative;
  display: flex;
  flex-direction: column;
  ${cssWidth('400px')}
  ${cssMargin()}

  &:focus {
    outline: 0;
  }
`

const Arrow = styled.div<{ background?: ResponsiveValue<Color> | null }>`
  padding: 10px;
  border-radius: 50%;
  outline: 0;
  border: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  ${p =>
    cssMediaRules(
      [p.background] as const,
      ([background = { swatch: { hue: 0, saturation: 0, lightness: 100 }, alpha: 1 }]) => css`
        background: ${colorToString(background)};
      `,
    )}

  svg {
    transition: transform 0.15s;
    stroke: currentColor;
  }
`

const Slop = styled.div<{
  color?: ResponsiveValue<Color> | null
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  display: ${props => (props.hidden ? 'none' : 'flex')};
  align-items: center;
  cursor: pointer;
  z-index: 2;
  ${p =>
    cssMediaRules(
      [p.color] as const,
      ([color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
        color: ${colorToString(color)};
      `,
    )}
`

const Slide = styled(motion.div)<{
  pageSize: Props['pageSize']
  alignItems: Props['slideAlignment']
}>`
  display: flex;
  ${p =>
    cssMediaRules(
      [p.pageSize],
      ([pageSize = 1]) => css`
        flex-basis: ${100 / pageSize}%;
        max-width: ${100 / pageSize}%;
        min-width: ${100 / pageSize}%;
      `,
    )}

  ${p => cssMediaRules([p.alignItems], ([alignItems = 'center']) => ({ alignItems }))}
`

const Reel = styled(motion.div)<{ gap: Props['gap'] }>`
  display: flex;
  position: relative;
  flex-wrap: nowrap;
  ${p =>
    cssMediaRules(
      [p.gap] as const,
      ([gap = { value: 0, unit: 'px' }]) => css`
        margin: 0 ${`${-gap.value / 2}${gap.unit}`};

        & > ${Slide} {
          padding: 0 ${`${gap.value / 2}${gap.unit}`};
        }
      `,
    )}
`

const Page = styled(motion.div)`
  position: relative;
  width: 100%;
`

const LeftSlop = styled(Slop)<{ position: Props['arrowPosition'] }>`
  ${p =>
    cssMediaRules([p.position] as const, ([position = 'inside']) => {
      switch (position) {
        case 'inside':
          return css`
            transform: translateX(8px);
          `
        case 'outside':
          return css`
            transform: translateX(calc(-100% - 8px));
          `
        default:
          return css`
            transform: translateX(calc(-50%));
          `
      }
    })}
  left: 0;

  &:hover > ${Arrow} {
    & > svg {
      transform: translateX(-2px);
    }
  }
`

const RightSlop = styled(Slop)<{ position: Props['arrowPosition'] }>`
  ${p =>
    cssMediaRules([p.position] as const, ([position = 'inside']) => {
      switch (position) {
        case 'inside':
          return css`
            transform: translateX(-8px);
          `
        case 'outside':
          return css`
            transform: translateX(calc(100% + 8px));
          `
        default:
          return css`
            transform: translateX(calc(50%));
          `
      }
    })}
  right: 0;

  &:hover > ${Arrow} {
    & > svg {
      transform: translateX(2px);
    }
  }
`

const ClipMask = styled.div`
  overflow: hidden;
`

const Dots = styled.div<{ color?: ResponsiveValue<Color> | null }>`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  justify-content: center;
  margin-top: 20px;
  ${p =>
    cssMediaRules(
      [p.color] as const,
      ([color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
        color: ${colorToString(color)};
      `,
    )}
`

const Dot = styled.div<{ active: boolean }>`
  position: relative;
  margin: 0 6px;
  border-radius: 50%;
  cursor: pointer;
  width: 16px;
  height: 16px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    border-radius: 50%;
    transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &::before {
    box-shadow: 0 0 0 2px currentColor;
    transform: translate3d(-50%, -50%, 0);
    width: ${props => (props.active ? 16 : 10)}px;
    height: ${props => (props.active ? 16 : 10)}px;
  }

  &::after {
    background: currentColor;
    transform: translate3d(-50%, -50%, 0) scale(${props => (props.active ? 1 : 0)});
    width: 10px;
    height: 10px;
  }

  &:hover::after {
    transform: translate3d(-50%, -50%, 0) scale(${props => (props.active ? 1 : 0.5)});
  }
`

const SWIPE_THRESHOLD = 20
const swipePower = (dx: number, velocity: number) => dx * (1 + velocity)

export default forwardRef(function Carousel(
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
    pageDistance => {
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
      onDrag: ({ movement: [mx], delta: [dx], velocity }) => {
        animation.start({ x: mx })
        swipe.current = swipePower(dx, velocity)
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

  return (
    <Wrapper
      ref={ref}
      width={width}
      margin={margin}
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
      <Container>
        <ClipMask>
          <Page {...bindPage()} animate={animation}>
            <Reel
              gap={gap}
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
                <Slide
                  id={key}
                  key={key}
                  pageSize={responsivePageSize}
                  alignItems={slideAlignment}
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    if (swipe.current !== 0) e.preventDefault()
                  }}
                >
                  <Image
                    width={[{ deviceId: 'desktop', value: { value: 100, unit: '%' } }]}
                    file={imageProps.file}
                    altText={imageProps.altText}
                    link={imageProps.link}
                    border={slideBorder}
                    borderRadius={slideBorderRadius}
                  />
                </Slide>
              ))}
            </Reel>
          </Page>
        </ClipMask>
        <LeftSlop
          onClick={() => paginate(-1)}
          position={arrowPosition}
          // @ts-expect-error: HTMLDivElement `color` attribute conflicts with prop
          color={useColor(arrowColor)}
          hidden={!showArrows || isFirstPage}
        >
          <Arrow background={useColor(arrowBackground)}>
            <LeftChevron />
          </Arrow>
        </LeftSlop>
        <RightSlop
          onClick={() => paginate(1)}
          position={arrowPosition}
          // @ts-expect-error: HTMLDivElement `color` attribute conflicts with prop
          color={useColor(arrowColor)}
          hidden={!showArrows || isLastPage}
        >
          <Arrow background={useColor(arrowBackground)}>
            <RightChevron />
          </Arrow>
        </RightSlop>
      </Container>
      {/* @ts-expect-error: HTMLDivElement attributes conflicts with `color` prop */}
      <Dots color={useColor(dotColor)} hidden={!showDots}>
        {Array.from({ length: pageCount }).map((_, i) => (
          <Dot key={i} active={i === pageIndex} onClick={() => paginate(i - pageIndex)} />
        ))}
      </Dots>
    </Wrapper>
  )
})
