import type { ParsedJSXElement } from '../types'

export type ParserOptions = {
  sourceType?: 'module' | 'script'
  plugins?: ('jsx' | 'typescript')[]
}

export type ParseResult = {
  elements: ParsedJSXElement[]
  errors: string[]
}
