import { Editor, Node, Path, Transforms } from 'slate'
import { BlockType } from '../../../../../../controls'
import { unwrapList } from './unwrapList'
import { ElementUtils } from './utils/element'
import { LocationUtils } from './utils/location'
import { wrapList } from './wrapList'

type ToggleListOptions = {
  type: typeof BlockType.UnorderedList | typeof BlockType.OrderedList
}

export function toggleList(
  editor: Editor,
  options: ToggleListOptions = { type: BlockType.UnorderedList },
) {
  if (!editor.selection) return
  const start = LocationUtils.getStartPath(editor.selection)
  const ancestorPath = Path.ancestors(start).at(1)
  if (!ancestorPath || !Node.has(editor, ancestorPath)) return
  const ancestor = Node.get(editor, ancestorPath)

  if (!ElementUtils.isList(ancestor)) {
    return wrapList(editor, { type: options.type })
  }

  if (ancestor.type === options.type) {
    unwrapList(editor)
  } else {
    Transforms.setNodes(editor, { type: options.type }, { at: ancestorPath })
  }
}
