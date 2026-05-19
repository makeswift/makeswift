import { useEffect } from "react";
import { useSelector } from "./use-selector";
import { getPropControllers } from "../../../state/read-only-state";
import { useDocumentKey } from "./use-document-context";
import { ControlInstance } from "@makeswift/controls";
import { pollBoxModel } from "../poll-box-model";


export function usePollRSCStyledElementBoxModels(elementKey: string) {
  const documentKey = useDocumentKey()

    /*
    (spike, will remove this comment later)

    The client implementation deals with box model callbacks by feeding them through from a Control
    definition into the Stylesheet *along the path of resolving props*:
      - the component that's resolving props passes an `onStyleGenerated` callback to a Stylesheet which includes logic to store box model callbacks in a ref
      - during prop resolution, a Control definition calls `defineStyle`, passing along a box model callback
      - `defineStyle` finishes producing css and calls `onStyleGenerated`, passing along the callback from the Control
      - the component that resolved props has access to Control-supplied box model callbacks via the ref

    The problem with this flow for RSCs: the "right" place to register box model callbacks can't be "along the path of
    resolving props" because prop resolution happens on the server (and doesn't happen via RSCBuilderUpdater on the client
    until you modify a style value). So we need a way to set up box model callbacks on the client in the absence of prop resolution.

    This hook handles this by:
    - identifying style tags for RSCs that are marked with `[data-makeswift-rsc-should-poll-box-model="true"]`
    - identifying the ControlInstance for the relevant prop in state
    - calling `pollBoxModel` with the styled element and the box model callback retrieved from state
  */
  const propControllers = useSelector((state) => {
    if (documentKey == null) return null
    return getPropControllers(state, { documentKey, elementKey})
  })

  useEffect(() => {
    if (propControllers == null) return
    const cleanupFunctions: Array<() => void> = []

    const styleTags = document.querySelectorAll<HTMLStyleElement>(
      `style[data-makeswift-rsc-element-key="${elementKey}"][data-makeswift-rsc-should-poll-box-model="true"]`
    )

    for (const styleTag of styleTags) {
      const joinedPropPath = styleTag.getAttribute('data-makeswift-rsc-prop-path')
      const className = styleTag.getAttribute('data-makeswift-rsc-classname')
      if (joinedPropPath == null) {
        console.error(`An RSC style tag for element ${elementKey} is missing its prop path/name`)
        continue
      }
      if (className == null) {
        console.error(`An RSC style tag for element ${elementKey} is missing its class name`)
        continue
      }
      const styledElement = document.querySelector(`.${className}`)
      if (styledElement == null) {
        console.error(`No styled element found for prop ${joinedPropPath} on element ${elementKey}`)
        continue
      }

      // TODO at least call a helper
      const propPathSegments = joinedPropPath.split('.')
      let currentController: ControlInstance | undefined = propControllers[propPathSegments[0]]
      for (let propPathIndex = 1; propPathIndex < propPathSegments.length && currentController != null; propPathIndex++) {
        const propName = propPathSegments[propPathIndex]
        currentController = currentController.child(propName)
      }
      if (currentController == null) {
        console.error(`Unable to find ControlInstance for prop path ${joinedPropPath} on element ${elementKey}`)
        continue
      }

      if (typeof currentController.changeBoxModel !== 'function') {
        console.error(`ControlInstance for prop path ${joinedPropPath} on element ${elementKey} does not have a changeBoxModel method`)
        continue
      }

      cleanupFunctions.push(
        pollBoxModel({
          element: styledElement,
          onBoxModelChange: boxModel => currentController.changeBoxModel(boxModel)
        })
      )
    }
    return () => cleanupFunctions.forEach(fn => fn())
  }, [propControllers, elementKey])
}
