import { createEditor } from 'slate'
import { MakeswiftEditor } from '../../../slate'
import { RichTextV2Plugin } from '../plugin'

export function createEditorWithPlugins(plugins: RichTextV2Plugin[]): MakeswiftEditor {
  return plugins.reduceRight(
    (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
    createEditor(),
  )
}

export function pathToString(path: number[]): string {
  return path.join(':')
}

export function stringToPath(s: string): number[] {
  return s.split(':').map(a => parseInt(a))
}

export type RichTextTranslationDto = Record<string, string>
