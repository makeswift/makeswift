import { getCopyFunction } from '../prop-controllers/copy'
import { ReactRuntime } from '../runtimes/react'
import {
  getComponentPropControllerDescriptors,
  getPropControllerDescriptors,
  State,
} from '../state/react-page'

type ElementData = {
  type: string
  key: string
  props: any
}

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: Map<string, string>
  fileIds: Map<string, string>
  typographyIds: Map<string, string>
  tableIds: Map<string, string>
  tableColumnIds: Map<string, string>
  pageIds: Map<string, string>
  globalElementIds: Map<string, string>
  globalElementData: Map<string, ElementData>
}

export function createReplacementContext(jsonReplacementContext: any): ReplacementContext {
  const rc: ReplacementContext = {
    elementHtmlIds: jsonReplacementContext.elementHtmlIds,
    elementKeys: new Map(
      jsonReplacementContext.elementKeys && Object.entries(jsonReplacementContext.elementKeys),
    ),
    swatchIds: new Map(
      jsonReplacementContext.swatchIds && Object.entries(jsonReplacementContext.swatchIds),
    ),
    fileIds: new Map(
      jsonReplacementContext.fileIds && Object.entries(jsonReplacementContext.fileIds),
    ),
    typographyIds: new Map(
      jsonReplacementContext.typographyIds && Object.entries(jsonReplacementContext.typographyIds),
    ),
    tableIds: new Map(
      jsonReplacementContext.tableIds && Object.entries(jsonReplacementContext.tableIds),
    ),
    tableColumnIds: new Map(
      jsonReplacementContext.tableColumnIds &&
        Object.entries(jsonReplacementContext.tableColumnIds),
    ),
    pageIds: new Map(
      jsonReplacementContext.pageIds && Object.entries(jsonReplacementContext.pageIds),
    ),
    globalElementIds: new Map(
      jsonReplacementContext.globalElementIds &&
        Object.entries(jsonReplacementContext.globalElementIds),
    ),
    globalElementData: new Map(
      jsonReplacementContext.globalElementData &&
        Object.entries(jsonReplacementContext.globalElementData),
    ),
  }

  return rc
}

export function createNewElementTree({
  elementTree,
  replacementContext,
}: {
  elementTree: ElementData
  replacementContext: ReplacementContext
}) {
  const copy = JSON.parse(JSON.stringify(elementTree)) as ElementData
  const store = ReactRuntime.__store()
  const state = store.getState()

  return createNewElementTreeNode(copy, { replacementContext, state })
}

function createNewElementTreeNode(
  node: ElementData,
  { replacementContext, state }: { replacementContext: ReplacementContext; state: State },
): ElementData {
  if (node.props?.children != null) {
    node.props.children.elements = node.props.children.elements.map((child: ElementData) =>
      createNewElementTreeNode(child, { replacementContext, state }),
    )
  }

  for (const propKey of Object.keys(node.props)) {
    if (propKey === 'children') continue

    const descriptors = getComponentPropControllerDescriptors(state, node.type)
    if (descriptors == null) continue

    const descriptor = descriptors[propKey]

    const copyFunction = getCopyFunction(descriptor)

    node.props[propKey] = copyFunction(node.props[propKey], replacementContext)
  }

  return node
}
