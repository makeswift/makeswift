import { ComponentPropsWithoutRef, Fragment } from 'react'

import {
  ResponsiveValue,
  NavigationLinksValue,
  NavigationButton as NavigationButtonValue,
} from '../../../../../prop-controllers/descriptors'
import { ColorValue as Color } from '../../../../utils/types'
import { colorToString } from '../../../../utils/colorToString'
import Times16 from '../../../../icons/times-16.svg'

import Button from '../../../Button'
import DropDownButton from './components/MobileDropDownButton'
import { ResponsiveColor } from '../../../../../runtimes/react/controls'
import { useResponsiveColor } from '../../../../hooks'
import { cx } from '@emotion/css'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { useResponsiveStyle } from '../../../../utils/responsive-style'

type NavigationButtonProps = NavigationButtonValue['payload'] &
  Omit<ComponentPropsWithoutRef<typeof Button>, 'color' | 'textColor'>

function ButtonLink({
  className,
  textColor,
  color,
  ...restOfProps
}: NavigationButtonProps): JSX.Element {
  return (
    <Button
      {...restOfProps}
      className={cx(useStyle({ margin: '8px 0' }), className)}
      textColor={useResponsiveColor(textColor)}
      color={useResponsiveColor(color)}
    />
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
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle({
          position: 'fixed',
          flexDirection: 'column',
          width: '100%',
          padding: '40px 15px',
          transition: 'transform 300ms ease-in-out',
          overflowY: 'auto',
          zIndex: 9999,
          maxWidth: 575,
        }),
        useStyle(
          useResponsiveStyle(
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
          ),
        ),
        className,
      )}
    />
  )
}

type CloseIconContainerBaseProps = {
  className?: string
  color?: ResponsiveColor | null
}

type CloseIconContainerProps = CloseIconContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CloseIconContainerBaseProps>

function CloseIconContainer({ className, color, ...restOfProps }: CloseIconContainerProps) {
  return (
    <button
      {...restOfProps}
      className={cx(
        useStyle({
          position: 'absolute',
          top: 15,
          right: 15,
          padding: 0,
          border: 0,
          outline: 0,
          background: 'none',
          fill: 'currentcolor',
        }),
        useStyle(
          useResponsiveStyle([color] as const, ([color]) => ({
            color: color == null ? 'rgba(161, 168, 194, 0.5)' : colorToString(color),
          })),
        ),
        className,
      )}
    />
  )
}

type Props = {
  animation?: ResponsiveValue<'coverRight' | 'coverLeft'>
  backgroundColor?: ResponsiveColor | null
  closeIconColor?: ResponsiveColor | null
  links?: NavigationLinksValue
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
}: Props): JSX.Element {
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
