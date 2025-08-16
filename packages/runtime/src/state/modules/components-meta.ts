import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'

export const ComponentIcon = {
  Billing: 'billing',
  Bolt: 'bolt',
  Button: 'button',
  Carousel: 'carousel',
  Chats: 'chats',
  Code: 'code',
  Countdown: 'countdown',
  Cube: 'cube',
  Database: 'database',
  Divider: 'divider',
  Form: 'form',
  Gallery: 'gallery',
  Help: 'help',
  Image: 'image',
  Layout: 'layout',
  Lock: 'lock',
  Navigation: 'navigation',
  SocialLinks: 'social-links',
  Star: 'star',
  Text: 'text',
  Users: 'users',
  Video: 'video',
} as const

export type ComponentIcon = (typeof ComponentIcon)[keyof typeof ComponentIcon]

export type ComponentMeta = {
  label: string
  icon: ComponentIcon
  hidden: boolean
  description?: string
}

export type State = Map<string, ComponentMeta>

export function getInitialState({
  componentsMeta = new Map(),
}: { componentsMeta?: Map<string, ComponentMeta> } = {}): State {
  return componentsMeta
}

export function getComponentsMeta(state: State): Map<string, ComponentMeta> {
  return state
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

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
