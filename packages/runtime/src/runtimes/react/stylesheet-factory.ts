import { type Stylesheet } from '@makeswift/controls'

export type StylesheetFactory = {
  get(propName: string): Stylesheet
  useDefinedStyles(): void
}
