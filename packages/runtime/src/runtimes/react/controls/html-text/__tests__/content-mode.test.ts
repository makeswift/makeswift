/** @jest-environment jsdom */

import { mountHugeRte } from '../hugerte-editor'

async function contentMode(html: string) {
  const element = document.createElement('div')
  element.innerHTML = html
  document.body.appendChild(element)

  const callbacks = {
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    onEscape: jest.fn(),
    onFormatsChange: jest.fn(),
  }

  return { element, callbacks, editor: await mountHugeRte(element, callbacks) }
}

function historyInput(element: HTMLElement, inputType: string): InputEvent {
  const event = new InputEvent('beforeinput', { inputType, bubbles: true, cancelable: true })
  element.dispatchEvent(event)

  return event
}

describe('the content mode editor', () => {
  test('sends a browser undo and redo to the builder', async () => {
    const { element, callbacks, editor } = await contentMode('<p>Fish</p>')

    const undo = historyInput(element, 'historyUndo')
    expect(callbacks.onUndo).toHaveBeenCalledTimes(1)
    expect(undo.defaultPrevented).toBe(true)

    const redo = historyInput(element, 'historyRedo')
    expect(callbacks.onRedo).toHaveBeenCalledTimes(1)
    expect(redo.defaultPrevented).toBe(true)

    editor.destroy()
  })

  test('does not send other input to the builder', async () => {
    const { element, callbacks, editor } = await contentMode('<p>Fish</p>')

    historyInput(element, 'insertText')
    expect(callbacks.onUndo).not.toHaveBeenCalled()
    expect(callbacks.onRedo).not.toHaveBeenCalled()

    editor.destroy()
  })
})
