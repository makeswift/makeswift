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

  private itemControlsById: Map<string, ControlInstance> = new Map()
  private itemControlsList: Array<ControlInstance> = []

  constructor(
    private readonly definition: Def,
    args: ControlInstanceArgs<Message>,
  ) {
    super(args)
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ListControl.ITEM_CONTROL_MESSAGE: {
        const { itemId, message: itemMessage } = message.payload
        this.childByItemId(itemId)?.recv(itemMessage)
      }
    }
  }

  /**
   *  Returns the control instance for the nested prop identified by `key`,
   *  where `key` is a stringified list item index.
   */
  child = (key: string): ControlInstance | undefined => {
    const index = parseIndex(key)

    if (index == null) {
      console.error(
        `Expected a stringified list item index, received '${key}'`,
        this.instanceKey,
      )

      return undefined
    }

    return this.itemControlsList[index]
  }

  resolvesToRenderableNode = () => false

  childControls = (ids?: string[]): Map<string, ControlInstance> => {
    const orderedIds: string[] = [...this.itemControlsById.keys()]
    // return existing controls if we have a full set of them and they are
    // already correctly ordered
    if (ids == null || shallowEqual(ids, orderedIds)) {
      return this.itemControlsById
    }

    // otherwise recreate controls for new/updated items as needed
    return new Map(
      ids.map((id, index) => {
        const matchingChild =
          id === orderedIds[index] ? this.childByItemId(id) : null
        return [id, matchingChild ?? this.createItemControl(index, id)]
      }),
    )
  }

  setChildControls = (children: Map<string, ControlInstance>) => {
    this.itemControlsById = children
    this.itemControlsList = [...children.values()]
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

  private childByItemId = (itemId: string): ControlInstance | undefined =>
    this.itemControlsById.get(itemId)
}

const parseIndex = (key: string): number | undefined => {
  const parsedNum = Number.parseInt(key, 10)
  const isValidIndex =
    !Number.isNaN(parsedNum) && parsedNum >= 0 && String(parsedNum) === key
  return isValidIndex ? parsedNum : undefined
}
