import { type CopyContext } from '../../../context'
import { GenericLink } from '../../link'
import { unstable_Typography } from '../../typography'

import * as Slate from '../slate'

export function copyNodes(
  nodes: Slate.Descendant[],
  context: CopyContext,
): Slate.Descendant[] {
  return nodes.flatMap((d) => copyNode(d))

  function copyNode(descendant: Slate.Descendant): Slate.Descendant {
    if (Slate.isInline(descendant)) {
      const { children, ...rest } = descendant
      return {
        ...(Slate.isLink(descendant) ? copyLinkData(descendant) : rest),
        children: children.map(copyNode) as Slate.InlineChildren,
      }
    }

    if (Slate.Text.isText(descendant)) {
      return copyTypographyData(descendant)
    }

    return {
      ...descendant,
      children: descendant.children.map(copyNode),
    }
  }

  function copyLinkData(
    element: Omit<Slate.LinkElement, 'children'>,
  ): Omit<Slate.LinkElement, 'children'> {
    if (element.link == null) return element

    const { link, ...rest } = element
    return {
      ...rest,
      link: GenericLink().copyData(link, context) ?? null,
    }
  }

  function copyTypographyData({ typography, ...text }: Slate.Text): Slate.Text {
    return {
      ...text,
      ...(typography == null
        ? {}
        : {
            typography: unstable_Typography().copyData(typography, context),
          }),
    }
  }
}
