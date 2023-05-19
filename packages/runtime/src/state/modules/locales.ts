import { Action, ActionTypes } from '../actions'

export type LocaleId = string

export type Locale = {
  id: LocaleId
  label: string
}

export type Locales = Locale[]

export type State = {
  locales: Locales
  activeLocaleId: LocaleId | null
}

export const BaseLocaleId = 'base'

export const DEFAULT_LOCALES: Locales = [
  {
    id: BaseLocaleId,
    label: 'English',
  },
]

export function getInitialState(locales = DEFAULT_LOCALES): State {
  return {
    locales,
    activeLocaleId: null,
  }
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_LOCALES: {
      const locales = action.payload.locales

      if (locales.length === 0) throw new Error('Locales cannot be empty.')

      return { ...state, locales }
    }

    case ActionTypes.SET_ACTIVE_LOCALE_ID: {
      if (action.payload === state.activeLocaleId) return state

      return { ...state, activeLocaleId: action.payload }
    }

    default:
      return state
  }
}

export type LocalesInput = Record<string, { label: string }>

export function parseLocalesInput(input: LocalesInput): Locales {
  const locales = Object.entries(input).map(([id, { label }]) => ({ id, label }))

  return locales
}
