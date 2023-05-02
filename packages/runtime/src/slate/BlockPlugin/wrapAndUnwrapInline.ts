import { ElementUtils } from '../utils/element'
import { Editor, Range, Element, Text, Path, Transforms, NodeEntry } from 'slate'
import { Inline, InlineType } from '../../controls'

/**
 * The `Editor.unhangeRange` within Slate early exits if `Path.hasPrevious(end.path)` ie if this isn't a root block.
 * Unfortunately when you `setNode(..., {split:true})` or `wrapNodes()` you also have a hanging selection, but not in the root position.
 *
 * This c/p removes the `Path.hasPrevious(end.path)` from the early exit but it the same otherwise
 */
function unhangRange(editor: Editor, range: Range): Range {
  // eslint-disable-next-line prefer-const
  let [start, end] = Range.edges(range)
  // PERF: exit early if we can guarantee that the range isn't hanging.
  if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range)) {
    return range
  }

  const endBlock = Editor.above(editor, {
    at: end,
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  })
  const blockPath = endBlock ? endBlock[1] : []
  const first = Editor.start(editor, start)
  const before = { anchor: first, focus: end }
  let skip = true

  for (const [node, path] of Editor.nodes(editor, {
    at: before,
    match: Text.isText,
    reverse: true,
  })) {
    if (skip) {
      skip = false
      continue
    }

    if (node.text !== '' || Path.isBefore(path, blockPath)) {
      end = { path, offset: node.text.length }
      break
    }
  }

  return { anchor: start, focus: end }
}

export default unhangRange

export function getSelection(editor: Editor): Range {
  if (editor.selection) return unhangRange(editor, editor.selection)
  return {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  }
}

export function unwrapInline(editor: Editor, type: InlineType) {
  Transforms.unwrapNodes(editor, {
    match: node => ElementUtils.isInline(node) && node.type === type,
    at: getSelection(editor),
  })
}
export function wrapInline(editor: Editor, inline: Inline) {
  Transforms.wrapNodes(editor, inline, {
    at: getSelection(editor),
    split: true,
  })
}

export function getInlinesInSelection(editor: Editor): NodeEntry<Inline>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node => ElementUtils.isInline(node),
    }),
  ).filter((entry): entry is NodeEntry<Inline> => ElementUtils.isInline(entry[0]))
}
