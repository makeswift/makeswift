import { type Element } from '@makeswift/controls'
import { Action } from '../actions'

export type EmbeddedComponent = {
  documentKey: string
  type: string
  key: string
  locale: string | null
  rootElement: Element
}

export type State = Map<string, EmbeddedComponent>

export function getInitialState({
  embeddedComponents = new Map(),
}: { embeddedComponents?: Map<string, EmbeddedComponent> } = {}): State {
  return embeddedComponents
}

export function getEmbeddedComponents(state: State): Map<string, EmbeddedComponent> {
  return state
}

export function getEmbeddedComponent(state: State, documentKey: string): EmbeddedComponent | null {
  return getEmbeddedComponents(state).get(documentKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    default:
      return state
  }
}
