import { Editor, NodeEntry, Range, Text } from 'slate'
import { Slate } from '@makeswift/controls'

import { EditableBlockKey } from './BlockPlugin/types'

import unhangRange from './utils/unhangRange'
import shallowEqual from '../utils/shallowEqual'
import { isNonNullable } from '../utils/isNonNullable'

import { Breakpoints, BreakpointId, findBreakpointOverride } from '../state/modules/breakpoints'
import deepEqual from '../utils/deepEqual'
import keys from '../utils/keys'

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

export function getInlinesInSelection(editor: Editor): NodeEntry<Slate.Inline>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node => Slate.isInline(node),
    }),
  ).filter((entry): entry is NodeEntry<Slate.Inline> => Slate.isInline(entry[0]))
}

export function getActiveBlockType(editor: Editor): Slate.RootBlockType | null {
  const rootBlocks = getBlocksInSelection(editor).map(([node]) => node.type)

  return rootBlocks.reduce<Slate.RootBlockType | null>(
    (a, b) => (a === b ? b : null),
    rootBlocks.at(0) ?? null,
  )
}

export function getActiveBlockValue(editor: Editor, key: EditableBlockKey) {
  const blocks = getBlocksInSelection(editor)

  const active = blocks.map(
    ([block]) => block[key] ?? null,
  ) as (Slate.ResponsiveBlockTextAlignment | null)[]

  return active.length === 0 ? null : active.reduce((a, b) => (shallowEqual(a, b) ? b : null))
}

export function getActiveBlockDeviceOverrideValue(
  editor: Editor,
  key: EditableBlockKey,
  breakpoints: Breakpoints,
  deviceId: BreakpointId,
) {
  const active: (Slate.BlockTextAlignment | null)[] = []
  const blocks = getBlocksInSelection(editor)

  blocks.forEach(([block]) => {
    const deviceOverride =
      findBreakpointOverride<Slate.BlockTextAlignment>(breakpoints, block[key], deviceId) || null
    active.push(deviceOverride?.value ?? null)
  })

  return active.length === 0 ? null : active.reduce((a, b) => (shallowEqual(a, b) ? b : null))
}

// Typography

const concat = (a: unknown[], b: unknown[]) => a.concat(b)

// TODO: This is more cruft from trying to remove null from the typography type. This optimization is not worth it.
/**
 * This is a c/p of the intersection of the utils from the root utils folder.
 * The only change is defaulting to undefined instead of to null.
 */
export default function intersection<A extends Record<string, unknown>, B extends A>(
  a: A,
  b: B,
  isEqual: (a: unknown, b: unknown) => boolean = deepEqual,
): { [K in keyof A]: A[K] | undefined } {
  const allKeys = [...new Set([...keys(a), ...keys(b)])] as (keyof A)[]

  return allKeys.reduce(
    (acc, k) => {
      if (isEqual(a[k], b[k])) acc[k] = a[k]
      else acc[k] = undefined

      return acc
    },
    {} as { [K in keyof A]: A[K] | undefined },
  )
}

const fuseTypographyMarks = (
  values: Array<Slate.Typography | null | undefined>,
  breakpoints: Breakpoints,
): Slate.Typography => {
  const devices = [
    ...new Set(
      values
        .filter(isNonNullable)
        .map(({ style }) => style.map(({ deviceId }) => deviceId))
        .reduce(concat, []),
    ),
  ] as BreakpointId[]

  return {
    id: values.map(v => v && v.id).reduce((a, b) => (a === b ? a : undefined)) ?? undefined,
    style: devices.map(deviceId =>
      values
        .map(
          v =>
            (v && findBreakpointOverride(breakpoints, v.style, deviceId)) || {
              deviceId,
              value: {},
            },
        )
        .reduce((acc, { value }) => {
          const a = intersection(acc.value, value)
          return {
            deviceId,
            value: a,
          }
        }),
    ),
  }
}

export function getActiveTypographyMark(
  editor: Editor,
  breakpoints: Breakpoints,
): Slate.Typography {
  const active: Slate.Typography[] = []

  const textNodes = Editor.nodes(editor, {
    at: getSelection(editor),
    match: node => Text.isText(node),
  })

  for (const [node] of textNodes) {
    if (Text.isText(node) && 'typography' in node && node.typography != undefined) {
      active.push(node.typography)
    }
  }
  return active.length === 0 ? { style: [] } : fuseTypographyMarks(active, breakpoints)
}
