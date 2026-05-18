import { useEffect } from "react";
import { useSelector } from "./use-selector";
import { getPropControllers } from "../../../state/read-only-state";
import { useDocumentKey } from "./use-document-context";
import { pollBoxModel } from "../poll-box-model";


export function usePollRSCStyledElementBoxModels(elementKey: string) {
  const documentKey = useDocumentKey()

    /*
    (spike, will remove this comment later)
    Why is this here? It's part of an effort to replace the old css runtime's box model polling behavior.

    The client implementation deals with box model callbacks by feeding them through from a Control
    definition into the stylesheet *along the path of resolving props*:
      - Control definition calls `defineStyle`, passing along a box model callback
      - `defineStyle` finishes producing css, then stores the callback (if passed in) in a ref alongside other box model callbacks

    then, with box model callbacks for an element accumulating into a ref, the actual polling can be done as part of a
    useEffect (in use-stylesheet-factory.ts)

    The problem with this flow for RSCs: the "right" place to register box model callbacks can't be "along the path of
    resolving props" because prop resolution happens on the server (and doesn't happen via RSCBuilderUpdater on the client
    until you modify a style value). So we need a way to set up box model callbacks on the client in the absence of prop resolution

    TODOs:
    - doesn't deal with Control nesting (i.e., Style within Group)
    - this is no longer used for client components. Is there a better way to do this now that we aren't trying to fit
    a solution to both RSCs and client components?
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
        TODO I know this is "wrong", need to clean up
      */
      if (typeof controller.changeBoxModel !== 'function') {
        continue
      }

      /*
        Note to self:
        What's happening below is we're finding the <style> tag in order to be able to pull the class name from,
        so that we can find the styled element itself.

        This is in contrast to what I had before, which was trying to rebuild the class name here based on the element key and prop
        name and ____. The latter is undesirable because it requires having the same class name construction logic in both places.
        And the class name construction logic is about to become more complicated as we start thinking about encoding + _____.

        This still feels bad. I don't know how this is going to work (or not) when we're dealing with nested controls?
        If we have two Group's that each have a 'myClassname' prop, how are they distinguishable with this logic?
      */

      // TODO helper for building parts of this?
      const stylesTagForElement = document.querySelectorAll<HTMLStyleElement>(
        `style[data-makeswift-rsc-element-key="${elementKey}"][data-makeswift-rsc-prop-name="${propName}"]`
      )
      if (stylesTagForElement.length === 0) {
        console.warn(`No <style> tag found for element ${elementKey} and prop ${propName}`)
        continue
      }
      if (stylesTagForElement.length > 1) {
        // TODO I think this case is currently possible for Group-nested styled props
        console.error(`Expected to find at most one <style> tag for element ${elementKey} and prop ${propName}`)
        continue
      }
      const styleTagForElement = stylesTagForElement[0]
      const className = styleTagForElement.getAttribute('data-makeswift-rsc-classname')
      if (className == null) {
        console.error(`No class name found for style tag for element ${elementKey} and prop ${propName}`)
        continue
      }

      const styledElement = document.querySelector(`.${className}`)

      if (styledElement == null) {
        console.warn(`No styled element found for prop ${propName} on element ${elementKey}`)
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
