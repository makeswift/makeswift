import { deserializeControls, serializeControls, SerializedControl } from '../../../builder'
import { MakeswiftComponentType } from '../../../components'
import { PropControllerDescriptor } from '../../../prop-controllers'
import { Data, State } from '../../../state/react-page'

export type SerializedServerState = {
  componentsMeta: State['componentsMeta']
  propControllers: Map<string, Record<string, SerializedControl<Data>>>
}

export function serializeServerState(state: State) {
  const propControllers = new Map(
    Array.from(
      state.propControllers.entries().filter(
        ([componentType]) =>
          // Filter out built-in components since we can't serialize them because they contain functions.
          // For example: GapY(props => ({ hidden: props.children == null }))
          !Object.values(MakeswiftComponentType).includes(componentType as any),
      ),
    ).map(([componentType, descriptors]) => {
      const [serializedControls] = serializeControls(descriptors)
      return [componentType, serializedControls] as const
    }),
  )

  return {
    componentsMeta: state.componentsMeta,
    propControllers: propControllers,
  }
}

export function deserializeServerState(serializedState: SerializedServerState): Partial<State> {
  const propControllersEntries = Array.from(serializedState.propControllers.entries()).map(
    ([componentType, serializedControls]) => {
      const deserializedControls = deserializeControls(serializedControls) as Record<
        string,
        PropControllerDescriptor
      >
      return [componentType, deserializedControls] as const
    },
  )

  return {
    componentsMeta: serializedState.componentsMeta,
    propControllers: new Map(propControllersEntries),
  }
}
