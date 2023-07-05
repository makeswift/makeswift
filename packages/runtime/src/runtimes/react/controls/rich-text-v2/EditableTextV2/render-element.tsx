import { RenderElementProps } from 'slate-react'
import { RichTextV2ControlDefinition, RichTextV2Plugin } from '../../../../../controls'
import { ControlValue } from '../../control'

type RichTextV2ElementProps = RenderElementProps & {
  definition: RichTextV2ControlDefinition
  plugins: RichTextV2Plugin[]
}

export function RichTextV2Element({ definition, plugins, ...props }: RichTextV2ElementProps) {
  function initialRenderElement(props: RenderElementProps) {
    return props.children
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
