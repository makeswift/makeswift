import { Editor, Element, Transforms, Text, Range, Point, Node, Path } from 'slate'
import { RichTextTypography } from '../types'
import { ElementUtils } from '../utils/element'

type ClearDeviceActiveTypographyOptions = {
  at?: Range
}

export function clearDeviceActiveTypography(
  editor: Editor,
  currentDeviceId: string,
  options?: ClearDeviceActiveTypographyOptions,
) {
  Editor.withoutNormalizing(editor, () => {
    const at = options?.at ?? editor.selection
    if (!at) return
    const atRef = Editor.rangeRef(editor, at)

    if (atRef.current) {
      // Assuming expanded cursor
      Transforms.setNodes(
        editor,
        {
          slice: true,
        },
        {
          at: atRef.current,
          match: node => Text.isText(node),
          split: true,
        },
      )
      Transforms.setNodes(
        editor,
        { slice: true },
        {
          at: atRef.current,
          match: (node, path) => {
            if (atRef.current && Element.isElement(node)) {
              const selectionEncompassesNode = Array.from(Node.descendants(node)).every(
                ([, path]) => (atRef.current ? Range.includes(atRef.current, path) : false),
              )
              console.log({
                path,
                anchor: atRef.current.anchor,
                focus: atRef.current.focus,

                a: selectionEncompassesNode,
              })

              return selectionEncompassesNode
            }
            return false
          },
          split: false,
        },
      )
    }

    if (atRef.current) {
      const nodes = Array.from(
        Editor.nodes(editor, {
          at: atRef.current,
          match: node => ('slice' in node ? node.slice === true : false),
        }),
      )


      for (const [node, path] of nodes) {
        if (Text.isText(node) || Element.isElement(node)) {
          const typography: RichTextTypography = {
            ...node.typography,
            style:
              node?.typography?.style.filter(({ deviceId }) => deviceId !== currentDeviceId) ?? [],
          }

          Transforms.setNodes(
            editor,
            {
              typography,
            },
            { at: path },
          )
        }
      }
    }

    atRef.unref()
  })
}
