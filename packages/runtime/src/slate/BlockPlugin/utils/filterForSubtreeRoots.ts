import type { Node, NodeEntry } from 'slate'
import { Path } from 'slate'

export function filterForSubtreeRoots(entries: NodeEntry<Node>[]): NodeEntry<Node>[] {
  return entries.filter(
    ([, nodePath]) =>
      !Path.ancestors(nodePath).some(ancestor => {
        return entries.some(([, path]) => Path.equals(path, ancestor))
      }),
  )
}
