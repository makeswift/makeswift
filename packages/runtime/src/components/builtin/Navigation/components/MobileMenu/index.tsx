import { ComponentPropsWithoutRef, Fragment } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules } from '../../../../utils/cssMediaRules'
import {
  ResponsiveValue,
  NavigationLinksValue,
  NavigationButton as NavigationButtonValue,
} from '../../../../../prop-controllers/descriptors'
import { ColorValue as Color } from '../../../../utils/types'
import { colorToString } from '../../../../utils/colorToString'
import { ReactComponent as Times16 } from '../../../../icons/times-16.svg'

import Button from '../../../Button'
import DropDownButton from './components/MobileDropDownButton'
import { ResponsiveColor } from '../../../../../runtimes/react/controls'
import { useResponsiveColor } from '../../../../hooks'

type NavigationButtonProps = NavigationButtonValue['payload'] &
  Omit<ComponentPropsWithoutRef<typeof Button>, 'color' | 'textColor'>

function NavigationButton(props: NavigationButtonProps): JSX.Element {
  const { textColor, color, ...restOfProps } = props

  return (
    <Button
      {...restOfProps}
      textColor={useResponsiveColor(textColor)}
      color={useResponsiveColor(color)}
    />
  )
}

const ButtonLink = styled(NavigationButton)`
  margin: 8px 0;
`

const Container = styled.div<{
  animation?: ResponsiveValue<'coverRight' | 'coverLeft'>
  backgroundColor?: ResponsiveValue<Color> | null
  open: boolean
}>`
  position: fixed;
  flex-direction: column;
  width: 100%;
  padding: 40px 15px;
  transition: transform 300ms ease-in-out;
  overflow-y: auto;
  z-index: 9999;
  max-width: 575px;
  ${p =>
    cssMediaRules([p.animation, p.backgroundColor] as const, ([animation, backgroundColor]) =>
      animation == null
        ? css`
            display: none;
          `
        : css`
            display: flex;
            background-color: ${backgroundColor == null ? 'black' : colorToString(backgroundColor)};
            transform: ${p.open
              ? `translate3d(0,0,0)`
              : `translate3d(${{ coverRight: '', coverLeft: '-' }[animation]}100%, 0, 0)`};
            ${{
              coverRight: { top: 0, bottom: 0, right: 0 },
              coverLeft: { top: 0, bottom: 0, left: 0 },
            }[animation]}
          `,
    )}
`

const CloseIconContainer = styled.button<{ color?: ResponsiveValue<Color> | null }>`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0;
  border: 0;
  outline: 0;
  background: none;
  fill: currentColor;
  ${p =>
    cssMediaRules(
      [p.color] as const,
      ([color]) => css`
        color: ${color == null ? 'rgba(161, 168, 194, 0.5)' : colorToString(color)};
      `,
    )}
`

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
      {/* @ts-expect-error: HTMLButtonElement `color` attribute conflicts with prop */}
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
