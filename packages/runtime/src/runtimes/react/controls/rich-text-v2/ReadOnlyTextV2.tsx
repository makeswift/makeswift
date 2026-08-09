import { type ReactNode, type ForwardedRef, forwardRef, useMemo } from 'react'
import { type Descendant, type Element, type Text } from 'slate'
import { type RenderElementProps, type RenderLeafProps } from 'slate-react'

import { type ConfigType } from '@makeswift/controls'

import {
  type RichTextDataV2,
  RichTextV2Definition,
  RichText,
} from '../../../../controls/rich-text-v2'
import { toText } from '../../../../slate/utils'
import { RichTextV2Plugin } from '../../../../controls/rich-text-v2/plugin'

import { ControlValue } from '../control'
import { useStyle } from '../../css-runtime/hooks/use-style'
import { Stylesheet } from '@makeswift/controls'

type Props = {
  text: RichTextDataV2 | undefined
  config: ConfigType<RichTextV2Definition> | undefined
  parentStylesheet: Stylesheet
}

const ReadOnlyTextV2 = forwardRef(function ReadOnlyText(
  { text, config, parentStylesheet }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const descendants = useMemo(() => text?.descendants ?? [], [text?.descendants])
  const plugins = useMemo(() => (config ? new RichTextV2Definition(config).plugins : []), [config])
  const descendantsAsString = toText(descendants, config?.mode ?? RichText.Mode.Block)

  return (
    <div
      ref={ref}
      style={{
        /**
         * These are the default styles that Slate uses for its editable div.
         * https://github.com/ianstormtaylor/slate/blob/4bd15ed3950e3a0871f5d0ecb391bb637c05e59d/packages/slate-react/src/components/editable.tsx
         * Search for `disableDefaultStyles`
         */
        position: 'relative',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {descendantsAsString === '' ? (
        <Placeholder />
      ) : (
        <Descendants
          pathComponents={[]}
          parentStylesheet={parentStylesheet}
          plugins={plugins}
          descendants={descendants}
        />
      )}
    </div>
  )
})

export default ReadOnlyTextV2

function Placeholder({ text = 'Write some text...' }: { text?: string }) {
  const { className, styleElement } = useStyle({
    display: 'inline-block',
    width: 0,
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    opacity: 0.333,
    verticalAlign: 'text-top',
  })
  return (
    <>
      {styleElement}
      <span className={className}>{text}</span>
    </>
  )
}

type LeafProps = {
  pathComponents: string[]
  parentStylesheet: Stylesheet
  leaf: Text
  plugins: RichTextV2Plugin[]
}

export function LeafComponent({ plugins, pathComponents, parentStylesheet, ...props }: LeafProps) {
  function initialRenderLeaf({ leaf }: RenderLeafProps): ReactNode {
    return <span className={leaf.className}>{leaf.text === '' ? '\uFEFF' : leaf.text}</span>
  }

  const renderLeaf = plugins.reduce(
    (renderFn, plugin, index) =>
      function RenderLeafPlugin(props: RenderLeafProps) {
        const { control, renderLeaf } = plugin

        if (control?.definition == null || renderLeaf == null) return renderFn(props)

        if (control.getLeafValue == null) return renderLeaf(renderFn, undefined)(props)

        const pseudoElementKey = parentStylesheet.key()
        const leafPathComponents = [...pathComponents, `plugins`, `${index}`, `leaf`]

        return (
          <ControlValue
            definition={control.definition}
            data={control.getLeafValue(props.leaf)}
            elementKey={pseudoElementKey}
            propPathComponents={leafPathComponents}
          >
            {value => renderLeaf(renderFn, value)(props)}
          </ControlValue>
        )
      },
    initialRenderLeaf,
  )

  return renderLeaf({ attributes: {} as any, leaf: props.leaf, children: null, text: props.leaf })
}

type ElementProps = {
  pathComponents: string[]
  parentStylesheet: Stylesheet
  descendant: Element
  plugins: RichTextV2Plugin[]
}

function ElementComponent({ plugins, pathComponents, parentStylesheet, ...props }: ElementProps) {
  function initialRenderElement(props: RenderElementProps): ReactNode {
    return (
      <Descendants
        descendants={props.element.children}
        plugins={plugins}
        pathComponents={pathComponents}
        parentStylesheet={parentStylesheet}
      />
    )
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin, index) =>
      function RenderElementPlugin(props: RenderElementProps) {
        const { control, renderElement } = plugin

        if (control?.definition == null || renderElement == null) return renderFn(props)

        if (control.getElementValue == null) return renderElement(renderFn, undefined)(props)

        const pseudoElementKey = parentStylesheet.key()
        const elementPathComponents = [...pathComponents, `plugins`, `${index}`, `element`]

        return (
          <ControlValue
            definition={control.definition}
            data={control.getElementValue(props.element)}
            elementKey={pseudoElementKey}
            propPathComponents={elementPathComponents}
          >
            {value => renderElement(renderFn, value)(props)}
          </ControlValue>
        )
      },
    initialRenderElement,
  )

  return renderElement({ attributes: {} as any, children: null, element: props.descendant })
}

// reimplemented from slate source for code splitting
function isText(node: Descendant): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function Descendants({
  pathComponents,
  parentStylesheet,
  descendants,
  plugins,
}: {
  pathComponents: string[]
  parentStylesheet: Stylesheet
  plugins: RichTextV2Plugin[]
  descendants: Descendant[]
}) {
  return (
    <>
      {descendants.map((descendant, index) => {
        const descendantPathComponents = [...pathComponents, `descendants`, `${index}`]
        if (isText(descendant)) {
          return (
            <LeafComponent
              key={index}
              plugins={plugins}
              leaf={descendant}
              parentStylesheet={parentStylesheet}
              pathComponents={descendantPathComponents}
            />
          )
        }

        return (
          <ElementComponent
            key={index}
            descendant={descendant}
            plugins={plugins}
            pathComponents={descendantPathComponents}
            parentStylesheet={parentStylesheet}
          />
        )
      })}
    </>
  )
}
