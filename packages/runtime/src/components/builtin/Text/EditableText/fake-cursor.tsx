import { Editor, Node, Range, Path } from 'slate'
import { ReactEditor } from 'slate-react'

export type SelectionRect = {
  width: number
  height: number

  top: number
  left: number
}

const findEventRange = (editor: Editor, event: any) => {
  try {
    return ReactEditor.findEventRange(editor as any, event)
  } catch (e) {}
  return
}
const toDOMNode = (editor: Editor, node: Node) => {
  try {
    return ReactEditor.toDOMNode(editor as any, node)
  } catch (e) {}
  return
}

export const toDOMRange = (editor: Editor, range: Range) => {
  try {
    return ReactEditor.toDOMRange(editor as any, range)
  } catch (e) {}
}

import { ElementUtils } from './ListPlugin/lib/utils/element'

export const getSelectionRects = (editor: Editor): SelectionRect[] => {
  if (editor.selection == null) return []
  const [start, end] = Range.edges(editor.selection)
  const domRange = toDOMRange(editor, editor.selection)

  let xOffset = 0
  let yOffset = 0

  const editorElement = ReactEditor.toDOMNode(editor, editor)
  if (editorElement) {
    const contentRect = editorElement.getBoundingClientRect()
    console.log({ contentRect })

    xOffset = contentRect.x
    yOffset = contentRect.y
  }

  if (!domRange) {
    return []
  }

  const selectionRects: SelectionRect[] = []
  const textEntries = Editor.nodes(editor, {
    at: editor.selection,
    match: ElementUtils.isText,
  })

  for (const [textNode, textPath] of textEntries) {
    const domNode = toDOMNode(editor, textNode)

    // Fix: failed to execute 'selectNode' on 'Range': the given Node has no parent
    if (!domNode || !domNode.parentElement) {
      return []
    }

    const isStartNode = Path.equals(textPath, start.path)
    const isEndNode = Path.equals(textPath, end.path)

    let clientRects: DOMRectList | null = null
    if (isStartNode || isEndNode) {
      const nodeRange = document.createRange()

      nodeRange.selectNode(domNode)

      if (isStartNode) {
        nodeRange.setStart(domRange.startContainer, domRange.startOffset)
      }
      if (isEndNode) {
        nodeRange.setEnd(domRange.endContainer, domRange.endOffset)
      }

      clientRects = nodeRange.getClientRects()
    } else {
      clientRects = domNode.getClientRects()
    }

    for (let i = 0; i < clientRects.length; i++) {
      const clientRect = clientRects.item(i)
      if (!clientRect) {
        continue
      }

      selectionRects.push({
        width: clientRect.width,
        height: clientRect.height,
        top: clientRect.top,
        left: clientRect.left,
      })
    }
  }

  return selectionRects
}

type FakeCursor = {
  selectionRects: SelectionRect[]
}

export function FakeCursor(props: FakeCursor) {
  return (
    <>
      {props.selectionRects.map((position, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: 0.3,
            backgroundColor: 'blue',
            ...position,
          }}
        />
      ))}
      {/* {!disableCaret &&
        caretPosition &&
        (Caret ? (
          <Caret data={data} caretPosition={caretPosition} />
        ) : (
          <div
            className={caret?.className}
            css={caret?.css}
            style={{ ...caretPosition, ...style }}
          />
        ))} */}
    </>
  )
}
