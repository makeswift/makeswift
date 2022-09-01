import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props, ResponsiveValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findDeviceOverride } from '../../utils/devices'
import { Alignments, Contrast, Contrasts, Shapes, Sizes } from './context/FormContext'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Form')))),
    {
      type: './components/Form/index.js',
      label: 'Form',
      icon: 'Form40',
      props: {
        id: Props.ElementID(),
        tableId: Props.Table(),
        fields: Props.TableFormFields(),
        submitLink: Props.Link(props => ({
          label: 'Redirect to',
          // TODO: This option is hardcoded. We should import it from LinkPanelOptions
          options: [
            { value: 'OPEN_PAGE', label: 'Open page' },
            { value: 'OPEN_URL', label: 'Open URL' },
          ],
          hidden: props.tableId == null,
        })),
        gap: Props.GapY(props => ({
          preset: [{ deviceId: 'desktop', value: { value: 10, unit: 'px' } }],
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
        labelTextStyle: Props.TextStyle({ label: 'Label text style' }),
        labelTextColor: Props.ResponsiveColor((props, device) => {
          const hidden = props.tableId == null
          const responsiveContrast = props.contrast as ResponsiveValue<Contrast>
          const contrast = findDeviceOverride<Contrast>(responsiveContrast, device)

          return {
            hidden,
            label: 'Label text color',
            placeholder:
              contrast?.value === Contrasts.DARK ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)',
          }
        }),
        submitTextStyle: Props.TextStyle({ label: 'Button text style' }),
        brandColor: Props.ResponsiveColor(props => ({
          label: 'Button color',
          placeholder: 'black',
          hidden: props.tableId == null,
          // TODO: Add hideAlphaSlider
        })),
        submitTextColor: Props.ResponsiveColor(props => ({
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
        submitWidth: Props.ResponsiveLength(props => ({
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
        width: Props.Width({
          preset: [{ deviceId: 'desktop', value: { value: 550, unit: 'px' } }],
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Props.Margin(),
      },
    },
  )
}
