import { Props, ResponsiveSelectValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride, getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'
import { Alignments, Contrast, Contrasts, Shapes, Sizes } from './context/FormContext'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import {
  ElementID,
  GapY,
  Link,
  Margin,
  ResponsiveColor,
  ResponsiveLength,
  Table,
  TextStyle,
  Width,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Form')),
    {
      type: MakeswiftComponentType.Form,
      label: 'Form',
      icon: ComponentIcon.Form,
      props: {
        id: ElementID(),
        tableId: Table(),
        fields: Props.TableFormFields(),
        submitLink: Link(props => ({
          label: 'Redirect to',
          // TODO: This option is hardcoded. We should import it from LinkPanelOptions
          options: [
            { value: 'OPEN_PAGE', label: 'Open page' },
            { value: 'OPEN_URL', label: 'Open URL' },
          ],
          hidden: props.tableId == null,
        })),
        gap: GapY(props => ({
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 10, unit: 'px' },
            },
          ],
          label: 'Gap',
          defaultValue: { value: 0, unit: 'px' },
          hidden: props.tableId == null,
        })),
        shape: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Shape',
          options: [
            { label: 'Pill', value: Shapes.PILL, icon: 'ButtonPill16' },
            { label: 'Rounded', value: Shapes.ROUNDED, icon: 'ButtonRounded16' },
            { label: 'Square', value: Shapes.SQUARE, icon: 'ButtonSquare16' },
          ],
          defaultValue: Shapes.ROUNDED,
          hidden: props.tableId == null,
        })),
        size: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Size',
          options: [
            { label: 'Small', value: Sizes.SMALL, icon: 'SizeSmall16' },
            { label: 'Medium', value: Sizes.MEDIUM, icon: 'SizeMedium16' },
            { label: 'Large', value: Sizes.LARGE, icon: 'SizeLarge16' },
          ],
          defaultValue: Sizes.MEDIUM,
          hidden: props?.tableId == null,
        })),
        contrast: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Color',
          options: [
            { label: 'Light mode', value: Contrasts.LIGHT, icon: 'Sun16' },
            { label: 'Dark mode', value: Contrasts.DARK, icon: 'Moon16' },
          ],
          defaultValue: Contrasts.LIGHT,
          hidden: props.tableId == null,
        })),
        labelTextStyle: TextStyle({ label: 'Label text style' }),
        labelTextColor: ResponsiveColor((props, device) => {
          const hidden = props.tableId == null
          const responsiveContrast = props.contrast as ResponsiveSelectValue<Contrast> | undefined
          const contrast = findBreakpointOverride<Contrast>(
            runtime.getBreakpoints(),
            responsiveContrast,
            device,
          )

          return {
            hidden,
            label: 'Label text color',
            placeholder:
              contrast?.value === Contrasts.DARK ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)',
          }
        }),
        submitTextStyle: TextStyle({ label: 'Button text style' }),
        brandColor: ResponsiveColor(props => ({
          label: 'Button color',
          placeholder: 'black',
          hidden: props.tableId == null,
          // TODO: Add hideAlphaSlider
        })),
        submitTextColor: ResponsiveColor(props => ({
          label: 'Button text color',
          placeholder: 'white',
          hidden: props.tableId == null,
        })),
        submitLabel: Props.TextInput(props => ({
          label: 'Button label',
          placeholder: 'Submit',
          hidden: props.tableId == null,
        })),
        submitVariant: Props.ResponsiveSelect(props => ({
          label: 'Button style',
          options: [
            { value: 'flat', label: 'Flat' },
            { value: 'outline', label: 'Outline' },
            { value: 'shadow', label: 'Floating' },
            { value: 'clear', label: 'Clear' },
            { value: 'blocky', label: 'Blocky' },
            { value: 'bubbly', label: 'Bubbly' },
            { value: 'skewed', label: 'Skewed' },
          ],
          defaultValue: 'flat',
          hidden: props.tableId == null,
        })),
        submitWidth: ResponsiveLength(props => ({
          label: 'Button width',
          hidden: props.tableId == null,
          // TODO: Add placeholder: { value: 'auto' }
        })),
        submitAlignment: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Button alignment',
          options: [
            { label: 'Left', value: Alignments.LEFT, icon: 'AlignLeft16' },
            { label: 'Center', value: Alignments.CENTER, icon: 'AlignCenter16' },
            { label: 'Right', value: Alignments.RIGHT, icon: 'AlignRight16' },
          ],
          defaultValue: Alignments.CENTER,
          hidden: props.tableId == null,
        })),
        width: Width({
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 550, unit: 'px' },
            },
          ],
          defaultValue: { value: 100, unit: '%' },
          format: Width.Format.ClassName,
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
