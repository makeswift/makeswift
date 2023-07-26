import { createContext } from 'react'
import { ControlDefinitionValue } from './controls/control'

export type TranslationContextType = Record<
  string,
  { source: ControlDefinitionValue<any>; target: ControlDefinitionValue<any> }
>

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined)
