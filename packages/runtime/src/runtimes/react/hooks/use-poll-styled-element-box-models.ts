import { useEffect } from "react";
import { useSelector } from "./use-selector";
import { getPropControllers } from "../../../state/read-only-state";
import { useDocumentKey } from "./use-document-context";
import { pollBoxModel } from "../poll-box-model";


export function usePollStyledElementBoxModels(elementKey: string) {
  const documentKey = useDocumentKey()

    /*
    (spike)
    Why is this here? It's part of an effort to replace the old css runtime's box model polling behavior.

    The old implementation dealt with box model callbacks by feeding them through from a Control
    definition into the stylesheet *along the path of resolving props*:
      - Control definition calls `defineStyle`, passing along a box model callback
      - `defineStyle` finishes producing css, then stores the callback (if passed in) in a ref alongside other box model callbacks

    then, with box model callbacks for an element accumulating into a ref, the actual polling could be done as part of a
    useEffect (in use-stylesheet-factory.ts)

    The problem with this flow for RSCs: the "right" place to register box model callbacks can't be "along the path of
    resolving props" because prop resolution happens on the server (and doesn't happen via RSCBuilderUpdater on the client
    until you modify a style value). So we need a way to set up box model callbacks on the client in the absence of prop resolution
  */
  const propControllers = useSelector((state) => {
    if (documentKey == null) return null
    return getPropControllers(state, { documentKey, elementKey})
  })

  useEffect(() => {
    if (propControllers == null) return
    const cleanupFunctions: Array<() => void> = []
    for (const [propName, controller] of Object.entries(propControllers)) {
      /*
        TODO I know this is "wrong", need an alternative
      */
      if (typeof controller.changeBoxModel !== 'function') {
        continue
      }

      // TODO use helper for building the classname
      const styledElement = document.querySelector(
        `[class*="makeswift-rsc-${elementKey}-${propName}-"]`,
      )

      if (styledElement == null) {
        console.warn(`[RSC] No styled element found for prop ${propName} on element ${elementKey}`)
        continue
      }

      cleanupFunctions.push(
        pollBoxModel({
          element: styledElement,
          onBoxModelChange: boxModel => controller.changeBoxModel(boxModel)
        })
      )
    }
    return () => cleanupFunctions.forEach(fn => fn())
  }, [propControllers, elementKey])
}