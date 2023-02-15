import {
  getElementChildren,
  getElementSwatchIds,
  getFileIds,
  getPageIds,
  getTableIds,
  getTypographyIds,
} from '../prop-controllers/introspection'
import {
  Element,
  ElementData,
  getPropControllerDescriptors,
  isElementReference,
  Store,
} from '../state/react-page'
import { PropControllerDescriptor } from '../prop-controllers'
import { ListControlData, ListControlType, ShapeControlData, ShapeControlType } from '../controls'
import { ListValue, ShapeValue, Types } from '../prop-controllers/descriptors'
import { MakeswiftClient } from './react'

export type IntrospectedResourceIds = {
  swatchIds: string[]
  fileIds: string[]
  typographyIds: string[]
  tableIds: string[]
  pageIds: string[]
}

export async function introspect(
  element: Element,
  client: MakeswiftClient,
  store: Store,
): Promise<IntrospectedResourceIds> {
  const descriptors = getPropControllerDescriptors(store.getState())
  const swatchIds = new Set<string>()
  const fileIds = new Set<string>()
  const typographyIds = new Set<string>()
  const tableIds = new Set<string>()
  const pageIds = new Set<string>()

  const remaining = [element]
  const seen = new Set<string>()
  let current: Element | undefined

  while ((current = remaining.pop())) {
    let element: ElementData

    if (isElementReference(current)) {
      const globalElement = await client.fetchGlobalElement(current.value)
      const elementData = globalElement?.data

      if (elementData == null) continue

      element = elementData as ElementData
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

        getElementChildren(descriptor, props[propName]).forEach(child => {
          if (!seen.has(child.key)) {
            seen.add(child.key)

            remaining.push(child)
          }
        })

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

  const typographies = await client.fetchTypographies([...typographyIds])

  typographies.forEach(typography => {
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
