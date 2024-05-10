'use client'

import { ComponentPropsWithoutRef, ForwardedRef, forwardRef, useState } from 'react'

import { MobileMenu28 } from '../../icons/MobileMenu28'

import GutterContainer from '../../shared/GutterContainer'
import Image from '../Image'
import Button from '../Button'
import LinksPlaceholder from './components/LinksPlaceholder'
import DropDownButton from './components/DropDownButton'
import MobileMenu from './components/MobileMenu'
import { ResponsiveIconRadioGroupValue } from '../../../prop-controllers/descriptors'
import {
  ImageData,
  LinkData,
  NavigationButtonData,
  NavigationLinksData,
  ResponsiveGapData,
  ResponsiveLengthData,
  ResponsiveTextStyleData,
  ResponsiveValue,
  type ResponsiveSelectValue,
} from '@makeswift/prop-controllers'

import { ColorValue as Color } from '../../utils/types'
import { colorToString } from '../../utils/colorToString'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { useResponsiveColor } from '../../hooks'
import { cx } from '@emotion/css'
import { useResponsiveStyle, useResponsiveTextStyle } from '../../utils/responsive-style'
import { useStyle } from '../../../runtimes/react/use-style'

type Props = {
  id?: string
  links?: NavigationLinksData
  linkTextStyle?: ResponsiveTextStyleData
  showLogo?: boolean
  logoFile?: ImageData
  logoWidth?: ResponsiveLengthData
  logoAltText?: string
  logoLink?: LinkData
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: ResponsiveGapData
  mobileMenuAnimation?: ResponsiveSelectValue<'coverRight' | 'coverLeft'>
  mobileMenuOpenIconColor?: ResponsiveColor | null
  mobileMenuCloseIconColor?: ResponsiveColor | null
  mobileMenuBackgroundColor?: ResponsiveColor | null
  width?: string
  margin?: string
}

type ContainerBaseProps = {
  width?: string
  margin?: string
  textStyle: Props['linkTextStyle']
  gutter: Props['gutter']
}

type ContainerProps = ContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'nav'>, keyof ContainerBaseProps>

const Container = forwardRef(function Container(
  { className, width, margin, textStyle, gutter, ...restOfProps }: ContainerProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <nav
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ display: 'flex', alignItems: 'center' }),
        width,
        margin,
        useStyle(useResponsiveTextStyle(textStyle)),
        useStyle(
          useResponsiveStyle([gutter] as const, ([gutter = { value: 0, unit: 'px' }]) => ({
            gap: `${gutter.value}${gutter.unit}`,
          })),
        ),
        className,
      )}
    />
  )
})

type LinksContainerBaseProps = {
  alignment: Props['alignment']
  mobileMenuAnimation: Props['mobileMenuAnimation']
}

type LinksContainerProps = LinksContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof LinksContainerBaseProps>

function LinksContainer({
  className,
  alignment,
  mobileMenuAnimation,
  ...restOfProps
}: LinksContainerProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle({
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
        }),
        useStyle(
          useResponsiveStyle(
            [alignment, mobileMenuAnimation] as const,
            ([alignment = 'flex-end', mobileMenuAnimation]) => ({
              display: mobileMenuAnimation == null ? 'flex' : 'none',
              justifyContent: alignment,
            }),
          ),
        ),
        className,
      )}
    />
  )
}

type OpenIconContainerBaseProps = {
  mobileMenuAnimation: Props['mobileMenuAnimation']
  alignment: Props['alignment']
  color: ResponsiveValue<Color> | null | undefined
}

type OpenIconContainerProps = OpenIconContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof OpenIconContainerBaseProps>

function OpenIconContainer({
  className,
  mobileMenuAnimation,
  alignment,
  color,
  ...restOfProps
}: OpenIconContainerProps) {
  return (
    <button
      {...restOfProps}
      className={cx(
        useStyle({
          display: 'none',
          flexGrow: 1,
          alignItems: 'center',
          background: 'none',
          outline: 0,
          border: 0,
          padding: 0,
          fill: 'currentcolor',
        }),
        useStyle(
          useResponsiveStyle(
            [mobileMenuAnimation, alignment, color] as const,
            ([mobileMenuAnimation, alignment = 'flex-end', color]) => ({
              display: mobileMenuAnimation == null ? 'none' : 'flex',
              justifyContent: alignment,
              color: color == null ? 'rgba(161, 168, 194, 0.5)' : colorToString(color),
            }),
          ),
        ),
        className,
      )}
    />
  )
}

type NavigationButtonProps = NavigationButtonData['payload'] &
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

const placeholder = {
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='93.12' height='36' viewBox='0 0 93.12 36'%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath d='M18,0A18,18,0,1,1,0,18,18,18,0,0,1,18,0ZM49.36,21.94h6.36V24H46.8V10h2.56Zm9.06.72a4.88,4.88,0,0,1-1.64-3.72,5,5,0,0,1,1.64-3.74,5.57,5.57,0,0,1,7.7,0,5.09,5.09,0,0,1,.26,7.18l-.26.26a5.56,5.56,0,0,1-7.7,0Zm1.68-6a3.39,3.39,0,0,0,0,4.52,3,3,0,0,0,4.24.08l.08-.08a3.39,3.39,0,0,0,0-4.52,3,3,0,0,0-4.24-.08Zm10,10.68,1-1.92a5.28,5.28,0,0,0,3.3,1.22,3.6,3.6,0,0,0,2.32-.72,2.73,2.73,0,0,0,.9-2.26V22.5a3.61,3.61,0,0,1-1.45,1.26,4.35,4.35,0,0,1-2,.46,4.57,4.57,0,0,1-3.58-1.54A5.48,5.48,0,0,1,69.2,18.9a5.42,5.42,0,0,1,1.36-3.74,4.64,4.64,0,0,1,3.62-1.5,4,4,0,0,1,3.44,1.72v-1.5h2.46v9a6.13,6.13,0,0,1-1.43,4.46,5.27,5.27,0,0,1-4,1.44,7.09,7.09,0,0,1-4.53-1.42Zm1.54-8.44a3.4,3.4,0,0,0,.82,2.3,2.72,2.72,0,0,0,2.17.94,3.13,3.13,0,0,0,1.21-.22,2.89,2.89,0,0,0,1-.62,3.08,3.08,0,0,0,.63-1,3.62,3.62,0,0,0,.21-1.3,4,4,0,0,0-.23-1.33,3.3,3.3,0,0,0-.63-1.05,2.74,2.74,0,0,0-1-.68,3.35,3.35,0,0,0-1.25-.24,2.92,2.92,0,0,0-1.2.24,2.58,2.58,0,0,0-.93.67,3,3,0,0,0-.59,1,3.89,3.89,0,0,0-.19,1.31ZM83.8,22.66a4.88,4.88,0,0,1-1.64-3.72A5,5,0,0,1,83.8,15.2a5.57,5.57,0,0,1,7.7,0,5.09,5.09,0,0,1,.26,7.18,3.19,3.19,0,0,1-.26.26,5.56,5.56,0,0,1-7.7,0Zm1.68-6a3.39,3.39,0,0,0,0,4.52,3,3,0,0,0,4.24.08l.08-.08a3.39,3.39,0,0,0,0-4.52,3,3,0,0,0-4.24-.08Z' fill='%23a1a8c2' opacity='0.4' style='isolation: isolate'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A",
  dimensions: { width: 93, height: 36 },
}

const Navigation = forwardRef<HTMLDivElement, Props>(function Navigation(
  {
    id,
    links = [],
    linkTextStyle,
    showLogo,
    logoFile,
    logoWidth,
    logoAltText,
    logoLink,
    alignment,
    gutter,
    mobileMenuAnimation,
    mobileMenuOpenIconColor,
    mobileMenuCloseIconColor,
    mobileMenuBackgroundColor,
    width,
    margin,
  },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Container
      ref={ref}
      id={id}
      width={width}
      margin={margin}
      textStyle={linkTextStyle}
      gutter={gutter}
    >
      {showLogo === true && (
        <Image
          altText={logoAltText}
          file={logoFile}
          link={logoLink}
          placeholder={placeholder}
          width={logoWidth}
        />
      )}
      <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
        <LinksContainer alignment={alignment} mobileMenuAnimation={mobileMenuAnimation}>
          {links.length > 0 ? (
            links.map((link, i) => (
              <GutterContainer
                key={link.id}
                gutter={gutter}
                first={i === 0}
                last={i === links.length - 1}
              >
                {link.type === 'button' && (
                  <NavigationButton {...link.payload}>{link.payload.label}</NavigationButton>
                )}
                {link.type === 'dropdown' && <DropDownButton {...link.payload} />}
              </GutterContainer>
            ))
          ) : (
            <LinksPlaceholder gutter={gutter} />
          )}
        </LinksContainer>
        <OpenIconContainer
          alignment={alignment}
          color={mobileMenuOpenIconColor}
          mobileMenuAnimation={mobileMenuAnimation}
          onClick={() => setIsOpen(true)}
        >
          <MobileMenu28 />
        </OpenIconContainer>
        <MobileMenu
          animation={mobileMenuAnimation}
          backgroundColor={mobileMenuBackgroundColor}
          closeIconColor={mobileMenuCloseIconColor}
          links={links}
          onClose={() => setIsOpen(false)}
          open={isOpen}
        />
      </div>
    </Container>
  )
})

export default Navigation
