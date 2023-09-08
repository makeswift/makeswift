import { Descendant } from 'slate'
import { RichTextV2ControlData, RichTextV2ControlType } from './rich-text-v2'
import { v4 as uuid } from 'uuid'
import { BlockType } from '../../slate/types'

export function richTextV2DataToDescendents(data: RichTextV2ControlData): Descendant[] {
  return data.descendants.length === 0
    ? [{ type: BlockType.Default, children: [{ text: '' }] }]
    : data.descendants
}

export function richTextV2DescendentsToData(
  descendants: Descendant[],
  key?: string,
): RichTextV2ControlData {
  return {
    type: RichTextV2ControlType,
    version: 2,
    descendants,
    key: key ?? uuid(),
  }
}
