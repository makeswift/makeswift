import { ReactElement, ComponentPropsWithoutRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import ColorHelper from 'color'

import { cssMediaRules, cssWidth, cssMargin, cssTextStyle } from '../../utils/cssMediaRules'
import {
  ResponsiveValue,
  ElementIDValue,
  MarginValue,
  TextInputValue,
  ResponsiveSelectValue,
  ResponsiveIconRadioGroupValue,
  TextStyleValue,
  LinkValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { ColorValue as Color } from '../../utils/types'
import { colorToString } from '../../utils/colorToString'
import { Link } from '../../shared/Link'
import { ReactRuntime } from '../../../react'
import { Props } from '../../../prop-controllers'
import { ResponsiveColor } from '../../../runtimes/react/controls'

type ControllerProps = {
  id?: ElementIDValue
  children?: TextInputValue
  link?: LinkValue
  variant?: ResponsiveSelectValue<
    'flat' | 'outline' | 'shadow' | 'clear' | 'blocky' | 'bubbly' | 'skewed'
  >
  shape?: ResponsiveIconRadioGroupValue<'pill' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  color?: ResponsiveColor
  textColor?: ResponsiveColor
  textStyle?: TextStyleValue
  width?: WidthValue
  margin?: MarginValue
}

const StyledButton = styled(Link)<{
  width: ControllerProps['width']
  margin: ControllerProps['margin']
  variant: ControllerProps['variant']
  shape: ControllerProps['shape']
  size: ControllerProps['size']
  textColor: ResponsiveValue<Color> | null | undefined
  color: ResponsiveValue<Color> | null | undefined
  textStyle: ControllerProps['textStyle']
}>`
  display: table;
  border: 0;
  outline: 0;
  user-select: none;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  ${cssWidth('auto')}
  ${cssMargin()}
  ${p =>
    cssMediaRules(
      [p.variant, p.shape, p.size, p.textColor, p.color] as const,
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

        return css`
          color: ${colorToString(textColor)};
          border-radius: ${{ square: 0, rounded: 4, pill: 500 }[shape]}px;
          padding: ${{ small: '8px 12px', medium: '12px 16px', large: '16px 20px' }[size]};
          font-size: ${`${fontSize.value}${fontSize.unit}`};

          ${{
            flat: css`
              background: ${colorToString(color)};
              border: none;
              transition: ${['color', 'background', 'border', 'box-shadow']
                .map(property => `${property} 0.15s ease-in-out`)
                .join(', ')};

              :hover {
                background: ${ColorHelper(colorToString(color)).darken(0.1).hex()};
              }

              :active {
                background: ${ColorHelper(colorToString(color)).darken(0.15).hex()};
              }
            `,
            outline: css`
              background: transparent;
              box-shadow: inset 0 0 0 2px ${colorToString(color)};
              transition: ${['color', 'background', 'box-shadow']
                .map(property => `${property} 0.15s ease-in-out`)
                .join(', ')};

              :hover {
                box-shadow: inset 0 0 0 2px ${ColorHelper(colorToString(color)).darken(0.1).hex()};
                color: ${ColorHelper(colorToString(color)).darken(0.1).hex()};
              }

              :active {
                box-shadow: inset 0 0 0 2px ${ColorHelper(colorToString(color)).darken(0.15).hex()};
                color: ${ColorHelper(colorToString(color)).darken(0.15).hex()};
              }
            `,
            shadow: css`
              background: ${colorToString(color)};
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.2);
              transition: ${['transform', 'box-shadow']
                .map(property => `${property} 0.18s`)
                .join(', ')};

              :hover {
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                transform: translateY(-1px);
              }

              :active {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 4px 6px -3px rgba(0, 0, 0, 0.3);
                transform: translateY(0px);
              }
            `,
            clear: css`
              background: transparent;
              border: none;

              :hover {
                color: ${ColorHelper(colorToString(textColor)).alpha(0.5).toString()};
              }

              :active {
                color: ${ColorHelper(colorToString(textColor)).alpha(0.6).toString()};
              }
            `,
            blocky: css`
              background: ${colorToString(color)};
              border-width: 1px;
              border-style: solid;
              border-color: ${ColorHelper(colorToString(color)).darken(0.25).hex()};
              box-shadow: 0 4px ${ColorHelper(colorToString(color)).darken(0.25).hex()};
              transition: ${['transform', 'box-shadow']
                .map(property => `${property} 0.1s`)
                .join(', ')};

              :hover {
                transform: translateY(2px);
                box-shadow: 0 2px ${ColorHelper(colorToString(color)).darken(0.25).hex()};
              }

              :active {
                transform: translateY(4px);
                box-shadow: 0 0 ${ColorHelper(colorToString(color)).darken(0.25).hex()};
              }
            `,
            bubbly: css`
              background: linear-gradient(
                180deg,
                ${ColorHelper(colorToString(color)).lighten(0.05).hex()},
                ${ColorHelper(colorToString(color)).darken(0.3).saturate(0.05).hex()}
              );
              position: relative;
              z-index: 0;

              :before {
                position: absolute;
                content: '';
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                border-radius: inherit;
                background: linear-gradient(
                  180deg,
                  ${ColorHelper(colorToString(color)).lighten(0.2).hex()},
                  ${ColorHelper(colorToString(color)).darken(0.2).saturate(0.05).hex()}
                );
                opacity: 0;
                transition: opacity 0.15s;
              }

              :hover {
                :before {
                  opacity: 1;
                }
              }

              :active {
                :before {
                  opacity: 0.25;
                }
              }
            `,
            skewed: css`
              position: relative;
              z-index: 0;

              :before {
                position: absolute;
                content: '';
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                background: ${colorToString(color)};
                transform: skewX(-12deg);
                border-radius: inherit;
                transition: transform 0.2s cubic-bezier(0.25, 0, 0.25, 1.75);
              }

              :hover:before {
                transform: skew(0deg);
              }

              :active:before {
                transform: skew(-8deg);
              }
            `,
          }[variant]}
        `
      },
    )}
    ${cssTextStyle()}
`

type BaseProps = {
  id?: ControllerProps['id']
  children?: ReactElement | string
  link?: ControllerProps['link']
  variant?: ControllerProps['variant']
  shape?: ControllerProps['shape']
  size?: ControllerProps['size']
  textColor?: ControllerProps['textColor']
  color?: ControllerProps['color']
  textStyle?: ControllerProps['textStyle']
  width?: ControllerProps['width']
  margin?: ControllerProps['margin']
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof StyledButton>, keyof BaseProps>

const Button = forwardRef<HTMLAnchorElement, Props>(function Button(
  {
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
    ...restOfProps
  },
  ref,
) {
  return (
    <StyledButton
      {...restOfProps}
      ref={ref}
      id={id}
      // @ts-expect-error: HTMLAnchorElement `color` attribute conflicts with prop
      color={color}
      link={link}
      margin={margin}
      shape={shape}
      size={size}
      textColor={textColor}
      textStyle={textStyle}
      variant={variant}
      width={width}
    >
      {children == null ? 'Button Text' : children}
    </StyledButton>
  )
})

export default Button

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(Button, {
    type: './components/Button/index.js',
    label: 'Button',
    props: {
      id: Props.ElementID(),
      children: Props.TextInput({ placeholder: 'Button text' }),
      link: Props.Link({
        defaultValue: {
          type: 'OPEN_PAGE',
          payload: {
            pageId: null,
            openInNewTab: false,
          },
        },
      }),
      variant: Props.ResponsiveSelect({
        label: 'Style',
        labelOrientation: 'horizontal',
        options: [
          { value: 'flat', label: 'Flat' },
          { value: 'outline', label: 'Outline' },
          { value: 'shadow', label: 'Floating' },
          { value: 'clear', label: 'Clear' },
          { value: 'blocky', label: 'Blocky' },
          { value: 'bubbly', label: 'Bubbly' },
          { value: 'skewed', label: 'Skewed' },
        ],
        defaultValue: 'flat',
      }),
      shape: Props.ResponsiveIconRadioGroup({
        label: 'Shape',
        options: [
          { label: 'Pill', value: 'pill', icon: 'ButtonPill16' },
          { label: 'Rounded', value: 'rounded', icon: 'ButtonRounded16' },
          { label: 'Square', value: 'square', icon: 'ButtonSquare16' },
        ],
        defaultValue: 'rounded',
      }),
      size: Props.ResponsiveIconRadioGroup({
        label: 'Size',
        options: [
          { label: 'Small', value: 'small', icon: 'SizeSmall16' },
          { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
          { label: 'Large', value: 'large', icon: 'SizeLarge16' },
        ],
        defaultValue: 'medium',
      }),
      color: Props.ResponsiveColor({
        placeholder: 'black',
        // hidden: findDeviceOverride<ButtonVariant>(variant, device)?.value === 'clear',
      }),
      textColor: Props.ResponsiveColor({
        label: 'Text color',
        placeholder: 'white',
      }),
      textStyle: Props.TextStyle(),
      width: Props.Width(),
      margin: Props.Margin(),
    },
  })
}
