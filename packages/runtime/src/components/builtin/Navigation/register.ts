import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride, getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import {
  ControlDataTypeKey,
  Checkbox,
  Link,
  ResponsiveColor,
  ResponsiveLength,
  ResponsiveLengthPropControllerDataV1Type,
  checkboxPropControllerDataSchema,
  getCheckboxPropControllerDataBoolean,
  Margin,
  Width,
  TextStyle,
  NavigationLinks,
  NavigationLinksData,
  GapX,
  ResponsiveSelect,
  ElementID,
  Image,
  TextInput,
  type PropData,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  function isHiddenBasedOnMenuAnimation(props: Record<string, unknown>, deviceId: string): boolean {
    const mobileMenuAnimation = ResponsiveSelect.fromPropData(
      props.mobileMenuAnimation as PropData<typeof ResponsiveSelect> | undefined,
    )

    return !findBreakpointOverride(runtime.getBreakpoints(), mobileMenuAnimation, deviceId)
  }

  return runtime.registerComponent(
    lazy(() => import('./Navigation')),
    {
      type: MakeswiftComponentType.Navigation,
      label: 'Navigation',
      icon: ComponentIcon.Navigation,
      props: {
        id: ElementID(),
        links: NavigationLinks(),
        linkTextStyle: TextStyle(props => {
          const links = props.links as NavigationLinksData | undefined

          return {
            label: 'Link text style',
            hidden: links == null || links.length === 0,
          }
        }),
        showLogo: Checkbox({ preset: true, label: 'Show logo' }),
        logoFile: Image(props => ({
          label: 'Logo',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showLogo),
            ) === false,
        })),
        logoWidth: ResponsiveLength(props => ({
          // TODO(miguel): We're manually constructing the data here but should be using a factory
          // function instead. This is because the factory function currently expects a definition
          // but we don't have one to pass here. Perhaps we should make the factory function not
          // require the definition and use the latest version when a definition isn't provided.
          preset: {
            [ControlDataTypeKey]: ResponsiveLengthPropControllerDataV1Type,
            value: [
              {
                deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
                value: { value: 100, unit: 'px' },
              },
            ],
          },
          label: 'Logo width',
          min: 0,
          max: 1000,
          // TODO: This is hardcoded value, import it from LengthInputOptions
          options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showLogo),
            ) === false,
        })),
        logoAltText: TextInput(props => ({
          label: 'Logo alt text',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showLogo),
            ) === false,
        })),
        logoLink: Link(props => ({
          label: 'Logo on click',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showLogo),
            ) === false,
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
        gutter: GapX({
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
        mobileMenuAnimation: ResponsiveSelect({
          label: 'Mobile menu',
          options: [
            { value: 'coverRight', label: 'Cover from right' },
            { value: 'coverLeft', label: 'Cover from left' },
          ],
        }),
        mobileMenuOpenIconColor: ResponsiveColor((props, device) => {
          return {
            label: 'Open icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            hidden: isHiddenBasedOnMenuAnimation(props, device),
          }
        }),
        mobileMenuCloseIconColor: ResponsiveColor((props, device) => {
          return {
            label: 'Close icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            hidden: isHiddenBasedOnMenuAnimation(props, device),
          }
        }),
        mobileMenuBackgroundColor: ResponsiveColor((props, device) => {
          return {
            label: 'Menu BG color',
            placeholder: 'black',
            hidden: isHiddenBasedOnMenuAnimation(props, device),
          }
        }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
