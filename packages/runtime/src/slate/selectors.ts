import { Editor, NodeEntry, Range } from 'slate'
import { Slate } from '@makeswift/controls'

import unhangRange from './utils/unhangRange'

export function getSelection(editor: Editor): Range {
  if (editor.selection) return unhangRange(editor, editor.selection)
  return {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  }
}

export function getBlocksInSelection(editor: Editor): NodeEntry<Slate.RootBlock>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node => Slate.isRootBlock(node),
    }),
  ).filter((entry): entry is NodeEntry<Slate.RootBlock> => Slate.isRootBlock(entry[0]))
}

export function getActiveBlockType(editor: Editor): Slate.RootBlockType | null {
  const rootBlocks = getBlocksInSelection(editor).map(([node]) => node.type)

  return rootBlocks.reduce<Slate.RootBlockType | null>(
    (a, b) => (a === b ? b : null),
    rootBlocks.at(0) ?? null,
  )
}
