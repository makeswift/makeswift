import { Editor, Location, Node, Path, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { unwrapList } from './unwrapList'
import { LocationUtils } from './utils/location'
import { wrapList } from './wrapList'
import { BlockType } from '../types'

type ToggleListOptions = {
  type: typeof BlockType.UnorderedList | typeof BlockType.OrderedList
  at?: Location
}

export function toggleList(
  editor: Editor,
  options: ToggleListOptions = { type: BlockType.UnorderedList },
) {
  const at = options.at ?? editor.selection
  if (at == null) return
  const start = LocationUtils.getStartPath(at)
  const ancestorPath = Path.ancestors(start).at(1)
  if (!ancestorPath || !Node.has(editor, ancestorPath)) return
  const ancestor = Node.get(editor, ancestorPath)

  if (!Slate.isList(ancestor)) {
    return wrapList(editor, { type: options.type, at })
  }

  if (ancestor.type === options.type) {
    unwrapList(editor, { at })
  } else {
    Transforms.setNodes(editor, { type: options.type }, { at: ancestorPath })
  }
}
