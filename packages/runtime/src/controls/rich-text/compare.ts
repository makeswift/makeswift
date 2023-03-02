import { Descendant, Selection } from 'slate'
import { Typography } from '../../api'
import { LinkControlData } from '../link'
import {
  Text,
  Inline,
  TextType,
  InlineType,
  BlockType,
  RichTextDAO,
  BlockTextAlignment,
} from './types'

function compareLists<T>(compareFunc: (a: T, b: T) => boolean, a?: T[], b?: T[]): boolean {
  if (typeof a === 'undefined' || typeof b === 'undefined') {
    return Object.is(a, b)
  }
  return (
    a.length === b.length &&
    a.reduce((acc, curra, index) => {
      const currb = b.at(index)
      if (acc == false || currb == null) return false

      return compareFunc(curra, currb)
    }, true)
  )
}

function compareRichTextTypography(a: Typography, b: Typography) {
  if (a.id !== b.id) return false

  return a.style.reduce((acc, curra, index) => {
    if (acc == false) return false
    const currb = b.style.at(index)

    if (curra.deviceId !== currb?.deviceId) return false
    if (curra.value.color?.alpha !== currb.value.color?.alpha) return false
    if (curra.value.color?.swatchId !== currb.value.color?.swatchId) return false
    if (curra.value.fontFamily !== currb.value.fontFamily) return false
    if (
      curra.value.fontSize?.unit !== currb.value.fontSize?.unit ||
      curra.value.fontSize?.value !== currb.value.fontSize?.value
    )
      return false
    if (curra.value.fontWeight !== currb.value.fontWeight) return false
    if (curra.value.italic !== currb.value.italic) return false
    if (curra.value.letterSpacing !== currb.value.letterSpacing) return false
    if (curra.value.lineHeight !== currb.value.lineHeight) return false
    if (curra.value.strikethrough !== currb.value.strikethrough) return false
    if (curra.value.underline !== currb.value.underline) return false
    if (curra.value.uppercase !== currb.value.uppercase) return false

    return true
  }, true)
}

function compareBlockTextAlignment(a?: BlockTextAlignment, b?: BlockTextAlignment) {
  if (typeof a === 'undefined' || typeof b === 'undefined') {
    return Object.is(a, b)
  }
  return a.reduce((acc, curra, index) => {
    if (acc == false) return false
    const currb = b.at(index)
    if (curra.deviceId !== currb?.deviceId) return false
    if (curra.value !== currb.value) return false
    return true
  }, true)
}

function compareLinkControlData(a: LinkControlData, b: LinkControlData) {
  if (a.type !== b.type) return false

  if (a.type === 'OPEN_PAGE' && b.type === 'OPEN_PAGE') {
    return (
      a.payload.pageId === b.payload.pageId && a.payload.openInNewTab === b.payload.openInNewTab
    )
  }

  if (a.type === 'OPEN_URL' && b.type === 'OPEN_URL') {
    return a.payload.openInNewTab === b.payload.openInNewTab && a.payload.url === b.payload.url
  }

  if (a.type === 'SEND_EMAIL' && b.type === 'SEND_EMAIL') {
    return (
      a.payload.body === b.payload.body &&
      a.payload.subject === b.payload.subject &&
      a.payload.to === b.payload.to
    )
  }

  if (a.type === 'CALL_PHONE' && b.type === 'CALL_PHONE') {
    return a.payload.phoneNumber === b.payload.phoneNumber
  }

  if (a.type === 'SCROLL_TO_ELEMENT' && b.type === 'SCROLL_TO_ELEMENT') {
    return (
      a.payload.block === b.payload.block &&
      a.payload.elementIdConfig?.elementKey === b.payload.elementIdConfig?.elementKey &&
      a.payload.elementIdConfig?.propName === b.payload.elementIdConfig?.propName
    )
  }

  return true
}

function compareInlineAndText(a: Text | Inline, b: Text | Inline): boolean {
  if (a.type !== b.type) return false
  if (a.type === TextType.Text && b.type === TextType.Text) {
    return a.text === b.text
  }

  if (a.type === TextType.Typography && b.type === TextType.Typography) {
    return a.text === b.text && compareRichTextTypography(a.typography, b.typography)
  }

  if (a.type === InlineType.Link && b.type === InlineType.Link) {
    return (
      compareLinkControlData(a.link, b.link) &&
      compareLists(compareInlineAndText, a.children, b.children)
    )
  }

  if (
    (a.type === InlineType.Code && b.type === InlineType.Code) ||
    (a.type === InlineType.SubScript && b.type === InlineType.SubScript) ||
    (a.type === InlineType.SuperScript && b.type === InlineType.SuperScript)
  ) {
    return compareLists(compareInlineAndText, a.children, b.children)
  }

  return true
}

function compareRichTextDescendant(a: Descendant, b: Descendant): boolean {
  if (a.type !== b.type) {
    console.log('1')

    return false
  }

  if (
    (a.type === TextType.Text && b.type === TextType.Text) ||
    (a.type === TextType.Typography && b.type === TextType.Typography) ||
    (a.type === InlineType.Link && b.type === InlineType.Link) ||
    (a.type === InlineType.Code && b.type === InlineType.Code) ||
    (a.type === InlineType.SubScript && b.type === InlineType.SubScript) ||
    (a.type === InlineType.SuperScript && b.type === InlineType.SuperScript)
  ) {
    return compareInlineAndText(a, b)
  }

  if (
    (a.type === BlockType.BlockQuote && b.type === BlockType.BlockQuote) ||
    (a.type === BlockType.Heading1 && b.type === BlockType.Heading1) ||
    (a.type === BlockType.Heading2 && b.type === BlockType.Heading2) ||
    (a.type === BlockType.Heading3 && b.type === BlockType.Heading3) ||
    (a.type === BlockType.Heading4 && b.type === BlockType.Heading4) ||
    (a.type === BlockType.Heading5 && b.type === BlockType.Heading5) ||
    (a.type === BlockType.Heading6 && b.type === BlockType.Heading6) ||
    (a.type === BlockType.Paragraph && b.type === BlockType.Paragraph) ||
    (a.type === BlockType.OrderedList && b.type === BlockType.OrderedList) ||
    (a.type === BlockType.UnorderedList && b.type === BlockType.UnorderedList) ||
    (a.type === BlockType.ListItem && b.type === BlockType.ListItem) ||
    (a.type === BlockType.ListItemChild && b.type === BlockType.ListItemChild)
  ) {
    return (
      compareBlockTextAlignment(a.textAlign, b.textAlign) &&
      compareLists(compareRichTextDescendant, a.children, b.children)
    )
  }

  return true
}

export function compareRichTextDAO(a: RichTextDAO, b: RichTextDAO) {
  return compareLists(compareRichTextDescendant, a, b)
}

export function compareRichTextSelection(a: Selection, b: Selection) {
  return (
    a?.anchor.offset === b?.anchor.offset &&
    a?.focus.offset === b?.focus.offset &&
    compareLists(Object.is, a?.focus.path, b?.focus.path)
  )
}
