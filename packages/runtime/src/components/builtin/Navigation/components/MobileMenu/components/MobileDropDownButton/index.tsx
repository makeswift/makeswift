import { ComponentPropsWithoutRef, useState } from 'react'

import {
  ResponsiveColorValue,
  TextStyleValue,
  LinkValue,
} from '../../../../../../../prop-controllers/descriptors'
import { colorToString } from '../../../../../../utils/colorToString'
import { useResponsiveColor } from '../../../../../../hooks'

import { ReactComponent as CaretDown8 } from '../../../../../../icons/caret-down-8.svg'
import { ReactComponent as Plus8 } from '../../../../../../icons/plus-8.svg'
import { ReactComponent as ArrowDown8 } from '../../../../../../icons/arrow-down-8.svg'
import { ReactComponent as ChevronDown8 } from '../../../../../../icons/chevron-down-8.svg'

import { Link } from '../../../../../../shared/Link'
import Button from '../../../../../Button'
import { cx } from '@emotion/css'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import {
  useResponsiveStyle,
  useResponsiveTextStyle,
} from '../../../../../../utils/responsive-style'

type DropDownMenuBaseProps = {
  className?: string
  open: boolean
}

type DropDownMenuProps = DropDownMenuBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DropDownMenuBaseProps>

function DropDownMenu({ className, open, ...restOfProps }: DropDownMenuProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle({ display: open ? 'flex' : 'none', flexDirection: 'column', padding: 8 }),
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
  return <Button {...restOfProps} className={cx(useStyle({ margin: '8px 0' }), className)} />
}

type BaseDropDownItemProps = {
  className?: string
  color?: ResponsiveColorValue
  textStyle?: TextStyleValue
}

type DropDownItemProps = BaseDropDownItemProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseDropDownItemProps>

function DropDownItem({ color, className, textStyle, ...restOfProps }: DropDownItemProps) {
  const colorData = useResponsiveColor(color)

  return (
    <Link
      {...restOfProps}
      className={cx(
        useStyle({
          textDecoration: 'none',
          lineHeight: 1.4,
          padding: '8px 16px',
          color: 'black',
        }),
        useStyle(useResponsiveTextStyle(textStyle)),
        useStyle(
          useResponsiveStyle([colorData] as const, ([color]) => ({
            color: color == null ? 'black' : colorToString(color),
          })),
        ),
        className,
      )}
    />
  )
}

type Props = Omit<ComponentPropsWithoutRef<typeof Button>, 'textColor' | 'color'> & {
  label: string
  links?: Array<{
    id: string
    payload: ComponentPropsWithoutRef<typeof DropDownItem> & {
      link?: LinkValue
      label: string
    }
  }>
  onClose?: () => unknown
  caret?: string
  textColor?: ResponsiveColorValue
  color?: ResponsiveColorValue
}

export default function MobileDropDownButton({
  label,
  caret,
  links = [],
  onClose = () => {},
  color,
  textColor,
  ...restOfProps
}: Props): JSX.Element {
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
