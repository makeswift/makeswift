import { Action, ActionTypes } from '../actions'

export type Locale = string

export type Locales = Locale[]

export type State = {
  locales: Locales
  locale: Locale | null
  defaultLocale: Locale | null
}

export function getInitialState(initialState?: State): State {
  return {
    locales: initialState?.locales ?? [],
    locale: initialState?.locale ?? null,
    defaultLocale: initialState?.defaultLocale ?? null,
  }
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_LOCALES: {
      const locales = action.payload.locales

      return { ...state, locales }
    }

    case ActionTypes.SET_LOCALE: {
      if (action.payload.locale === state.locale) return state

      return { ...state, locale: action.payload.locale }
    }

    case ActionTypes.SET_DEFAULT_LOCALE: {
      if (action.payload.defaultLocale === state.defaultLocale) return state

      return { ...state, defaultLocale: action.payload.defaultLocale }
    }

    default:
      return state
  }
}

export type LocalesInput = {
  locales: string[]
  defaultLocale: string
}

export function parseLocalesInput(input: LocalesInput): State {
  return {
    ...input,
    locale: null,
  }
}
