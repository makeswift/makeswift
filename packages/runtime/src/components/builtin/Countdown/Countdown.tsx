'use client'

import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef, Ref, useEffect, useState } from 'react'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { useStyle } from '../../../runtimes/react/use-style'
import { colorToString } from '../../utils/colorToString'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { ColorValue as Color } from '../../utils/types'
import {
  type ResponsiveFontData,
  type ResponsiveGapData,
  type ResponsiveIconRadioGroupValue,
  type ResponsiveValue,
} from '@makeswift/prop-controllers'

type Props = {
  id?: string
  date?: string
  variant?: ResponsiveIconRadioGroupValue<
    'filled' | 'filled-split' | 'outline' | 'outline-split' | 'clear'
  >
  shape?: ResponsiveIconRadioGroupValue<'pill' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  gap?: ResponsiveGapData
  numberFont?: ResponsiveFontData
  numberColor?: ResponsiveColor | null
  blockColor?: ResponsiveColor | null
  labelFont?: ResponsiveFontData
  labelColor?: ResponsiveColor | null
  width?: string
  margin?: string
  daysLabel?: string
  hoursLabel?: string
  minutesLabel?: string
  secondsLabel?: string
}

const BLOCK_CLASS_NAME = 'block'

type BlockProps = ComponentPropsWithoutRef<'div'>

function Block({ className, ...restOfProps }: BlockProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        BLOCK_CLASS_NAME,
        useStyle({ display: 'block', padding: '0.5em', fontSize: '1em' }),
        className,
      )}
    />
  )
}

const LABEL_CLASS_NAME = 'label'

type LabelProps = ComponentPropsWithoutRef<'div'>

function Label({ className, ...restOfProps }: LabelProps) {
  return (
    <div
      {...restOfProps}
      className={cx(LABEL_CLASS_NAME, useStyle({ marginTop: '0.25em' }), className)}
    />
  )
}

const SEGMENT_CLASS_NAME = 'segment'

type SegmentProps = ComponentPropsWithoutRef<'div'>

function Segment({ className, ...restOfProps }: SegmentProps) {
  return (
    <div
      {...restOfProps}
      className={cx(SEGMENT_CLASS_NAME, useStyle({ flex: 1, textAlign: 'center' }), className)}
    />
  )
}

type ContainerBaseProps = {
  width?: string
  margin?: string
  variant: Props['variant']
  size: Props['size']
  shape: Props['shape']
  gap: Props['gap']
  labelColor?: ResponsiveValue<Color> | null
  numberFont?: ResponsiveValue<string>
  numberColor?: ResponsiveValue<Color> | null
  blockColor?: ResponsiveValue<Color> | null
  labelFont?: ResponsiveValue<string>
}

type ContainerProps = ContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ContainerBaseProps>

const Container = forwardRef(function Container(
  {
    className,
    width,
    margin,
    variant,
    size,
    shape,
    gap,
    labelColor,
    numberFont,
    numberColor,
    blockColor,
    labelFont,
    ...restOfProps
  }: ContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ display: 'flex' }),
        width,
        margin,
        useStyle(
          useResponsiveStyle([size] as const, ([size = 'medium']) => {
            switch (size) {
              case 'small':
                return { fontSize: 18, [`.${LABEL_CLASS_NAME}`]: { fontSize: 14 } }

              case 'large':
                return { fontSize: 32, [`.${LABEL_CLASS_NAME}`]: { fontSize: 18 } }

              default:
                return { fontSize: 24, [`.${LABEL_CLASS_NAME}`]: { fontSize: 16 } }
            }
          }),
        ),
        useStyle({
          [`.${SEGMENT_CLASS_NAME}`]: useResponsiveStyle([gap] as const, ([gap]) => ({
            margin: `0 ${gap == null ? 0 : `${gap.value / 2}${gap.unit}`}`,

            '&:first-child': {
              marginLeft: 0,
            },

            '&:last-child': {
              marginRight: 0,
            },
          })),
        }),
        useStyle({
          [`.${BLOCK_CLASS_NAME}`]: useResponsiveStyle([shape] as const, ([shape = 'rounded']) => {
            switch (shape) {
              case 'pill':
                return { borderRadius: 500 }

              case 'rounded':
                return { borderRadius: 6 }

              default:
                return { borderRadius: 0 }
            }
          }),
        }),
        useStyle({
          [`.${BLOCK_CLASS_NAME}`]: useResponsiveStyle(
            [variant, blockColor, numberColor, numberFont] as const,
            ([
              variant = 'filled',
              blockColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
              numberColor = { swatch: { hue: 0, saturation: 0, lightness: 100 }, alpha: 1 },
              numberFont = 'sans-serif',
            ]) => {
              switch (variant) {
                case 'filled':
                  return {
                    fontFamily: `"${numberFont}"`,
                    color: colorToString(numberColor),
                    background: colorToString(blockColor),
                  }

                case 'filled-split':
                  return {
                    position: 'relative',
                    color: colorToString(numberColor),
                    fontFamily: `"${numberFont}"`,

                    '> span': {
                      position: 'relative',
                      zIndex: 1,
                    },

                    '::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 'calc(50% + 1px)',
                      borderTopLeftRadius: 'inherit',
                      borderTopRightRadius: 'inherit',
                      background: colorToString(blockColor),
                    },

                    '::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 'calc(50% + 1px)',
                      bottom: 0,
                      borderBottomLeftRadius: 'inherit',
                      borderBottomRightRadius: 'inherit',
                      background: colorToString(blockColor),
                    },
                  }

                case 'outline':
                  return {
                    fontFamily: `"${numberFont}"`,
                    color: colorToString(numberColor),
                    background: 'transparent',
                    border: `2px solid ${colorToString(blockColor)}`,
                  }

                case 'outline-split':
                  return {
                    position: 'relative',
                    fontFamily: `"${numberFont}"`,
                    color: colorToString(numberColor),
                    border: `2px solid ${colorToString(blockColor)}`,

                    '> span': {
                      position: 'relative',
                      zIndex: 1,
                    },

                    '::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: 2,
                      marginTop: -1,
                      background: colorToString(blockColor),
                    },
                  }

                default:
                  return {
                    fontFamily: `"${numberFont}"`,
                    background: 'transparent',
                    color: colorToString(numberColor),
                    paddingTop: 0,
                    paddingBottom: 0,
                  }
              }
            },
          ),
        }),
        useStyle({
          [`.${LABEL_CLASS_NAME}`]: useResponsiveStyle(
            [labelColor, labelFont] as const,
            ([
              labelColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
              labelFont = 'sans-serif',
            ]) => ({
              fontFamily: `"${labelFont}"`,
              color: colorToString(labelColor),
            }),
          ),
        }),
        className,
      )}
    />
  )
})

const getRemaining = (date: Props['date'] | null | undefined) => {
  if (date == null) return { days: '0', hours: '0', minutes: '0', seconds: '0' }

  const timeDiff = new Date(date).getTime() - Date.now()

  if (timeDiff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  let delta = Math.abs(timeDiff) / 1000

  const days = Math.floor(delta / 86400)
  delta -= days * 86400

  const hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600

  const minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60

  const seconds = parseInt(String(delta % 60), 10)

  return {
    days: days.toString(),
    hours: hours.toString(),
    minutes: minutes.toString(),
    seconds: seconds.toString(),
  }
}

const Countdown = forwardRef(function Countdown(
  {
    id,
    margin,
    width,
    date,
    variant,
    size,
    shape,
    gap,
    labelColor,
    labelFont,
    numberColor,
    numberFont,
    blockColor,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const [{ days, hours, minutes, seconds }, setRemaining] = useState(getRemaining(null))

  useEffect(() => {
    setRemaining(getRemaining(date))

    const intervalId = setInterval(() => {
      setRemaining(getRemaining(date))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [date])

  return (
    <Container
      ref={ref}
      id={id}
      width={width}
      margin={margin}
      variant={variant}
      size={size}
      shape={shape}
      labelColor={labelColor}
      labelFont={labelFont}
      numberColor={numberColor}
      numberFont={numberFont}
      blockColor={blockColor}
      gap={gap}
    >
      <Segment>
        <Block>
          <span>{days}</span>
        </Block>
        <Label>{daysLabel == null ? 'Days' : daysLabel}</Label>
      </Segment>
      <Segment>
        <Block>
          <span>{hours}</span>
        </Block>
        <Label>{hoursLabel == null ? 'Hours' : hoursLabel}</Label>
      </Segment>
      <Segment>
        <Block>
          <span>{minutes}</span>
        </Block>
        <Label>{minutesLabel == null ? 'Minutes' : minutesLabel}</Label>
      </Segment>
      <Segment>
        <Block>
          <span>{seconds}</span>
        </Block>
        <Label>{secondsLabel == null ? 'Seconds' : secondsLabel}</Label>
      </Segment>
    </Container>
  )
})

export default Countdown
