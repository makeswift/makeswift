import { RenderElementProps } from 'slate-react'

import { RichTextV2Plugin } from '../../../../../controls/rich-text-v2/plugin'

import { ControlValue } from '../../control'

type RichTextV2ElementProps = RenderElementProps & {
  plugins: RichTextV2Plugin[]
}

export function RichTextV2Element({ plugins, ...props }: RichTextV2ElementProps) {
  function initialRenderElement(props: RenderElementProps) {
    return props.children
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin) => (props: RenderElementProps) => {
      const { control, renderElement } = plugin

      if (renderElement == null) return renderFn(props)

      if (control == null || control.getElementValue == null)
        return renderElement(renderFn, undefined)(props)

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
