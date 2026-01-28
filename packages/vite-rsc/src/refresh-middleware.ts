// import { type Middleware } from '@reduxjs/toolkit'

// import { type State, type Dispatch, Element } from '../../../state/react-page'
// import * as ComponentsMeta from '../../../state/modules/components-meta'
// import { ActionTypes, type Action, type DocumentPayload } from '../../../state/actions'
// import { actionMiddleware } from '../../../state/toolkit'
// import { traverseElementTree } from '../../../state/modules/element-trees'
// import { type DescriptorsByComponentType } from '../../../state/modules/prop-controllers'

// export function createRSCRefreshMiddleware(): Middleware<Dispatch, State, Dispatch> {
//   return actionMiddleware<State, Action>(({ getState }) => next => {
//     return action => {
//       switch (action.type) {
//         // TODO: this can be much more efficient if we send a new operation from the builder when a new RSC element is added
//         case ActionTypes.CHANGE_ELEMENT_TREE: {
//           const { oldDocument, newDocument, descriptors } = action.payload
//           const componentsMeta = ComponentsMeta.getComponentsMeta(getState().componentsMeta)
//           const newlyAddedElements = getNewlyAddedElements(oldDocument, newDocument, descriptors)

//           for (const element of newlyAddedElements) {
//             const meta = componentsMeta.get(element.type)

//             if (meta?.server) {
//               console.log(`[RSC] element "${element.type}" added, refreshing page`)
//               router?.refresh()
//               break
//             }
//           }

//           break
//         }
//       }

//       return next(action)
//     }
//   })
// }

// function getNewlyAddedElements(
//   oldDoc: DocumentPayload,
//   newDoc: DocumentPayload,
//   descriptors: DescriptorsByComponentType,
// ): Element[] {
//   const oldElementKeys = new Set<string>()
//   const newElements: Element[] = []

//   for (const element of traverseElementTree(oldDoc.rootElement, descriptors)) {
//     oldElementKeys.add(element.key)
//   }

//   for (const element of traverseElementTree(newDoc.rootElement, descriptors)) {
//     if (!oldElementKeys.has(element.key)) {
//       newElements.push(element)
//     }
//   }

//   return newElements
// }
