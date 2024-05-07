import { Data } from '@makeswift/controls'
import { getPageIds, getSwatchIds, getTypographyIds } from '../../prop-controllers/introspection'
import { ControlDefinition } from '../control'
import { RichTextV2ControlData, RichTextV2ControlDefinition } from './rich-text-v2'
import { Descendant, Element as SlateElement, Text } from 'slate'

function introspectRichTextV2Data<T>(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
  func: (definition: ControlDefinition, data: Data) => T[],
): T[] {
  const plugins = definition.config.plugins

  return data.descendants.flatMap(d => getDescendantTypographyIds(d))

  function getDescendantTypographyIds(descendant: Descendant): T[] {
    if (SlateElement.isElement(descendant)) {
      return [
        ...getElementTypographyIds(descendant),
        ...descendant.children.flatMap(d => getDescendantTypographyIds(d)),
      ]
    }

    if (Text.isText(descendant)) {
      return getTextTypographyIds(descendant)
    }

    return []
  }

  function getElementTypographyIds(descendant: SlateElement) {
    return (
      plugins?.flatMap(plugin =>
        plugin.control?.definition && plugin.control.getElementValue
          ? func(plugin.control.definition, plugin.control.getElementValue(descendant))
          : [],
      ) ?? []
    )
  }

  function getTextTypographyIds(text: Text) {
    return (
      plugins?.flatMap(plugin => {
        return plugin.control?.definition && plugin.control.getLeafValue
          ? func(plugin.control.definition, plugin.control.getLeafValue(text))
          : []
      }) ?? []
    )
  }
}

export function getRichTextV2SwatchIds(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
) {
  return introspectRichTextV2Data(definition, data, getSwatchIds)
}

export function getRichTextV2TypographyIds(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
) {
  return introspectRichTextV2Data(definition, data, getTypographyIds)
}

export function getRichTextV2PageIds(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
) {
  return introspectRichTextV2Data(definition, data, getPageIds)
}
