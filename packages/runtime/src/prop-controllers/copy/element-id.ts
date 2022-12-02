import { CopyContext } from '../../state/react-page'

export function copy(value: string | undefined, context: CopyContext): string | undefined {
  if (value == null) return value

  if (context.replacementContext.elementHtmlIds.has(value)) return undefined

  context.replacementContext.elementHtmlIds.add(value)

  return value
}
