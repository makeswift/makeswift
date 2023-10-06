import { NodeEntry, Descendant, Transforms, Text, Node } from 'slate'
import { MakeswiftEditor } from '../types'
import deepEqual from '../../utils/deepEqual'

function isTextEqual(a: Text, b: Text): boolean {
  const { text: aText, ...aRest } = a
  const { text: bText, ...bRest } = b

  return deepEqual(aRest, bRest)
}

/**
 * This normalization is necessary because while slate appears to use deepEqual,
 * it actually only supports a subset of deepEqual's functionality.
 * It doesn't support comparing arrays of objects.
 * This function is a copy of slate implemntation with the usage of our own deepEqual.
 */
export function normalizeSimilarText(editor: MakeswiftEditor, entry: NodeEntry): boolean {
  const [node, path] = entry

  if (Text.isText(node)) return false

  // Since we'll be applying operations while iterating, keep track of an
  // index that accounts for any added/removed nodes.
  let hasMergedNodes = false
  for (let i = node.children.length; i > 0; i--) {
    const currentNode = Node.get(editor, path)
    if (Text.isText(currentNode)) continue
    const child = currentNode.children[i] as Descendant
    const prev = currentNode.children[i - 1] as Descendant

    // Merge adjacent text nodes match.
    if (Text.isText(child) && prev != null && Text.isText(prev) && isTextEqual(child, prev)) {
      Transforms.mergeNodes(editor, { at: path.concat(i), voids: true })
      hasMergedNodes = true
    }
  }
  return hasMergedNodes
}
