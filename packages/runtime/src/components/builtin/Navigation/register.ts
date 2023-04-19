import dynamic from 'next/dynamic'
import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { NavigationLinksValue, ResponsiveValue } from '../../../prop-controllers/descriptors'
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride, getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Navigation')))),
    {
      type: MakeswiftComponentType.Navigation,
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
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 100, unit: 'px' },
            },
          ],
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
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 10, unit: 'px' },
            },
          ],
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
          const hidden = !findBreakpointOverride(
            runtime.getBreakpoints(),
            mobileMenuAnimation,
            device,
          )

          return {
            label: 'Open icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            hidden,
          }
        }),
        mobileMenuCloseIconColor: Props.ResponsiveColor((props, device) => {
          const mobileMenuAnimation = props.mobileMenuAnimation as ResponsiveValue<string>
          const hidden = !findBreakpointOverride(
            runtime.getBreakpoints(),
            mobileMenuAnimation,
            device,
          )

          return {
            label: 'Close icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            hidden,
          }
        }),
        mobileMenuBackgroundColor: Props.ResponsiveColor((props, device) => {
          const mobileMenuAnimation = props.mobileMenuAnimation as ResponsiveValue<string>
          const hidden = !findBreakpointOverride(
            runtime.getBreakpoints(),
            mobileMenuAnimation,
            device,
          )

          return {
            label: 'Menu BG color',
            placeholder: 'black',
            hidden,
          }
        }),
        width: Props.Width({
          format: Props.Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
      },
    },
  )
}
