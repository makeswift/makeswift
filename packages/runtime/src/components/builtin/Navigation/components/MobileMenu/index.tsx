import { ComponentPropsWithoutRef, Fragment, ReactNode } from 'react'

import { ColorValue as Color } from '../../../../utils/types'
import { colorToString } from '../../../../utils/colorToString'
import { Times16 } from '../../../../icons/Times16'

import Button from '../../../Button'
import DropDownButton from './components/MobileDropDownButton'
import { useResponsiveColor } from '../../../../hooks'
import { useResponsiveStyle } from '../../../../utils/responsive-style'
import { type ResponsiveColor } from '../../../../utils/types'
import {
  type NavigationButtonData,
  type NavigationLinksData,
  type ResponsiveValue,
} from '@makeswift/prop-controllers'
import { useStyle } from '../../../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type NavigationButtonProps = NavigationButtonData['payload'] &
  Omit<ComponentPropsWithoutRef<typeof Button>, 'color' | 'textColor'>

function ButtonLink({
  className,
  textColor,
  color,
  ...restOfProps
}: NavigationButtonProps): ReactNode {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({ margin: '8px 0' })
  return (
    <>
      {baseStyleElement}
      <Button
        {...restOfProps}
        className={clsx(baseClassName, className)}
        textColor={useResponsiveColor(textColor)}
        color={useResponsiveColor(color)}
      />
    </>
  )
}

type ContainerBaseProps = {
  className?: string
  animation?: ResponsiveValue<'coverRight' | 'coverLeft'>
  backgroundColor?: ResponsiveValue<Color> | null
  open: boolean
}

type ContainerProps = ContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ContainerBaseProps>

function Container({
  className,
  animation,
  backgroundColor,
  open,
  ...restOfProps
}: ContainerProps) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({
    position: 'fixed',
    flexDirection: 'column',
    width: '100%',
    padding: '40px 15px',
    transition: 'transform 300ms ease-in-out',
    overflowY: 'auto',
    zIndex: 9999,
    maxWidth: 575,
  })
  const { className: responsiveStylesClassName, styleElement: responsiveStylesElement } = useStyle(useResponsiveStyle(
    [animation, backgroundColor] as const,
    ([animation, backgroundColor]) => {
      if (animation == null) return { display: 'none' }

      return {
        display: 'flex',
        backgroundColor: backgroundColor == null ? 'black' : colorToString(backgroundColor),
        transform: open
          ? `translate3d(0,0,0)`
          : `translate3d(${{ coverRight: '', coverLeft: '-' }[animation]}100%, 0, 0)`,
        ...{
          coverRight: { top: 0, bottom: 0, right: 0 },
          coverLeft: { top: 0, bottom: 0, left: 0 },
        }[animation],
      }
    },
  ))
  return (
    <>
      {baseStyleElement}
      {responsiveStylesElement}
      <div
        {...restOfProps}
        className={clsx(
          baseClassName,
          responsiveStylesClassName,
          className,
        )}
      />
    </>
  )
}

type CloseIconContainerBaseProps = {
  className?: string
  color?: ResponsiveColor | null
}

type CloseIconContainerProps = CloseIconContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CloseIconContainerBaseProps>

function CloseIconContainer({ className, color, ...restOfProps }: CloseIconContainerProps) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 0,
    border: 0,
    outline: 0,
    background: 'none',
    fill: 'currentcolor',
  })
  const { className: responsiveStylesClassName, styleElement: responsiveStylesElement } = useStyle(useResponsiveStyle([color] as const, ([color]) => ({
    color: color == null ? 'rgba(161, 168, 194, 0.5)' : colorToString(color),
  })))
  return (
    <>
      {baseStyleElement}
      {responsiveStylesElement}
      <button
        {...restOfProps}
        className={clsx(
          baseClassName,
          responsiveStylesClassName,
          className,
        )}
      />
    </>
  )
}

type Props = {
  animation?: ResponsiveValue<'coverRight' | 'coverLeft'>
  backgroundColor?: ResponsiveColor | null
  closeIconColor?: ResponsiveColor | null
  links?: NavigationLinksData
  onClose?: () => unknown
  open?: boolean
}

export default function MobileMenu({
  animation,
  backgroundColor,
  open = false,
  closeIconColor,
  links = [],
  onClose = () => {},
}: Props): ReactNode {
  return (
    <Container animation={animation} backgroundColor={backgroundColor} open={open}>
      <CloseIconContainer color={closeIconColor} onClick={onClose}>
        <Times16 />
      </CloseIconContainer>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
      >
        {links.map(link => (
          <Fragment key={link.id}>
            {link.type === 'button' && (
              <ButtonLink {...link.payload} onClick={onClose}>
                {link.payload.label}
              </ButtonLink>
            )}
            {link.type === 'dropdown' && <DropDownButton {...link.payload} onClose={onClose} />}
          </Fragment>
        ))}
      </div>
    </Container>
  )
}
