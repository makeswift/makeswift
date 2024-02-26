import { MakeswiftEditor } from '../types'
import { Editor, Element, NodeEntry, Transforms, Node, Text } from 'slate'
import { RichTextTypography } from '../types'
import keys from '../../utils/keys'
import deepEqual from '../../utils/deepEqual'
import { shallowMergeTypographies } from './normalizeTypographyDown'

function shallowAnd<A extends Record<string, unknown>, B extends Record<string, unknown>>(
  a: A,
  b: B,
): A & B {
  const bKeys = keys(b)
  const aPrime = { ...a } as A & B
  const and = {} as A & B

  bKeys.forEach(key => {
    if (deepEqual(aPrime[key], b[key])) and[key] = aPrime[key]
  })

  return and
}

function shallowAndTypographies(...typographies: RichTextTypography[]): RichTextTypography {
  return {
    id: typographies.every(typography => typography?.id === typographies.at(0)?.id)
      ? typographies.at(0)?.id
      : undefined,
    style: [
      ...new Set(
        typographies.flatMap(typography => typography?.style.map(node => node.deviceId) ?? []),
      ),
    ].flatMap(deviceId => {
      const stylesForThisDevice = typographies
        .map(typography => typography.style.find(s => s.deviceId === deviceId)?.value)
        .filter((typography): typography is RichTextTypography['style'][number]['value'] =>
          Boolean(typography),
        )

      if (typographies.length !== stylesForThisDevice.length) return []

      const value = stylesForThisDevice.reduce((acc, curr) => {
        return shallowAnd(acc, curr)
      }, stylesForThisDevice.at(0) as RichTextTypography['style'][number]['value'])

      if (value == null || Object.keys(value).length === 0) {
        return []
      }

      return [
        {
          deviceId,
          value,
        },
      ]
    }),
  }
}

function shallowInverseAnd<A extends Record<string, unknown>, B extends Record<string, unknown>>(
  a: A,
  b: B,
): A & B {
  const bKeys = Array.from(new Set([...keys(b), ...keys(a)]))
  const aPrime = { ...a } as A & B
  const bPrime = { ...b } as A & B
  const xor = {} as A & B

  bKeys.forEach(key => {
    if (!deepEqual(aPrime[key], bPrime[key as any])) xor[key] = aPrime[key]
  })

  return xor
}

function shallowInverseAndTypographies(
  a: RichTextTypography,
  b: RichTextTypography,
): RichTextTypography {
  const typography = { style: [] } as RichTextTypography
  if (a?.id !== b.id) {
    typography.id = a?.id
  }

  if (a && a.style.length > 0) {
    const styles: RichTextTypography['style'] = []
    for (const style of a.style) {
      const bDeviceTypography = b.style.find(s => s.deviceId === style.deviceId)
      if (bDeviceTypography == null) {
        styles.push(style)
      } else {
        const uniquePropertiesOfA = shallowInverseAnd(style.value, bDeviceTypography.value)

        if (Object.keys(uniquePropertiesOfA).length > 0) {
          styles.push({
            deviceId: style.deviceId,
            value: uniquePropertiesOfA,
          })
        }
      }
    }
    typography.style = styles
  }

  return typography
}

/**
 * If a text is empty then don't include it in our comparison.
 */
function isException(node: Node): boolean {
  return Text.isText(node) && node.text === ''
}

export function normalizeTypographyUp(editor: MakeswiftEditor, entry: NodeEntry): boolean {
  const [node, path] = entry
  if (Element.isElement(node) && node.children.length) {
    const typographiesOfChildren = node.children
      .filter(child => !isException(child))
      .map(child => child.typography)

    const definedTypographiesOfChildren = typographiesOfChildren.filter(
      (typography): typography is RichTextTypography => Boolean(typography),
    )
    if (typographiesOfChildren.length === definedTypographiesOfChildren.length) {
      let sharedTypography: RichTextTypography = shallowAndTypographies(
        ...definedTypographiesOfChildren,
      )

      if (sharedTypography.style.length > 0 || sharedTypography.id != null) {
        const rootTypography: RichTextTypography = shallowMergeTypographies(
          sharedTypography,
          node.typography,
        )
        Editor.withoutNormalizing(editor, () => {
          Transforms.setNodes(editor, { typography: rootTypography }, { at: path })
          for (let i = 0; i < node.children.length; i++) {
            const typography: RichTextTypography = shallowInverseAndTypographies(
              node.children.at(i)?.typography ?? { style: [] },
              sharedTypography,
            )

            Transforms.setNodes(editor, { typography }, { at: [...path, i] })
          }
        })
        return true
      }
    }
  }
  return false
}
