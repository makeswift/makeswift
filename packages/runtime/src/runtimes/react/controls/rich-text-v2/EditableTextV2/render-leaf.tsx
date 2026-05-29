import { ReactNode } from 'react'
import { RenderLeafProps } from 'slate-react'
import { RichTextV2Definition } from '../../../../../controls/rich-text-v2'
import { RichTextV2Plugin } from '../../../../../controls/rich-text-v2/plugin'
import { ControlValue } from '../../control'
import { Stylesheet } from '@makeswift/controls'

type RichTextV2LeafProps = RenderLeafProps & {
  definition: RichTextV2Definition
  plugins: RichTextV2Plugin[]
  pathComponents: string[]
  parentStylesheet: Stylesheet
}

export function RichTextV2Leaf({ definition, plugins, pathComponents, parentStylesheet, ...props }: RichTextV2LeafProps) {
  function initialRenderLeaf({ attributes, children, leaf }: RenderLeafProps): ReactNode {
    return (
      <span className={leaf.className} {...attributes}>
        {children}
      </span>
    )
  }

  const renderLeaf = plugins.reduce(
    (renderFn, plugin, index) => (props: RenderLeafProps) => {
      const { control, renderLeaf } = plugin

      if (control?.definition == null || renderLeaf == null) return renderFn(props)

      if (control.getLeafValue == null) return renderLeaf(renderFn, undefined)(props)
      // @ts-expect-error - this is a property that is added by a custom Slate decorator and is used by the css runtime
      const slatePath = props.leaf._makeswiftLeafPath ?? ''
      const pseudoElementKey = parentStylesheet.key()
      const leafPathComponents = [...pathComponents, `editable`, `plugins`, `${index}`, `leaf`, slatePath]

      return (
        <ControlValue definition={control.definition} data={control.getLeafValue(props.leaf)} elementKey={pseudoElementKey} propPathComponents={leafPathComponents}>
          {value => renderLeaf(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderLeaf,
  )

  return renderLeaf(props)
}
