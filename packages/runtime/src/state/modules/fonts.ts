import z from 'zod'

import { Action, ActionTypes } from '../actions'

const FontVariant = z.object({
  weight: z.string({ required_error: 'Font variant weight is required' }),
  style: z.union([z.literal('italic'), z.literal('normal')], {
    required_error: 'Font variant style is required',
  }),
  src: z.string().optional(),
})

export type FontVariant = z.infer<typeof FontVariant>

const Font = z.object({
  family: z.string({ required_error: 'Font family is required' }),
  variants: z.array(FontVariant).min(1, 'At least one font variant is required'),
})

export type Font = z.infer<typeof Font>

export type Fonts = Font[]

export type State = Fonts

export const DEFAULT_FONTS: Fonts = []

export function getInitialState(fonts = DEFAULT_FONTS): State {
  return fonts
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_FONTS: {
      return action.payload.fonts
    }

    default:
      return state
  }
}

export function parseFontsInput(input: Fonts): Fonts {
  const parsedFonts = Font.array().safeParse(input)

  if (!parsedFonts.success) {
    const formattedError = parsedFonts.error.format()

    throw new Error(`Invalid fonts input: \n\n${formattedError._errors.join('\n')}`)
  }

  return parsedFonts.data
}
