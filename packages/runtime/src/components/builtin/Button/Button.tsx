import { ReactElement, ComponentPropsWithoutRef, forwardRef } from 'react'

import {
  ElementIDValue,
  MarginValue,
  TextInputValue,
  ResponsiveSelectValue,
  ResponsiveIconRadioGroupValue,
  TextStyleValue,
  LinkValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { Link } from '../../shared/Link'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { ButtonVariant } from './contants'

type ControllerProps = {
  id?: ElementIDValue
  children?: TextInputValue
  link?: LinkValue
  variant?: ResponsiveSelectValue<ButtonVariant>
  shape?: ResponsiveIconRadioGroupValue<'pill' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  color?: ResponsiveColor
  textColor?: ResponsiveColor
  textStyle?: TextStyleValue
  width?: WidthValue
  margin?: MarginValue
}

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

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps>

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
    className,
    ...restOfProps
  },
  ref,
) {
  return (
    <Link
      {...restOfProps}
      ref={ref}
      id={id}
      className={className}
      // @ts-expect-error: HTMLAnchorElement `color` attribute conflicts with prop
      color={color}
      link={link}
      width={width}
      margin={margin}
      shape={shape}
      size={size}
      textColor={textColor}
      textStyle={textStyle}
      variant={variant}
    >
      {children == null ? 'Button Text' : children}
    </Link>
  )
})

export default Button
