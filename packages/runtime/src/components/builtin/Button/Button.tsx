import {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react'
import ColorHelper from 'color'

import {
  ElementIDValue,
  ResponsiveSelectValue,
  ResponsiveIconRadioGroupValue,
  TextStyleValue,
} from '../../../prop-controllers/descriptors'
import { colorToString } from '../../utils/colorToString'
import { Link } from '../../shared/Link'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { ButtonVariant } from './contants'
import { useStyle } from '../../../runtimes/react/use-style'
import {
  useResponsiveStyle,
  useResponsiveTextStyle,
  useResponsiveWidth,
} from '../../utils/responsive-style'
import { cx } from '@emotion/css'
import { LinkPropControllerValue, ResponsiveLengthData } from '@makeswift/prop-controllers'

type BaseProps<T extends ElementType> = {
  as?: T
  id?: ElementIDValue
  children?: ReactNode
  link?: LinkPropControllerValue
  variant?: ResponsiveSelectValue<ButtonVariant>
  shape?: ResponsiveIconRadioGroupValue<'pill' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  color?: ResponsiveColor | null
  textColor?: ResponsiveColor | null
  textStyle?: TextStyleValue
  width?: ResponsiveLengthData
  margin?: string
}

type Props<T extends ElementType> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps<T>>

const Button = forwardRef(function Button<T extends ElementType = 'button'>(
  {
    as,
    id,
    children,
    link,
    variant,
    shape,
    size,
    textColor,
    color,
    textStyle,
    width,
    margin,
    className,
    ...restOfProps
  }: Props<T>,
  ref: ForwardedRef<ElementRef<T>>,
) {
  const Component = as ?? Link

  return (
    // @ts-ignore: `ref` prop doesn't match between `Link` and `T`.
    <Component
      {...restOfProps}
      ref={ref}
      id={id}
      className={cx(
        useStyle({
          display: 'table',
          border: 0,
          outline: 0,
          userSelect: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textDecoration: 'none',
          textAlign: 'center',
        }),
        useStyle(useResponsiveWidth(width, 'auto')),
        margin,
        useStyle(
          useResponsiveStyle(
            [variant, shape, size, textColor, color] as const,
            ([
              variant = 'flat',
              shape = 'rounded',
              size = 'medium',
              textColor = { swatch: { hue: 0, saturation: 0, lightness: 100 }, alpha: 1 },
              color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
            ]) => {
              const fontSize = {
                value: { small: 12, medium: 14, large: 18 }[size],
                unit: 'px',
              }

              return {
                color: colorToString(textColor),
                borderRadius: `${{ square: 0, rounded: 4, pill: 500 }[shape]}px`,
                padding: `${{ small: '8px 12px', medium: '12px 16px', large: '16px 20px' }[size]}`,
                fontSize: `${fontSize.value}${fontSize.unit}`,
                ...{
                  flat: {
                    background: colorToString(color),
                    border: 'none',
                    transition: ['color', 'background', 'border', 'box-shadow']
                      .map(property => `${property} 0.15s ease-in-out`)
                      .join(', '),

                    ':hover': {
                      background: ColorHelper(colorToString(color)).darken(0.1).hex(),
                    },

                    ':active': {
                      background: ColorHelper(colorToString(color)).darken(0.15).hex(),
                    },
                  },
                  outline: {
                    background: 'transparent',
                    boxShadow: `inset 0 0 0 2px ${colorToString(color)}`,
                    transition: ['color', 'background', 'box-shadow']
                      .map(property => `${property} 0.15s ease-in-out`)
                      .join(', '),

                    ':hover': {
                      boxShadow: `inset 0 0 0 2px ${ColorHelper(colorToString(color))
                        .darken(0.1)
                        .hex()}`,
                      color: ColorHelper(colorToString(color)).darken(0.1).hex(),
                    },

                    ':active': {
                      boxShadow: `inset 0 0 0 2px ${ColorHelper(colorToString(color))
                        .darken(0.15)
                        .hex()}`,
                      color: ColorHelper(colorToString(color)).darken(0.15).hex(),
                    },
                  },
                  shadow: {
                    background: colorToString(color),
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.2)',
                    transition: ['transform', 'box-shadow']
                      .map(property => `${property} 0.18s`)
                      .join(', '),

                    ':hover': {
                      boxShadow:
                        '0 10px 25px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                      transform: 'translateY(-1px)',
                    },

                    ':active': {
                      boxShadow:
                        '0 4px 12px rgba(0, 0, 0, 0.15), 0 4px 6px -3px rgba(0, 0, 0, 0.3)',
                      transform: 'translateY(0px)',
                    },
                  },
                  clear: {
                    background: 'transparent',
                    border: 'none',

                    ':hover': {
                      color: ColorHelper(colorToString(textColor)).alpha(0.5).toString(),
                    },

                    ':active': {
                      color: ColorHelper(colorToString(textColor)).alpha(0.6).toString(),
                    },
                  },
                  blocky: {
                    background: colorToString(color),
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: ColorHelper(colorToString(color)).darken(0.25).hex(),
                    boxShadow: `0 4px ${ColorHelper(colorToString(color)).darken(0.25).hex()}`,
                    transition: ['transform', 'box-shadow']
                      .map(property => `${property} 0.1s`)
                      .join(', '),

                    ':hover': {
                      transform: 'translateY(2px)',
                      boxShadow: `0 2px ${ColorHelper(colorToString(color)).darken(0.25).hex()}`,
                    },

                    ':active': {
                      transform: 'translateY(4px)',
                      boxShadow: `0 0 ${ColorHelper(colorToString(color)).darken(0.25).hex()}`,
                    },
                  },
                  bubbly: {
                    background: `linear-gradient(
                      180deg,
                      ${ColorHelper(colorToString(color)).lighten(0.05).hex()},
                      ${ColorHelper(colorToString(color)).darken(0.3).saturate(0.05).hex()}
                    )`,
                    position: 'relative',
                    zIndex: '0',

                    ':before': {
                      position: 'absolute',
                      content: '""',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      zIndex: '-1',
                      borderRadius: 'inherit',
                      background: `linear-gradient(
                        180deg,
                        ${ColorHelper(colorToString(color)).lighten(0.2).hex()},
                        ${ColorHelper(colorToString(color)).darken(0.2).saturate(0.05).hex()}
                      )`,
                      opacity: '0',
                      transition: 'opacity 0.15s',
                    },

                    ':hover': {
                      ':before': {
                        opacity: '1',
                      },
                    },

                    ':active': {
                      ':before': {
                        opacity: '0.25',
                      },
                    },
                  } as const,
                  skewed: {
                    position: 'relative',
                    zIndex: '0',

                    ':before': {
                      position: 'absolute',
                      content: '""',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      zIndex: '-1',
                      background: colorToString(color),
                      transform: 'skewX(-12deg)',
                      borderRadius: 'inherit',
                      transition: 'transform 0.2s cubic-bezier(0.25, 0, 0.25, 1.75)',
                    },

                    ':hover:before': {
                      transform: 'skew(0deg)',
                    },

                    ':active:before': {
                      transform: 'skew(-8deg)',
                    },
                  } as const,
                }[variant],
              }
            },
          ),
        ),
        useStyle(useResponsiveTextStyle(textStyle)),
        className,
      )}
      link={link}
    >
      {children == null ? 'Button Text' : children}
    </Component>
  )
})

export default Button
