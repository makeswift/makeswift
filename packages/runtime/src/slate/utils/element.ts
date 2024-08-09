import { Slate } from '@makeswift/controls'

export const ElementUtils = {
  createText() {
    return { text: '' }
  },
  createParagraph() {
    return {
      children: [this.createText()],
      type: Slate.BlockType.Paragraph,
    }
  },
  createList(type: Slate.BlockType = Slate.BlockType.UnorderedList): Slate.Block {
    return { children: [this.createText()], type }
  },
  createListItem(): Slate.Block {
    return {
      children: [this.createListItemChild()],
      type: Slate.BlockType.ListItem,
    }
  },
  createListItemChild(): Slate.Block {
    return {
      children: [this.createText()],
      type: Slate.BlockType.ListItemChild,
    }
  },
}
