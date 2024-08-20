import { type IntrospectionTarget } from '../../../introspection'

import * as Slate from '../slate'

import { RichTextPluginControl } from './plugin'

export function introspectNodes<R>(
  nodes: Slate.Descendant[],
  target: IntrospectionTarget<R>,
  pluginControls: RichTextPluginControl[],
): R[] {
  return nodes.flatMap(introspectNode)

  function introspectNode(descendant: Slate.Descendant): R[] {
    if (Slate.Element.isElement(descendant)) {
      return [
        ...introspectElement(descendant),
        ...descendant.children.flatMap(introspectNode),
      ]
    }

    if (Slate.Text.isText(descendant)) {
      return introspectText(descendant)
    }

    return []
  }

  function introspectElement(descendant: Slate.Element) {
    return pluginControls.flatMap((control) =>
      control.getElementValue
        ? control.definition.introspect(
            control.getElementValue(descendant),
            target,
          )
        : [],
    )
  }

  function introspectText(text: Slate.Text) {
    return pluginControls.flatMap((control) =>
      control.getLeafValue
        ? control.definition.introspect(control.getLeafValue(text), target)
        : [],
    )
  }
}
