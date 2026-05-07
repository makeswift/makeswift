import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'

export const ComponentIcon = {
  Accordion: 'accordion',
  Audio: 'audio',
  Billing: 'billing',
  Bolt: 'bolt',
  Button: 'button',
  Card: 'card',
  Cards: 'cards',
  Carousel: 'carousel',
  Chats: 'chats',
  Code: 'code',
  Countdown: 'countdown',
  Cube: 'cube',
  Database: 'database',
  Divider: 'divider',
  Form: 'form',
  Gallery: 'gallery',
  Grid: 'grid',
  Help: 'help',
  Image: 'image',
  Layout: 'layout',
  Lock: 'lock',
  Marker: 'marker',
  Navigation: 'navigation',
  Palette: 'palette',
  SocialLinks: 'social-links',
  Star: 'star',
  Table: 'table',
  Tabs: 'tabs',
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
  builtinSuspense?: boolean
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

export function getComponentMeta(state: State, type: string): ComponentMeta | null {
  return getComponentsMeta(state).get(type) ?? null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadOnlyActionTypes.REGISTER_COMPONENT:
      return new Map(state).set(action.payload.type, action.payload.meta)

    case ReadOnlyActionTypes.UNREGISTER_COMPONENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.type)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
