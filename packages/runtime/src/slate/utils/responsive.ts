import { Editor, Transforms, NodeMatch, Descendant, NodeEntry } from 'slate'
import { getSelection } from '../selectors'
import { ResponsiveValue } from '../../prop-controllers'
import shallowEqual from '../../utils/shallowEqual'
import { BlockTextAlignment } from '../types'

type SetResponsiveValueOptions<T extends Descendant> = {
  match: NodeMatch<T>
  split: boolean
}

export function setResponsiveValue<T extends Descendant, K extends keyof T>(
  editor: Editor,
  key: K,
  value: T[K] | undefined | null,
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

export function responsiveShallowEqual<T>(
  a: ResponsiveValue<T> = [],
  b: ResponsiveValue<T> = [],
): ResponsiveValue<T> {
  const aObject: Record<string, BlockTextAlignment> = a.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.deviceId]: curr.value,
    }),
    {},
  )
  const bObject: Record<string, BlockTextAlignment> = b.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.deviceId]: curr.value,
    }),
    {},
  )

  const definedDevices = new Set([...a.map(a => a.deviceId), ...b.map(b => b.deviceId)])

  return Array.from(definedDevices).map(deviceId => {
    const aVal = aObject[deviceId]
    const bVal = bObject[deviceId]

    if (aVal === undefined && bVal === undefined) return { deviceId, value: undefined }

    return shallowEqual(aVal, bVal) ? { deviceId, value: aVal } : { deviceId, value: null }
  }) as ResponsiveValue<T>
}
