import { Descendant, Editor, Element, NodeEntry, Text, Transforms } from 'slate'
import { clearActiveTypographyStyle } from './clearActiveTypographyStyle'
import { clearDeviceActiveTypography } from './clearDeviceActiveTypography'
import { detachActiveTypography } from './detachActiveTypography'
import { setActiveTypographyId } from './setActiveTypographyId'
import { setActiveTypographyStyle } from './setActiveTypographyStyle'
import { unstable_Typography } from '../../controls'
import { getValue } from './getValue'
import { getSelection } from '../selectors'
import { createRichTextV2Plugin } from '../../controls/rich-text-v2/plugin'
import { RichTextTypography } from '../types'
import keys from '../../utils/keys'
import shallowMerge from '../../utils/shallowMerge'

export const TypographyActions = {
  setActiveTypographyId,
  setActiveTypographyStyle,
  clearActiveTypographyStyle,
  clearDeviceActiveTypography,
  detachActiveTypography,
}

export const TYPOGRAPHY_KEY = 'typography'

export function withTypography(editor: Editor) {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry
    if (
      Text.isText(normalizationNode) &&
      normalizationNode?.typography?.id == null &&
      normalizationNode?.typography?.style.length === 0
    ) {
      Transforms.unsetNodes(editor, TYPOGRAPHY_KEY, { at: normalizationPath })
      return
    }

    if ('slice' in normalizationNode && normalizationNode?.slice != null) {
      Transforms.unsetNodes(editor, 'slice', { at: normalizationPath })
      return
    }

    if (Element.isElement(normalizationNode) && normalizationNode.children.length) {
      const firstTypography = normalizationNode.children.at(0)?.typography

      const commonTypography: RichTextTypography = { style: [] }

      function shallowAnd<A extends Record<string, unknown>, B extends Record<string, unknown>>(
        a: A,
        b: B,
      ): A & B {
        const bKeys = keys(b)
        const aPrime = { ...a } as A & B
        const and = {} as A & B

        bKeys.forEach(key => {
          if (aPrime[key] === b[key]) and[key] = aPrime[key]
        })

        return and
      }
      function shallowXor<A extends Record<string, unknown>, B extends Record<string, unknown>>(
        a: A,
        common: B,
      ): A & B {
        const bKeys = Array.from(new Set([...keys(common), ...keys(a)]))
        const aPrime = { ...a } as A & B
        const xor = {} as A & B

        bKeys.forEach(key => {
          if (aPrime[key] !== common[key as any]) xor[key] = aPrime[key]
        })

        return xor
      }

      if (
        firstTypography != null &&
        normalizationNode?.children.every(child => Boolean(child.typography))
      ) {
        const copiedChildren = structuredClone(normalizationNode.children)

        if (
          firstTypography.id != null &&
          normalizationNode?.children.every(
            child => child.typography !== undefined && child.typography.id === firstTypography.id,
          )
        ) {
          commonTypography.id = firstTypography.id
        }

        if (firstTypography.style?.length > 0) {
          const styles: RichTextTypography['style'] = []
          firstTypography.style.forEach(style => {
            const deviceTypographyStyles = copiedChildren
              .map(child => child.typography?.style.find(s => s.deviceId === style.deviceId)?.value)
              .filter((override): override is RichTextTypography['style'][number]['value'] =>
                Boolean(override),
              )

            if (deviceTypographyStyles.length === copiedChildren.length) {
              const commonDeviceStyle: RichTextTypography['style'][number]['value'] =
                deviceTypographyStyles.reduce((acc, curr) => {
                  return shallowAnd(acc, curr)
                }, deviceTypographyStyles.at(0) as RichTextTypography['style'][number]['value'])

              if (commonDeviceStyle != null && Object.keys(commonDeviceStyle).length > 0) {
                styles.push({
                  deviceId: style.deviceId,
                  value: commonDeviceStyle,
                })
              }
            }
          })
          commonTypography.style = styles
        }
        if (commonTypography.style.length > 0 || commonTypography.id != null) {
          const result = copiedChildren.map(child => {
            const typography: RichTextTypography = { style: [] }
            if (child.typography?.id !== commonTypography.id) {
              typography.id = child.typography?.id
            }

            if (child.typography && child.typography.style.length > 0) {
              const styles: RichTextTypography['style'] = []
              child.typography.style.forEach(style => {
                const commonDevice = commonTypography.style.find(s => s.deviceId === style.deviceId)
                if (commonDevice == null) {
                  styles.push(style)
                  return
                }

                const xor = shallowXor(style.value, commonDevice.value)
                console.log({ xor, style, commonDevice })

                if (Object.keys(xor).length > 0) {
                  styles.push({
                    deviceId: style.deviceId,
                    value: xor,
                  })
                }
              })
              typography.style = styles
            }
            return { ...child, typography }
          })

          const devices = [
            ...new Set(
              commonTypography.style
                .map(node => node.deviceId)
                .concat(normalizationNode.typography?.style.map(node => node.deviceId) ?? []),
            ),
          ]

          const rootTypography: RichTextTypography = {
            id: commonTypography.id ?? normalizationNode?.typography?.id,
            style: devices.map(deviceId => {
              const commonDevice = commonTypography.style.find(s => s.deviceId === deviceId)
              const existingDeviceStyle = normalizationNode.typography?.style.find(
                s => s.deviceId === deviceId,
              )

              return {
                deviceId,
                value: shallowMerge(commonDevice?.value ?? {}, existingDeviceStyle?.value ?? {}),
              }
            }),
          }
          console.log({
            normalizationNode,
            commonTypography: JSON.stringify(commonTypography),
            result: JSON.stringify(result),
            rootTypography: JSON.stringify(rootTypography),
          })

          Editor.withoutNormalizing(editor, () => {
            Transforms.setNodes(editor, { typography: rootTypography }, { at: normalizationPath })
            for (let i = 0; i < normalizationNode.children.length; i++) {
              Transforms.setNodes(
                editor,
                { typography: result.at(i)?.typography ?? { style: [] } },
                { at: [...normalizationPath, i] },
              )
            }
          })
          return
        }
      }
    }

    normalizeNode(entry)
  }

  return editor
}

export function TypographyPlugin() {
  return createRichTextV2Plugin({
    withPlugin: withTypography,
    control: {
      definition: unstable_Typography(),
      onChange: (editor, value) => {
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
                match: Text.isText,
                split: true,
              },
            )
          }

          if (atRef.current) {
            const nodesToUpdate = Array.from(
              Editor.nodes(editor, {
                at: atRef.current,
                match: node => Text.isText(node) && node.slice === true,
              }),
            ) as NodeEntry<Text>[]

            if (nodesToUpdate.length !== value?.length)
              return console.error(
                `TypographyControl.onChange received the wrong number of arguments.
Called with ${value?.length} values mapping to ${nodesToUpdate.length} nodes.`,
              )

            for (const [index, [, path]] of nodesToUpdate.entries()) {
              Transforms.setNodes(
                editor,
                {
                  typography: value?.at(index),
                },
                { at: path, match: Text.isText },
              )
            }
          }

          atRef.unref()
        })
      },
      getValue: editor => getValue(editor),
      getLeafValue: (text: Text) => {
        return Text.isText(text) ? text.typography : undefined
      },
    },
    renderLeaf: (renderLeaf, className) => props => {
      return renderLeaf({
        ...props,
        leaf: {
          ...props.leaf,
          className: `${props.leaf.className} ${className}`,
        },
      })
    },
  })
}
