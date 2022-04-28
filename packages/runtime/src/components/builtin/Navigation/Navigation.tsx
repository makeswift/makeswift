import { ComponentPropsWithoutRef, forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { cx } from '@emotion/css'

import { ReactComponent as MobileMenu28 } from '../../icons/mobile-menu-28.svg'

import GutterContainer from '../../shared/GutterContainer'
import Image from '../Image'
import Button from '../Button'
import LinksPlaceholder from './components/LinksPlaceholder'
import DropDownButton from './components/DropDownButton'
import MobileMenu from './components/MobileMenu'
import {
  ResponsiveValue,
  CheckboxValue,
  ElementIDValue,
  GapXValue,
  ImageValue,
  LinkValue,
  MarginValue,
  NavigationLinksValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveLengthValue,
  ResponsiveSelectValue,
  TextInputValue,
  TextStyleValue,
  NavigationButton as NavigationButtonValue,
} from '../../../prop-controllers/descriptors'
import { cssMargin, cssMediaRules, cssTextStyle } from '../../utils/cssMediaRules'
import { ColorValue as Color } from '../../utils/types'
import { colorToString } from '../../utils/colorToString'
import { ReactRuntime } from '../../../react'
import { Props } from '../../../prop-controllers'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { findDeviceOverride } from '../../utils/devices'
import { useColor } from '../../hooks'

type Props = {
  id?: ElementIDValue
  links?: NavigationLinksValue
  linkTextStyle?: TextStyleValue
  showLogo?: CheckboxValue
  logoFile?: ImageValue
  logoWidth?: ResponsiveLengthValue
  logoAltText?: TextInputValue
  logoLink?: LinkValue
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: GapXValue
  mobileMenuAnimation?: ResponsiveSelectValue<'coverRight' | 'coverLeft'>
  mobileMenuOpenIconColor?: ResponsiveColor | null
  mobileMenuCloseIconColor?: ResponsiveColor | null
  mobileMenuBackgroundColor?: ResponsiveColor | null
  width?: string
  margin?: MarginValue
}

const Container = styled.nav<{
  margin: Props['margin']
  textStyle: Props['linkTextStyle']
  gutter: Props['gutter']
}>`
  display: flex;
  align-items: center;
  ${cssMargin()}
  ${cssTextStyle()}
  ${p =>
    cssMediaRules(
      [p.gutter] as const,
      ([gutter = { value: 0, unit: 'px' }]) => css`
        gap: ${gutter.value}${gutter.unit};
      `,
    )}
`

const LinksContainer = styled.div<{
  alignment: Props['alignment']
  mobileMenuAnimation: Props['mobileMenuAnimation']
}>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${p =>
    cssMediaRules(
      [p.alignment, p.mobileMenuAnimation] as const,
      ([alignment = 'flex-end', mobileMenuAnimation]) => css`
        display: ${mobileMenuAnimation == null ? 'flex' : 'none'};
        justify-content: ${alignment};
      `,
    )}
`

const OpenIconContainer = styled.button<{
  mobileMenuAnimation: Props['mobileMenuAnimation']
  alignment: Props['alignment']
  color: ResponsiveValue<Color> | null | undefined
}>`
  display: none;
  flex-grow: 1;
  align-items: center;
  background: none;
  outline: 0;
  border: 0;
  padding: 0;
  fill: currentColor;
  ${p =>
    cssMediaRules(
      [p.mobileMenuAnimation, p.alignment, p.color] as const,
      ([mobileMenuAnimation, alignment = 'flex-end', color]) => css`
        display: ${mobileMenuAnimation == null ? 'none' : 'flex'};
        justify-content: ${alignment};
        color: ${color == null ? 'rgba(161, 168, 194, 0.5)' : colorToString(color)};
      `,
    )}
`

type NavigationButtonProps = NavigationButtonValue['payload'] &
  Omit<ComponentPropsWithoutRef<typeof Button>, 'color' | 'textColor'>

function NavigationButton(props: NavigationButtonProps): JSX.Element {
  const { textColor, color, ...restOfProps } = props

  return <Button {...restOfProps} textColor={useColor(textColor)} color={useColor(color)} />
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
      className={cx(width)}
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
          // @ts-expect-error: HTMLButtonElement `color` attribute conflicts with prop
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

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(Navigation, {
    type: './components/Navigation/index.js',
    label: 'Navigation',
    icon: 'Navigation40',
    props: {
      id: Props.ElementID(),
      links: Props.NavigationLinks(),
      linkTextStyle: Props.TextStyle(props => {
        const links = props.links as NavigationLinksValue

        return {
          label: 'Link text style',
          hidden: links == null || links.length === 0,
        }
      }),
      showLogo: Props.Checkbox({ preset: true, label: 'Show logo' }),
      logoFile: Props.Image(props => ({
        label: 'Logo',
        hidden: props.showLogo === false,
      })),
      logoWidth: Props.ResponsiveLength(props => ({
        preset: [{ deviceId: 'desktop', value: { value: 100, unit: 'px' } }],
        label: 'Logo width',
        min: 0,
        max: 1000,
        // TODO: This is hardcoded value, import it from LengthInputOptions
        options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
        hidden: props.showLogo === false,
      })),
      logoAltText: Props.TextInput(props => ({
        label: 'Logo alt text',
        hidden: props.showLogo === false,
      })),
      logoLink: Props.Link(props => ({
        label: 'Logo on click',
        hidden: props.showLogo === false,
      })),
      alignment: Props.ResponsiveIconRadioGroup({
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'flex-start', icon: 'AlignLeft16' },
          { label: 'Center', value: 'center', icon: 'AlignCenter16' },
          { label: 'End', value: 'flex-end', icon: 'AlignRight16' },
        ],
        defaultValue: 'flex-end',
      }),
      gutter: Props.GapX({
        preset: [{ deviceId: 'desktop', value: { value: 10, unit: 'px' } }],
        label: 'Link gap',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: { value: 0, unit: 'px' },
      }),
      mobileMenuAnimation: Props.ResponsiveSelect({
        label: 'Mobile menu',
        options: [
          { value: 'coverRight', label: 'Cover from right' },
          { value: 'coverLeft', label: 'Cover from left' },
        ],
      }),
      mobileMenuOpenIconColor: Props.ResponsiveColor((props, device) => {
        const mobileMenuAnimation = props.mobileMenuAnimation as ResponsiveValue<string>
        const hidden = !findDeviceOverride(mobileMenuAnimation, device)

        return {
          label: 'Open icon color',
          placeholder: 'rgba(161, 168, 194, 0.5)',
          hidden,
        }
      }),
      mobileMenuCloseIconColor: Props.ResponsiveColor((props, device) => {
        const mobileMenuAnimation = props.mobileMenuAnimation as ResponsiveValue<string>
        const hidden = !findDeviceOverride(mobileMenuAnimation, device)

        return {
          label: 'Close icon color',
          placeholder: 'rgba(161, 168, 194, 0.5)',
          hidden,
        }
      }),
      mobileMenuBackgroundColor: Props.ResponsiveColor((props, device) => {
        const mobileMenuAnimation = props.mobileMenuAnimation as ResponsiveValue<string>
        const hidden = !findDeviceOverride(mobileMenuAnimation, device)

        return {
          label: 'Menu BG color',
          placeholder: 'black',
          hidden,
        }
      }),
      width: Props.Width({
        format: Props.Width.Formats.ClassName,
        defaultValue: { value: 100, unit: '%' },
      }),
      margin: Props.Margin(),
    },
  })
}
