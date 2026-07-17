import { shallowEqual } from '../../lib/predicates'

import {
  ControlInstance,
  type ControlInstanceArgs,
  type ControlMessage,
} from '../instance'

import { type ListDefinition } from './list'

type Message = {
  type: typeof ListControl.ITEM_CONTROL_MESSAGE
  payload: { message: ControlMessage; itemId: string }
}

export class ListControl<
  Def extends ListDefinition = ListDefinition,
> extends ControlInstance<Message> {
  static readonly ITEM_CONTROL_MESSAGE =
    'makeswift::controls::list::message::item-control-message'

  private itemControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    args: ControlInstanceArgs<Message>,
  ) {
    super(args)
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ListControl.ITEM_CONTROL_MESSAGE: {
        this.child(message.payload.itemId)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.itemControls.get(key)

  resolvesToRenderableNode = () => false

  childControls = (ids: string[] | undefined): Map<string, ControlInstance> => {
    const orderedIds: string[] = [...this.itemControls.keys()]
    // return existing controls if we have a full set of them and they are
    // already correctly ordered
    if (ids == null || shallowEqual(ids, orderedIds)) {
      return this.itemControls
    }

    // otherwise recreate controls for new/updated items as needed
    return new Map(
      ids.map((id, index) => {
        const matchingChild = id === orderedIds[index] ? this.child(id) : null
        return [id, matchingChild ?? this.createItemControl(index, id)]
      }),
    )
  }

  setChildControls = (children: Map<string, ControlInstance>) => {
    this.itemControls = children
  }

  createItemControl = (index: number, itemId: string): ControlInstance => {
    const { elementKey, propPath } = this.instanceKey
    return this.definition.itemDef.createInstance({
      instanceKey: {
        elementKey,
        propPath: `${propPath}.${index}`,
      },
      sendMessage: (message) =>
        this.sendMessage({
          type: ListControl.ITEM_CONTROL_MESSAGE,
          payload: { message, itemId },
        }),
    })
  }
}
