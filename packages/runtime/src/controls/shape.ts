import { PropControllerMessage } from '../prop-controllers'
import {
  AnyPropController,
  createPropController,
  PropController,
  Send,
} from '../prop-controllers/instances'
import { CopyContext } from '../state/react-page'
import { ControlDefinition, ControlDefinitionData } from './control'

import { copy as controlCopy } from './control'

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

  constructor(send: any, descriptor: T) {
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

  recv() {}
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
