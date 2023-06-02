import { Editor, Transforms, NodeMatch, Descendant, NodeEntry } from 'slate'
import { getSelection } from '../selectors'
import deepEqual from '../../utils/deepEqual'

type SetResponsiveValueOptions<T extends Descendant> = {
  match: NodeMatch<T>
  split: boolean
}

export function setResponsiveValue<T extends Descendant, K extends keyof T>(
  editor: Editor,
  key: K,
  value: T[K] | undefined,
  options: SetResponsiveValueOptions<T>,
) {
  Editor.withoutNormalizing(editor, () => {
    const at = getSelection(editor)
    if (!at) return
    const atRef = Editor.rangeRef(editor, at)

    if (atRef.current) {
      Transforms.setNodes<Descendant>(
        editor,
        {
          slice: true,
        },
        {
          at: atRef.current,
          match: options.match,
          split: options.split,
        },
      )
    }

    if (atRef.current) {
      const nodesToUpdate = Array.from(
        Editor.nodes(editor, {
          at: atRef.current,
          match: (node, path) => options.match(node, path) && node.slice === true,
        }),
      )

      for (const [, path] of nodesToUpdate) {
        Transforms.setNodes(
          editor,
          {
            [key]: value,
          },
          { at: path },
        )
      }
    }

    atRef.unref()
  })
}

type GetResponsiveValueOptions<T extends Descendant> = {
  match: NodeMatch<T>
}

export function getResponsiveValue<T extends Descendant, K extends keyof T>(
  editor: Editor,
  key: K,
  options: GetResponsiveValueOptions<T>,
): T[K] | undefined {
  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: options?.match,
    }),
  )
    .filter(([node, path]) => options.match(node, path))
    .map(([node]) => node[key]) as (T[K] | undefined)[]

  const value =
    matchingValues.length === 0
      ? undefined
      : matchingValues.reduce((a, b) => (deepEqual(a, b) ? b : undefined))

  return value
}

type NormalizeResponsiveValueOptions<T extends Descendant> = {
  match: NodeMatch<T>
}

export function normalizeResponsiveValue<T extends Descendant, K extends keyof T & string>(
  editor: Editor,
  key: K,
  options: NormalizeResponsiveValueOptions<T>,
) {
  return (entry: NodeEntry) => {
    const [node, path] = entry

    if (!options.match(node, path)) {
      return false
    }

    const responsiveValue = node?.[key]

    if (Array.isArray(responsiveValue) && responsiveValue.length === 0) {
      Transforms.unsetNodes(editor, key, { at: path })
      return true
    }

    if (node?.slice != null) {
      Transforms.unsetNodes(editor, 'slice', { at: path })
      return true
    }

    return false
  }
}
