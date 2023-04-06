import { Editor, Node, Location, Path, Transforms } from 'slate'
import { BlockType } from '../../controls'
import { ElementUtils } from '../utils/element'
import { unwrapList } from './unwrapList'
import { LocationUtils } from './utils/location'
import { wrapList } from './wrapList'

type ToggleListOptions = {
  type: typeof BlockType.UnorderedList | typeof BlockType.OrderedList
  at?: Location
}

export function toggleList(
  editor: Editor,
  options: ToggleListOptions = { type: BlockType.UnorderedList },
) {
  const at = options?.at ?? editor.selection

  if (at == null) return
  const start = LocationUtils.getStartPath(at)
  const ancestorPath = Path.ancestors(start).at(1)
  if (!ancestorPath || !Node.has(editor, ancestorPath)) return
  const ancestor = Node.get(editor, ancestorPath)

  if (!ElementUtils.isList(ancestor)) {
    wrapList(editor, { type: options.type, at: options.at })
  } else if (ancestor.type === options.type) {
    unwrapList(editor, { at: options.at })
  } else {
    Transforms.setNodes(editor, { type: options.type }, { at: ancestorPath })
  }
}
