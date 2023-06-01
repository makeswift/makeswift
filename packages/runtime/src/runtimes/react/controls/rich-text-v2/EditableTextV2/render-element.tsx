import { cx } from '@emotion/css'
import { RenderElementProps } from 'slate-react'
import {
  RichTextV2ControlDefinition,
  RichTextV2Plugin,
  RichTextV2Mode,
} from '../../../../../controls'
import { BlockType } from '../../../../../slate'
import { useStyle } from '../../../use-style'
import { ControlValue } from '../../control'

type RichTextV2ElementProps = RenderElementProps & {
  definition: RichTextV2ControlDefinition
  plugins: RichTextV2Plugin[]
}

export function RichTextV2Element({ definition, plugins, ...props }: RichTextV2ElementProps) {
  const blockStyles = [useStyle({ margin: 0 })]

  function initialRenderElement(props: RenderElementProps) {
    switch (props.element.type) {
      case BlockType.Default:
      default:
        if (definition.config.mode === RichTextV2Mode.Inline) {
          return (
            <span {...props.attributes} className={cx(...blockStyles)}>
              {props.children}
            </span>
          )
        }

        return (
          <p {...props.attributes} className={cx(...blockStyles)}>
            {props.children}
          </p>
        )
    }
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin) => (props: RenderElementProps) => {
      const { control, renderElement } = plugin

      if (control?.definition == null || renderElement == null) return renderFn(props)

      if (control.getElementValue == null) return renderElement(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getElementValue(props.element)}>
          {value => renderElement(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderElement,
  )

  return renderElement(props)
}
