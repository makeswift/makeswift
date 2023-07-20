import { ForwardedRef, forwardRef } from 'react'
import {
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
  RichTextV2Mode,
} from '../../../../controls'
import { useStyle } from '../../use-style'
import { Descendant, Element, Text } from 'slate'
import {
  BlockPlugin,
  InlineModePlugin,
  InlinePlugin,
  LinkPlugin,
  TextAlignPlugin,
  TypographyPlugin,
  toText,
} from '../../../../slate'
import { ControlValue } from '../control'
import { RenderElementProps, RenderLeafProps } from 'slate-react'
import { RichTextV2Plugin } from '../../../../controls/rich-text-v2/plugin'

type Props = {
  text: RichTextV2ControlData
  definition: RichTextV2ControlDefinition | null
}

const ReadOnlyTextV2 = forwardRef(function ReadOnlyText(
  { text: { descendants }, definition }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const descendantsAsString = toText(descendants, definition?.config.mode ?? RichTextV2Mode.Block)

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
          plugins={
            /**
             * TODO: we are manually referencing our default plugins for each mode here because
             * Referencing the real LinkPlugin causes a circular dependency.
             * When circular dependencies calm down we should update the plugin definition to use real plugins,
             * and just use the plugins that are defined by our config.
             */
            // definition?.config?.plugins ,
            definition?.config?.mode === RichTextV2Mode.Inline
              ? [InlineModePlugin()]
              : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin(), LinkPlugin()]
          }
          descendants={descendants}
        />
      )}
    </div>
  )
})

export default ReadOnlyTextV2

function Placeholder({ text = 'Write some text...' }: { text?: string }) {
  return (
    <span
      className={useStyle({
        display: 'inline-block',
        width: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: 0.333,
        verticalAlign: 'text-top',
      })}
    >
      {text}
    </span>
  )
}

type LeafProps = {
  leaf: Text
  plugins: RichTextV2Plugin[]
}

export function LeafComponent({ plugins, ...props }: LeafProps) {
  function initialRenderLeaf({ leaf }: RenderLeafProps) {
    return <span className={leaf.className}>{leaf.text === '' ? '\uFEFF' : leaf.text}</span>
  }

  const renderLeaf = plugins.reduce(
    (renderFn, plugin) => (props: RenderLeafProps) => {
      const { control, renderLeaf } = plugin

      if (control?.definition == null || renderLeaf == null) return renderFn(props)

      if (control.getLeafValue == null) return renderLeaf(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getLeafValue(props.leaf)}>
          {value => renderLeaf(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderLeaf,
  )

  return renderLeaf({ attributes: {} as any, leaf: props.leaf, children: null, text: props.leaf })
}

type ElementProps = {
  descendant: Element
  plugins: RichTextV2Plugin[]
}

function ElementComponent({ plugins, ...props }: ElementProps) {
  function initialRenderElement(props: RenderElementProps) {
    return <Descendants descendants={props.element.children} plugins={plugins} />
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

  return renderElement({ attributes: {} as any, children: null, element: props.descendant })
}

// reimplemented from slate source for code splitting
function isText(node: Descendant): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function Descendants({
  descendants,
  plugins,
}: {
  plugins: RichTextV2Plugin[]
  descendants: Descendant[]
}) {
  return (
    <>
      {descendants.map((descendant, index) => {
        if (isText(descendant)) {
          return <LeafComponent key={index} plugins={plugins} leaf={descendant} />
        }

        return <ElementComponent key={index} descendant={descendant} plugins={plugins} />
      })}
    </>
  )
}
