import { Editor, Element, Transforms } from 'slate'
import { BlockType } from '../../controls'
import { ElementUtils } from '../utils/element'

type WrapListOptions = {
  type: typeof BlockType.UnorderedList | typeof BlockType.OrderedList
}

export function wrapList(
  editor: Editor,
  options: WrapListOptions = { type: BlockType.UnorderedList },
) {
  if (!editor.selection) return

  const nonListEntries = Array.from(
    Editor.nodes(editor, {
      at: editor.selection,
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
