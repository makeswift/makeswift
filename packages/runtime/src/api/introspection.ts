import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  getElementChildren,
  getElementSwatchIds,
  getFileIds,
  getPageIds,
  getTableIds,
  getTypographyIds,
} from '../prop-controllers/introspection'
import { ELEMENT_REFERENCE_GLOBAL_ELEMENT, TYPOGRAPHIES_BY_ID } from '../components/utils/queries'
import {
  Element,
  ElementData,
  getPropControllerDescriptors,
  isElementReference,
  Store,
} from '../state/react-page'
import { TypographyFragment } from './generated/graphql'
import { PropControllerDescriptor } from '../prop-controllers'
import { ListControlData, ListControlType, ShapeControlData, ShapeControlType } from '../controls'
import { ListValue, ShapeValue, Types } from '../prop-controllers/descriptors'

export async function introspect(
  element: Element,
  client: ApolloClient<NormalizedCacheObject>,
  store: Store,
) {
  const descriptors = getPropControllerDescriptors(store.getState())
  const swatchIds = new Set<string>()
  const fileIds = new Set<string>()
  const typographyIds = new Set<string>()
  const tableIds = new Set<string>()
  const pageIds = new Set<string>()

  const remaining = [element]
  let current: Element | undefined

  while ((current = remaining.pop())) {
    let element: ElementData

    if (isElementReference(current)) {
      const query = await client.query({
        query: ELEMENT_REFERENCE_GLOBAL_ELEMENT,
        variables: { id: current.value },
      })

      const elementData = query.data?.globalElement?.data

      if (elementData == null) continue

      element = elementData
    } else {
      element = current
    }

    const elementDescriptors = descriptors.get(element.type)

    if (elementDescriptors == null) continue

    getResourcesFromElementDescriptors(elementDescriptors, element.props)

    function getResourcesFromElementDescriptors(
      elementDescriptors: Record<string, PropControllerDescriptor>,
      props: ElementData['props'],
    ) {
      Object.entries(elementDescriptors).forEach(([propName, descriptor]) => {
        getElementSwatchIds(descriptor, props[propName]).forEach(swatchId => {
          swatchIds.add(swatchId)
        })

        getFileIds(descriptor, props[propName]).forEach(fileId => fileIds.add(fileId))

        getTypographyIds(descriptor, props[propName]).forEach(typographyId =>
          typographyIds.add(typographyId),
        )

        getTableIds(descriptor, props[propName]).forEach(tableId => tableIds.add(tableId))

        getPageIds(descriptor, props[propName]).forEach(pageId => pageIds.add(pageId))

        getElementChildren(descriptor, props[propName]).forEach(child => remaining.push(child))

        if (descriptor.type === ShapeControlType) {
          const prop = props[propName] as ShapeControlData

          if (prop == null) return

          getResourcesFromElementDescriptors(descriptor.config.type, prop)
        }

        if (descriptor.type === ListControlType) {
          const prop = props[propName] as ListControlData

          if (prop == null) return

          prop.forEach(item => {
            getResourcesFromElementDescriptors(
              { propName: descriptor.config.type },
              { propName: item.value },
            )
          })
        }

        if (descriptor.type === Types.Shape) {
          const prop = props[propName] as ShapeValue

          if (prop == null) return

          getResourcesFromElementDescriptors(descriptor.options.type, prop)
        }

        if (descriptor.type === Types.List) {
          const prop = props[propName] as ListValue

          if (prop == null) return

          prop.forEach(item => {
            getResourcesFromElementDescriptors(
              { propName: descriptor.options.type },
              { propName: item.value },
            )
          })
        }
      })
    }
  }

  const typographiesResult = await client.query({
    query: TYPOGRAPHIES_BY_ID,
    variables: { ids: [...typographyIds] },
  })

  typographiesResult?.data?.typographies.forEach((typography: TypographyFragment | null) => {
    typography?.style.forEach(style => {
      const swatchId = style.value.color?.swatchId

      if (swatchId != null) swatchIds.add(swatchId)
    })
  })

  return {
    swatchIds: [...swatchIds],
    fileIds: [...fileIds],
    typographyIds: [...typographyIds],
    tableIds: [...tableIds],
    pageIds: [...pageIds],
  }
}
