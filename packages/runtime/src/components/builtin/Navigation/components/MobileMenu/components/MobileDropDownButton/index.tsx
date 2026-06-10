import { ComponentPropsWithoutRef, useState, ReactNode } from 'react'

import { LinkData, ResponsiveColorData, ResponsiveTextStyleData } from '@makeswift/prop-controllers'

import { colorToString } from '../../../../../../utils/colorToString'
import { useResponsiveColor } from '../../../../../../hooks'

import { CaretDown8 } from '../../../../../../icons/CaretDown8'
import { Plus8 } from '../../../../../../icons/Plus8'
import { ArrowDown8 } from '../../../../../../icons/ArrowDown8'
import { ChevronDown8 } from '../../../../../../icons/ChevronDown8'

import { Link } from '../../../../../../shared/Link'
import Button from '../../../../../Button'
import {
  useResponsiveStyle,
  useResponsiveTextStyle,
} from '../../../../../../utils/responsive-style'
import { useStyle } from '../../../../../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type DropDownMenuBaseProps = {
  className?: string
  open: boolean
}

type DropDownMenuProps = DropDownMenuBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DropDownMenuBaseProps>

function DropDownMenu({ className, open, ...restOfProps }: DropDownMenuProps) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({ display: open ? 'flex' : 'none', flexDirection: 'column', padding: 8 })
  return (
    <div
      {...restOfProps}
      className={clsx(
        baseClassName,
        className,
      )}
    />
  )
}

type ButtonLinkBaseProps = {
  className?: string
}

type ButtonLinkProps = ButtonLinkBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Button>, keyof ButtonLinkBaseProps>

function ButtonLink({ className, ...restOfProps }: ButtonLinkProps) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({ margin: '8px 0' })
  return (
    <>
      {baseStyleElement}
      <Button {...restOfProps} className={clsx(baseClassName, className)} />
    </>
  )
}

type BaseDropDownItemProps = {
  className?: string
  color?: ResponsiveColorData
  textStyle?: ResponsiveTextStyleData
}

type DropDownItemProps = BaseDropDownItemProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseDropDownItemProps>

function DropDownItem({ color, className, textStyle, ...restOfProps }: DropDownItemProps) {
  const colorData = useResponsiveColor(color)

  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({
    textDecoration: 'none',
    lineHeight: 1.4,
    padding: '8px 16px',
    color: 'black',
  })
  const { className: responsiveTextStyleClassName, styleElement: responsiveTextStylesElement } = useStyle(useResponsiveTextStyle(textStyle))
  const { className: responsiveColorClassName, styleElement: responsiveColorStylesElement } = useStyle(useResponsiveStyle([colorData] as const, ([color]) => ({
    color: color == null ? 'black' : colorToString(color),
  })))

  return (
    <>
      {baseStyleElement}
      {responsiveColorStylesElement}
      {responsiveTextStylesElement}
      <Link
        {...restOfProps}
        className={clsx(
          baseClassName,
          responsiveTextStyleClassName,
          responsiveColorClassName,
          className,
        )}
      />
    </>
  )
}

type Props = Omit<ComponentPropsWithoutRef<typeof Button>, 'textColor' | 'color'> & {
  label: string
  links?: Array<{
    id: string
    payload: ComponentPropsWithoutRef<typeof DropDownItem> & {
      link?: LinkData
      label: string
    }
  }>
  onClose?: () => unknown
  caret?: string
  textColor?: ResponsiveColorData
  color?: ResponsiveColorData
}

export default function MobileDropDownButton({
  label,
  caret,
  links = [],
  onClose = () => {},
  color,
  textColor,
  ...restOfProps
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ButtonLink
        {...restOfProps}
        textColor={useResponsiveColor(textColor)}
        color={useResponsiveColor(color)}
        onPointerDown={() => setIsOpen(prev => !prev)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 6 }}>{label}</span>
          <span style={{ display: 'inline-flex', fill: 'currentColor' }}>
            <>
              {caret === 'caret' && <CaretDown8 />}
              {caret === 'plus' && <Plus8 />}
              {caret === 'arrow-down' && <ArrowDown8 />}
              {caret === 'chevron-down' && <ChevronDown8 />}
            </>
          </span>
        </div>
      </ButtonLink>
      <DropDownMenu open={isOpen}>
        {links.map(({ id, payload }) => (
          <DropDownItem {...payload} key={id} onClick={onClose}>
            {payload.label}
          </DropDownItem>
        ))}
      </DropDownMenu>
    </>
  )
}
