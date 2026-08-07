import type { ControlType, ParsedJSXElement } from '../types'

type ContentControlType = 'TextInput' | 'TextArea' | 'RichText'

type InferenceResult = {
  controlType: ContentControlType
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const INLINE_TAGS = ['span', 'strong', 'em', 'b', 'i', 'u', 'a', 'code', 'small', 'mark']
const BLOCK_TEXT_TAGS = ['p', 'div', 'article', 'section', 'blockquote']
const FORM_INPUT_TAGS = ['label', 'button']
const LIST_TAGS = ['li', 'dt', 'dd']

const SHORT_TEXT_THRESHOLD = 50
const MEDIUM_TEXT_THRESHOLD = 200

export function inferContentControlType(element: ParsedJSXElement): InferenceResult {
  const { tagName, textContent, hasRichContent, children } = element

  if (hasRichContent) {
    return {
      controlType: 'RichText',
      confidence: 'high',
      reason: 'Element contains nested HTML elements indicating rich content',
    }
  }

  if (HEADING_TAGS.includes(tagName.toLowerCase())) {
    const length = textContent?.length ?? 0

    if (length <= SHORT_TEXT_THRESHOLD) {
      return {
        controlType: 'TextInput',
        confidence: 'high',
        reason: `Heading tag (${tagName}) with short text content`,
      }
    }

    return {
      controlType: 'TextArea',
      confidence: 'medium',
      reason: `Heading tag (${tagName}) with longer text content`,
    }
  }

  if (FORM_INPUT_TAGS.includes(tagName.toLowerCase())) {
    return {
      controlType: 'TextInput',
      confidence: 'high',
      reason: `Form element (${tagName}) typically has short, single-line content`,
    }
  }

  if (INLINE_TAGS.includes(tagName.toLowerCase())) {
    return {
      controlType: 'TextInput',
      confidence: 'medium',
      reason: `Inline element (${tagName}) typically contains short text`,
    }
  }

  if (LIST_TAGS.includes(tagName.toLowerCase())) {
    const length = textContent?.length ?? 0

    if (length <= SHORT_TEXT_THRESHOLD) {
      return {
        controlType: 'TextInput',
        confidence: 'medium',
        reason: `List item (${tagName}) with short content`,
      }
    }

    return {
      controlType: 'TextArea',
      confidence: 'medium',
      reason: `List item (${tagName}) with longer content`,
    }
  }

  if (BLOCK_TEXT_TAGS.includes(tagName.toLowerCase())) {
    const length = textContent?.length ?? 0

    if (length <= SHORT_TEXT_THRESHOLD) {
      return {
        controlType: 'TextInput',
        confidence: 'medium',
        reason: `Block element (${tagName}) with short content`,
      }
    }

    if (length <= MEDIUM_TEXT_THRESHOLD) {
      return {
        controlType: 'TextArea',
        confidence: 'medium',
        reason: `Block element (${tagName}) with medium-length content`,
      }
    }

    if (children.length > 0) {
      return {
        controlType: 'RichText',
        confidence: 'medium',
        reason: `Block element (${tagName}) with multiple children`,
      }
    }

    return {
      controlType: 'TextArea',
      confidence: 'medium',
      reason: `Block element (${tagName}) with long content`,
    }
  }

  if (!textContent) {
    return {
      controlType: 'TextInput',
      confidence: 'low',
      reason: 'No text content detected, defaulting to TextInput',
    }
  }

  const length = textContent.length
  const hasNewlines = textContent.includes('\n')

  if (hasNewlines || length > MEDIUM_TEXT_THRESHOLD) {
    return {
      controlType: 'TextArea',
      confidence: 'medium',
      reason: 'Content contains newlines or is long',
    }
  }

  if (length <= SHORT_TEXT_THRESHOLD) {
    return {
      controlType: 'TextInput',
      confidence: 'medium',
      reason: 'Short text content',
    }
  }

  return {
    controlType: 'TextArea',
    confidence: 'low',
    reason: 'Medium-length content, defaulting to TextArea',
  }
}

type ElementTypeResult = {
  elementType: string
  suggestedControls: ControlType[]
}

export function inferElementType(element: ParsedJSXElement): ElementTypeResult {
  const { tagName, attributes } = element
  const lowerTag = tagName.toLowerCase()

  if (HEADING_TAGS.includes(lowerTag)) {
    return {
      elementType: 'Heading',
      suggestedControls: ['TextInput', 'Typography', 'Style'],
    }
  }

  if (lowerTag === 'p') {
    return {
      elementType: 'Paragraph',
      suggestedControls: ['TextArea', 'Typography', 'Style'],
    }
  }

  if (lowerTag === 'img') {
    return {
      elementType: 'Image',
      suggestedControls: ['Image', 'Style'],
    }
  }

  if (lowerTag === 'a') {
    return {
      elementType: 'Link',
      suggestedControls: ['Link', 'TextInput', 'Style'],
    }
  }

  if (lowerTag === 'button') {
    return {
      elementType: 'Button',
      suggestedControls: ['TextInput', 'Link', 'Style', 'Color'],
    }
  }

  if (lowerTag === 'input') {
    const inputType = attributes.type as string | undefined

    if (inputType === 'checkbox') {
      return {
        elementType: 'Checkbox',
        suggestedControls: ['Checkbox', 'Style'],
      }
    }

    return {
      elementType: 'Input',
      suggestedControls: ['TextInput', 'Style'],
    }
  }

  if (lowerTag === 'textarea') {
    return {
      elementType: 'TextArea',
      suggestedControls: ['TextArea', 'Style'],
    }
  }

  if (lowerTag === 'ul' || lowerTag === 'ol') {
    return {
      elementType: 'List',
      suggestedControls: ['List', 'Style'],
    }
  }

  if (lowerTag === 'div' || lowerTag === 'section' || lowerTag === 'article') {
    return {
      elementType: 'Container',
      suggestedControls: ['Style', 'Slot'],
    }
  }

  if (lowerTag === 'span') {
    return {
      elementType: 'Text',
      suggestedControls: ['TextInput', 'Typography', 'Style'],
    }
  }

  if (lowerTag === 'nav' || lowerTag === 'header' || lowerTag === 'footer') {
    return {
      elementType: tagName.charAt(0).toUpperCase() + tagName.slice(1),
      suggestedControls: ['Style', 'Slot'],
    }
  }

  const isCustomComponent = tagName[0] === tagName[0].toUpperCase()
  if (isCustomComponent) {
    return {
      elementType: tagName,
      suggestedControls: ['Style', 'Slot'],
    }
  }

  return {
    elementType: 'Container',
    suggestedControls: ['Style', 'Slot'],
  }
}

export function shouldHaveTextControl(element: ParsedJSXElement): boolean {
  const { textContent, children, hasRichContent } = element

  if (hasRichContent) return true
  if (textContent && textContent.trim().length > 0) return true
  if (children.length === 0) return false

  return false
}

export function suggestListControl(elements: ParsedJSXElement[]): boolean {
  if (elements.length < 2) return false

  const tagNames = elements.map((e) => e.tagName.toLowerCase())
  const uniqueTags = new Set(tagNames)

  if (uniqueTags.size === 1) {
    return true
  }

  return false
}
