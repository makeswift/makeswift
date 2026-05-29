import { RenderElementProps } from 'slate-react'

import { RichTextV2Definition } from '../../../../../controls/rich-text-v2'
import { RichTextV2Plugin } from '../../../../../controls/rich-text-v2/plugin'

import { ControlValue } from '../../control'
import { Stylesheet } from '@makeswift/controls'

type RichTextV2ElementProps = RenderElementProps & {
  definition: RichTextV2Definition
  plugins: RichTextV2Plugin[]
  pathComponents: string[]
  parentStylesheet: Stylesheet
}

export function RichTextV2Element({ definition, plugins, pathComponents, parentStylesheet, ...props }: RichTextV2ElementProps) {
  function initialRenderElement(props: RenderElementProps) {
    return props.children
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin, index) => (props: RenderElementProps) => {
      const { control, renderElement } = plugin

      if (renderElement == null) return renderFn(props)

      if (control == null || control.getElementValue == null)
        return renderElement(renderFn, undefined)(props)

      const pseudoElementKey = parentStylesheet.key()
      const elementPathComponents = [...pathComponents, `editable`, `plugins`, `${index}`, `element`]

      return (
        <ControlValue definition={control.definition} data={control.getElementValue(props.element)} elementKey={pseudoElementKey} propPathComponents={elementPathComponents}>
          {value => renderElement(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderElement,
  )

  return renderElement(props)
}
