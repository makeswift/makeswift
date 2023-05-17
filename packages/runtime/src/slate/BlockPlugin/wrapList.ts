import { Editor, Element, Location, Span, Transforms } from 'slate'
import { ElementUtils } from '../utils/element'
import { BlockType } from '../types'

type WrapListOptions = {
  type: typeof BlockType.UnorderedList | typeof BlockType.OrderedList
  at?: Location | Span
}

export function wrapList(
  editor: Editor,
  options: WrapListOptions = { type: BlockType.UnorderedList },
) {
  const at = options.at ?? editor.selection
  if (!at) return

  const nonListEntries = Array.from(
    Editor.nodes(editor, {
      at,
      match: node => {
        return Element.isElement(node) && ElementUtils.isConvertibleToListTextNode(node)
      },
    }),
  )

  const refs = nonListEntries.map(([_, path]) => Editor.pathRef(editor, path))

  refs.forEach(ref => {
    const path = ref.current
    if (path) {
      Editor.withoutNormalizing(editor, () => {
        Transforms.setNodes(
          editor,
          { type: BlockType.ListItemChild },
          {
            at: path,
          },
        )
        Transforms.wrapNodes(editor, ElementUtils.createListItem(), {
          match: node => ElementUtils.isListItemChild(node),
          at: path,
        })
        Transforms.wrapNodes(editor, ElementUtils.createList(options.type), {
          at: path,
        })
      })
    }
    ref.unref()
  })
}
