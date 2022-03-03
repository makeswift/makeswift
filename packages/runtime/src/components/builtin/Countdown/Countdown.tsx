import { useState, useEffect, Ref, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { useColor } from '../../hooks'
import { colorToString } from '../../utils/colorToString'
import { ColorValue as Color } from '../../utils/types'
import { cssMediaRules, cssWidth, cssMargin } from '../../utils/cssMediaRules'
import {
  ResponsiveValue,
  DateValue,
  ElementIDValue,
  FontValue,
  GapXValue,
  MarginValue,
  ResponsiveColorValue,
  ResponsiveIconRadioGroupValue,
  TextInputValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'

type Props = {
  id?: ElementIDValue
  date?: DateValue
  variant?: ResponsiveIconRadioGroupValue<
    'filled' | 'filled-split' | 'outline' | 'outline-split' | 'clear'
  >
  shape?: ResponsiveIconRadioGroupValue<'pill' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  gap?: GapXValue
  numberFont?: FontValue
  numberColor?: ResponsiveColorValue
  blockColor?: ResponsiveColorValue
  labelFont?: FontValue
  labelColor?: ResponsiveColorValue
  width?: WidthValue
  margin?: MarginValue
  daysLabel?: TextInputValue
  hoursLabel?: TextInputValue
  minutesLabel?: TextInputValue
  secondsLabel?: TextInputValue
}

const Block = styled.div`
  display: block;
  padding: 0.5em;
  font-size: 1em;
`

const Label = styled.div`
  margin-top: 0.25em;
`

const Segment = styled.div`
  flex: 1;
  text-align: center;
`

const Container = styled.div<{
  width: Props['width']
  margin: Props['margin']
  variant: Props['variant']
  size: Props['size']
  shape: Props['shape']
  gap: Props['gap']
  labelColor?: ResponsiveValue<Color> | null
  numberFont?: ResponsiveValue<string>
  numberColor?: ResponsiveValue<Color> | null
  blockColor?: ResponsiveValue<Color> | null
  labelFont?: ResponsiveValue<string>
}>`
  display: flex;
  ${cssWidth('560px')}
  ${cssMargin()}
  ${p =>
    cssMediaRules([p.size] as const, ([size = 'medium']) => {
      switch (size) {
        case 'small':
          return css`
            font-size: 18px;

            ${Label} {
              font-size: 14px;
            }
          `
        case 'large':
          return css`
            font-size: 32px;

            ${Label} {
              font-size: 18px;
            }
          `
        default:
          return css`
            font-size: 24px;

            ${Label} {
              font-size: 16px;
            }
          `
      }
    })}

  ${Segment} {
    ${p =>
      cssMediaRules(
        [p.gap] as const,
        ([gap]) => css`
          margin: 0 ${gap == null ? 0 : `${gap.value / 2}${gap.unit}`};

          &:first-child {
            margin-left: 0;
          }

          &:last-child {
            margin-right: 0;
          }
        `,
      )}
  }

  ${Block} {
    ${p =>
      cssMediaRules([p.shape] as const, ([shape = 'rounded']) => {
        switch (shape) {
          case 'pill':
            return css`
              border-radius: 500px;
            `
          case 'rounded':
            return css`
              border-radius: 6px;
            `
          default:
            return css`
              border-radius: 0;
            `
        }
      })}
    ${p =>
      cssMediaRules(
        [p.variant, p.blockColor, p.numberColor, p.numberFont] as const,
        ([
          variant = 'filled',
          blockColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
          numberColor = { swatch: { hue: 0, saturation: 0, lightness: 100 }, alpha: 1 },
          numberFont = 'sans-serif',
        ]) => {
          switch (variant) {
            case 'filled':
              return css`
                font-family: '${numberFont}';
                color: ${colorToString(numberColor)};
                background: ${colorToString(blockColor)};
              `
            case 'filled-split':
              return css`
                position: relative;
                color: ${colorToString(numberColor)};
                font-family: '${numberFont}';

                > span {
                  position: relative;
                  z-index: 1;
                }

                :before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: calc(50% + 1px);
                  border-top-left-radius: inherit;
                  border-top-right-radius: inherit;
                  background: ${colorToString(blockColor)};
                }

                :after {
                  content: '';
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: calc(50% + 1px);
                  bottom: 0;
                  border-bottom-left-radius: inherit;
                  border-bottom-right-radius: inherit;
                  background: ${colorToString(blockColor)};
                }
              `
            case 'outline':
              return css`
                font-family: '${numberFont}';
                color: ${colorToString(numberColor)};
                background: transparent;
                border: 2px solid ${colorToString(blockColor)};
              `
            case 'outline-split':
              return css`
                position: relative;
                font-family: '${numberFont}';
                color: ${colorToString(numberColor)};
                border: 2px solid ${colorToString(blockColor)};

                > span {
                  position: relative;
                  z-index: 1;
                }

                :before {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 0;
                  right: 0;
                  height: 2px;
                  margin-top: -1px;
                  background: ${colorToString(blockColor)};
                }
              `
            default:
              return css`
                font-family: '${numberFont}';
                background: transparent;
                color: ${colorToString(numberColor)};
                padding-top: 0;
                padding-bottom: 0;
              `
          }
        },
      )}
  }

  ${Label} {
    ${p =>
      cssMediaRules(
        [p.labelColor, p.labelFont] as const,
        ([
          labelColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
          labelFont = 'sans-serif',
        ]) => css`
          font-family: '${labelFont}';
          color: ${colorToString(labelColor)};
        `,
      )}
  }
`

const getRemaining = (date: Props['date'] | undefined) => {
  if (date == null) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

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

  return { days, hours, minutes, seconds }
}

export default forwardRef(function Countdown(
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
  const [{ days, hours, minutes, seconds }, setRemaining] = useState(getRemaining(date))

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
      labelColor={useColor(labelColor)}
      labelFont={labelFont}
      numberColor={useColor(numberColor)}
      numberFont={numberFont}
      blockColor={useColor(blockColor)}
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
