import { useRef } from 'react'

import * as ReactPage from '../../state/react-page'

import {
  CheckboxDefinition,
  NumberDefinition,
  RichTextV2Definition,
  RichTextV2Control,
  ColorDefinition,
  ComboboxDefinition,
  IconRadioGroupDefinition,
  ImageDefinition,
  LinkDefinition,
  ListDefinition,
  RichTextV1Definition,
  RichTextV1Control,
  SelectDefinition,
  ShapeDefinition,
  SlotDefinition,
  SlotControl,
  StyleDefinition,
  StyleControl,
  StyleV2Definition,
  TextAreaDefinition,
  TextInputDefinition,
  unstable_TypographyDefinition,
  FontDefinition,
} from '../../controls'

import { isLegacyDescriptor } from '../../prop-controllers/descriptors'

import { useFormattedStyle } from './controls/style'
import { ControlValue } from './controls/control'
import { useSlot } from './controls/slot'
import { useRichText } from './controls/rich-text/rich-text'
import { useRichTextV2 } from './controls/rich-text-v2'

import { useStore } from './hooks/use-store'
import { useDocumentKey } from './hooks/use-document-context'
import { useSelector } from './hooks/use-selector'

import { RenderHook } from './components'
import { resolveLegacyDescriptorProp } from './legacy-controls'

type PropsValueProps = {
  element: ReactPage.ElementData
  children(props: Record<string, unknown>): JSX.Element
}

export function PropsValue({ element, children }: PropsValueProps): JSX.Element {
  const store = useStore()
  const propControllerDescriptorsRef = useRef(
    ReactPage.getComponentPropControllerDescriptors(store.getState(), element.type) ?? {},
  )
  const props = element.props as Record<string, any>
  const documentKey = useDocumentKey()

  const propControllers = useSelector(state => {
    if (documentKey == null) return null

    return ReactPage.getPropControllers(state, documentKey, element.key)
  })

  return Object.entries(propControllerDescriptorsRef.current).reduceRight(
    (renderFn, [propName, descriptor]) =>
      propsValue => {
        if (isLegacyDescriptor(descriptor)) {
          return resolveLegacyDescriptorProp(
            descriptor,
            propName,
            props[propName],
            propsValue,
            renderFn,
          )
        }

        switch (descriptor.controlType) {
          case CheckboxDefinition.type:
          case NumberDefinition.type:
          case TextInputDefinition.type:
          case TextAreaDefinition.type:
          case SelectDefinition.type:
          case ColorDefinition.type:
          case IconRadioGroupDefinition.type:
          case ImageDefinition.type:
          case ComboboxDefinition.type:
          case ShapeDefinition.type:
          case ListDefinition.type:
          case LinkDefinition.type:
          case StyleV2Definition.type:
          case unstable_TypographyDefinition.type:
          case FontDefinition.type:
            return (
              <ControlValue
                definition={descriptor}
                data={props[propName]}
                control={propControllers?.[propName]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </ControlValue>
            )

          case StyleDefinition.type: {
            const control = (propControllers?.[propName] ?? null) as StyleControl | null

            return (
              <RenderHook
                key={descriptor.controlType}
                hook={useFormattedStyle}
                parameters={[props[propName], descriptor as StyleDefinition, control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

          case RichTextV1Definition.type: {
            const control = (propControllers?.[propName] ?? null) as RichTextV1Control | null

            return (
              <RenderHook
                key={descriptor.controlType}
                hook={useRichText}
                parameters={[props[propName], control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

          case RichTextV2Definition.type: {
            const control = (propControllers?.[propName] ?? null) as RichTextV2Control | null

            return (
              <RenderHook
                key={descriptor.controlType}
                hook={useRichTextV2}
                parameters={[props[propName], descriptor as RichTextV2Definition, control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

          case SlotDefinition.type: {
            const control = (propControllers?.[propName] ?? null) as SlotControl | null

            return (
              <RenderHook
                key={descriptor.controlType}
                hook={useSlot}
                parameters={[props[propName], control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }
        }

        console.error(`Unknown control type: ${descriptor.controlType}`)
        return renderFn({ ...propsValue, [propName]: props[propName] })
      },
    children,
  )({})
}
