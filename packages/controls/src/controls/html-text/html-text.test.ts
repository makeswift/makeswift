import { TestMergeTranslationsVisitor } from '../../testing/test-merge-translation-visitor'
import { TestSerializationVisitor } from '../../testing/test-serialization-visitor'

import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'

import { HtmlTextDefinition } from './html-text'

class TestHtmlTextDefinition extends HtmlTextDefinition {
  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }
}

const definition = new TestHtmlTextDefinition({
  label: 'Heading',
  defaultValue: '<b>Hi</b>',
})

describe('HtmlTextDefinition', () => {
  test('serializes its config with its type', () => {
    expect(definition.accept(new TestSerializationVisitor())).toEqual({
      type: 'makeswift::controls::unstable-html-text',
      config: { label: 'Heading', defaultValue: '<b>Hi</b>' },
    })
  })

  test('parses only a string', () => {
    expect(definition.safeParse('<p>Hi</p>')).toEqual({
      success: true,
      data: '<p>Hi</p>',
    })
    expect(definition.safeParse(undefined)).toEqual({
      success: true,
      data: undefined,
    })
    expect(definition.safeParse({ html: '<p>Hi</p>' }).success).toBe(false)
  })

  test('translates the whole HTML', () => {
    const visitor = new TestMergeTranslationsVisitor({
      translatedData: {},
      mergeTranslatedData: (node) => node,
    })

    expect(definition.getTranslatableData('<p>Hi</p>')).toBe('<p>Hi</p>')
    expect(definition.accept(visitor, '<p>Hi</p>', '<p>Hola</p>')).toBe(
      '<p>Hola</p>',
    )
    expect(definition.accept(visitor, undefined, '<p>Hola</p>')).toBeUndefined()
  })

  test('resolves to the saved HTML, or the default HTML', () => {
    expect(definition.resolveValue('<p>Hi</p>').readStable()).toBe('<p>Hi</p>')
    expect(definition.resolveValue(undefined).readStable()).toBe('<b>Hi</b>')
  })

  test('reads the text of the HTML', () => {
    expect(
      definition.toText('<p>Fish &amp; <strong>chips</strong><br>now</p>'),
    ).toBe('Fish & chips\nnow')
  })
})
