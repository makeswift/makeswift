import {
  AnyPropController,
  createPropController,
  Send,
  PropControllerMessage,
} from '../prop-controllers/instances'
import { PropController } from '../prop-controllers/base'
import { CopyContext } from '../state/react-page'
import { ControlDefinition, ControlDefinitionData } from './control'

import { copy as controlCopy } from './control'
import { Data } from './types'
import {
  getElementChildren,
  getFileIds,
  getPageIds,
  getSwatchIds,
  getTypographyIds,
} from '../prop-controllers/introspection'

export const ShapeControlType = 'makeswift::controls::shape'

type ShapeControlConfig = {
  type: Record<string, ControlDefinition>
}

export type ShapeControlDefinition<C extends ShapeControlConfig = ShapeControlConfig> = {
  type: typeof ShapeControlType
  config: C
}

export function Shape<C extends ShapeControlConfig>(config: C): ShapeControlDefinition<C> {
  return { type: ShapeControlType, config }
}

export type ShapeControlData<T extends ShapeControlDefinition = ShapeControlDefinition> = {
  [K in keyof T['config']['type']]?: ControlDefinitionData<T['config']['type'][K]>
}

export const ShapeControlMessageType = {
  SHAPE_CONTROL_CHILD_CONTROL_MESSAGE: 'makeswift::controls::shape::message::child-control-message',
} as const

type ShapeControlChildControlMessage = {
  type: typeof ShapeControlMessageType.SHAPE_CONTROL_CHILD_CONTROL_MESSAGE
  payload: { message: PropControllerMessage; key: string }
}

export type ShapeControlMessage = ShapeControlChildControlMessage

export class ShapeControl<
  T extends ShapeControlDefinition = ShapeControlDefinition,
> extends PropController<ShapeControlMessage> {
  controls: Map<string, AnyPropController>
  descriptor: ShapeControlDefinition
  send: Send<ShapeControlMessage>

  constructor(send: Send<ShapeControlMessage>, descriptor: T) {
    super(send)

    this.descriptor = descriptor
    this.send = send

    this.controls = new Map<string, AnyPropController>()
    this.setControls()
  }

  setControls = () => {
    const controls = new Map<string, AnyPropController>()
    const children = this.descriptor.config.type

    Object.keys(children).forEach(key => {
      const control = createPropController(children[key], message =>
        this.send({
          type: ShapeControlMessageType.SHAPE_CONTROL_CHILD_CONTROL_MESSAGE,
          payload: { message, key },
        }),
      )

      controls.set(key, control)
    })

    this.controls = controls

    return this.controls
  }

  recv = (message: ShapeControlMessage) => {
    switch (message.type) {
      case ShapeControlMessageType.SHAPE_CONTROL_CHILD_CONTROL_MESSAGE: {
        const control = this.controls.get(message.payload.key)

        if (control == null) return

        // TODO: We're casting the type here as the arg0 type for control.recv is never
        const recv = control.recv as (arg0: PropControllerMessage) => void

        recv(message.payload.message)
      }
    }
  }
}

export function copyShapeData(
  definition: ShapeControlDefinition,
  value: ShapeControlData | undefined,
  context: CopyContext,
): ShapeControlData | undefined {
  if (value == null) return value

  const newValue: ShapeControlData = {}

  for (const [key, itemDefinition] of Object.entries(definition.config.type)) {
    const prop = value[key]

    newValue[key] = controlCopy(itemDefinition, prop, context)
  }

  return newValue
}

function introspectShapeData<T>(
  definition: ShapeControlDefinition,
  value: ShapeControlData | undefined,
  func: (definition: ControlDefinition, data: Data) => T[],
): T[] {
  if (value == null) return []

  return Object.entries(definition.config.type).flatMap(([key, definition]) =>
    func(definition, value[key]),
  )
}

export function getShapeElementChildren(
  definition: ShapeControlDefinition,
  data: ShapeControlData,
) {
  return introspectShapeData(definition, data, getElementChildren)
}

export function getShapeSwatchIds(definition: ShapeControlDefinition, data: ShapeControlData) {
  return introspectShapeData(definition, data, getSwatchIds)
}

export function getShapeTypographyIds(definition: ShapeControlDefinition, data: ShapeControlData) {
  return introspectShapeData(definition, data, getTypographyIds)
}

export function getShapePageIds(definition: ShapeControlDefinition, data: ShapeControlData) {
  return introspectShapeData(definition, data, getPageIds)
}

export function getShapeFileIds(definition: ShapeControlDefinition, data: ShapeControlData) {
  return introspectShapeData(definition, data, getFileIds)
}
