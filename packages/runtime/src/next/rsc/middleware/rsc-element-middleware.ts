import { type Middleware } from '@reduxjs/toolkit'
import { type useRouter } from 'next/navigation'

import { type State, type Dispatch } from '../../../state/react-page'
import * as ComponentsMeta from '../../../state/modules/components-meta'
import * as ElementTrees from '../../../state/modules/element-trees'
import { getDocument } from '../../../state/react-page'
import { ActionTypes, type Action } from '../../../state/actions'
import { actionMiddleware } from '../../../state/toolkit'

export function createRSCElementMiddleware(
  router?: ReturnType<typeof useRouter>,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware<State, Action>(({ getState }) => next => {
    return action => {
      switch (action.type) {
        case ActionTypes.CHANGE_DOCUMENT: {
          const { documentKey, operation } = action.payload

          const document = getDocument(getState(), documentKey)
          const componentsMeta = ComponentsMeta.getComponentsMeta(getState().componentsMeta)

          for (const op of operation) {
            const hasInsert = 'li' in op || 'oi' in op

            if (hasInsert) {
              const insertedData = ('li' in op ? op.li : (op as any).oi?.value) as any
              const insertedElement = insertedData?.elements?.at(0)

              if (insertedElement) {
                const meta = componentsMeta.get(insertedElement?.type)

                if (meta?.server) {
                  console.log('RSC element added, refreshing page')
                  router?.refresh()
                  break
                }
              }
            }

            const changedElementsPaths = ElementTrees.getChangedElementsPaths(op.p)

            for (const { elementPath } of changedElementsPaths) {
              const changedElement = ElementTrees.getElementByPath(
                document!.rootElement,
                elementPath,
              )

              if (changedElement == null) continue

              const meta = componentsMeta.get(changedElement.type)

              if (meta?.server) {
                // Refreshed in RSCElementStyleEnhancer
                // router?.refresh()
                break
              }
            }
          }

          break
        }
      }

      return next(action)
    }
  })
}