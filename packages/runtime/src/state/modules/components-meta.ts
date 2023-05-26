import { Action, ActionTypes } from '../actions'

export const ComponentIcon = {
  Carousel: 'carousel',
  Code: 'code',
  Countdown: 'countdown',
  Cube: 'cube',
  Divider: 'divider',
  Form: 'form',
  Navigation: 'navigation',
  SocialLinks: 'social-links',
  Video: 'video',
} as const

export type ComponentIcon = typeof ComponentIcon[keyof typeof ComponentIcon]

export type ComponentMeta = { label: string; icon: ComponentIcon; hidden: boolean }

export type State = Map<string, ComponentMeta>

export function getInitialState({
  componentsMeta = new Map(),
}: { componentsMeta?: Map<string, ComponentMeta> } = {}): State {
  return componentsMeta
}

export function getComponentsMeta(state: State): Map<string, ComponentMeta> {
  return state
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER_COMPONENT:
      return new Map(state).set(action.payload.type, action.payload.meta)

    case ActionTypes.UNREGISTER_COMPONENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.type)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
