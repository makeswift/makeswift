/** @jest-environment jsdom */

import hugerte from 'hugerte'

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

  test('sends the undo and redo keys to the builder, not to HugeRTE', async () => {
    const { element, callbacks, editor } = await contentMode('<p>Fish</p>')
    // `keyCode` and `which`: `is-hotkey` and the HugeRTE shortcuts read them.
    const press = (shiftKey = false) =>
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'z',
          keyCode: 90,
          which: 90,
          ctrlKey: true,
          shiftKey,
          bubbles: true,
          cancelable: true,
        }),
      )

    // A change, so that HugeRTE has an undo level of its own.
    const instance = hugerte.get(element.id)
    if (instance == null) throw new Error('no editor')

    instance.focus()
    instance.getBody().innerHTML = '<p>FishX</p>'
    instance.undoManager.add()
    callbacks.onChange.mockClear()

    press()
    press(true)

    expect(callbacks.onUndo).toHaveBeenCalledTimes(1)
    expect(callbacks.onRedo).toHaveBeenCalledTimes(1)
    expect(callbacks.onChange).not.toHaveBeenCalled()

    editor.destroy()
  })

  test('does not send other input to the builder', async () => {
    const { element, callbacks, editor } = await contentMode('<p>Fish</p>')

    historyInput(element, 'insertText')
    expect(callbacks.onUndo).not.toHaveBeenCalled()
    expect(callbacks.onRedo).not.toHaveBeenCalled()

    editor.destroy()
  })

  test('saves a root-relative link as it is', async () => {
    window.history.pushState({}, '', '/products/shoe/red/')
    const { element, callbacks, editor } = await contentMode(
      '<p><a href="/shipping">Shipping</a> <em>Terms</em></p>',
    )

    // The editor saves the value of `getContent`.
    expect(hugerte.get(element.id)?.getContent()).toContain('<a href="/shipping">')
    expect(callbacks.onChange).not.toHaveBeenCalled()

    editor.destroy()
    window.history.pushState({}, '', '/')
  })

  test('keeps the HTML that the host shows after the editor stops', async () => {
    const { element, editor } = await contentMode('<p>Fish</p>')

    editor.setReadOnly()
    expect(hugerte.get(element.id)?.mode.isReadOnly()).toBe(true)

    // The host shows the value of build mode before `destroy` runs.
    element.innerHTML = '\n  <p>Chips</p>\n'
    editor.destroy()

    expect(element.innerHTML).toBe('\n  <p>Chips</p>\n')
    expect(element.hasAttribute('contenteditable')).toBe(false)
  })
})
