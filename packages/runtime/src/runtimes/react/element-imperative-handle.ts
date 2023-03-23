import { BoxModel, BoxModelHandle } from '../../box-model'
import { Descriptor } from '../../prop-controllers/descriptors'
import { DescriptorsPropControllers } from '../../prop-controllers/instances'
import { isMeasurable, measure } from '../../state/modules/box-models'
import {
  isPropControllersHandle,
  PropControllersHandle,
} from '../../state/modules/prop-controller-handles'

export class ElementImperativeHandle<
  T extends Record<string, Descriptor> = Record<string, Descriptor>,
> implements BoxModelHandle, PropControllersHandle<T>
{
  private getCurrent: () => unknown = () => null
  private lastPropControllers: DescriptorsPropControllers<T> | null = null

  callback(getCurrent: () => unknown) {
    const current = this.getCurrent()

    if (current === null) this.setPropControllers(null)

    this.getCurrent = getCurrent

    if (this.lastPropControllers !== null) this.setPropControllers(this.lastPropControllers)
  }

  getBoxModel(): BoxModel | null {
    const current = this.getCurrent()

    return isMeasurable(current) ? measure(current) : null
  }

  setPropControllers(propControllers: DescriptorsPropControllers<T> | null): void {
    const current = this.getCurrent()

    if (isPropControllersHandle(current)) current.setPropControllers(propControllers)

    this.lastPropControllers = propControllers
  }

  getDomNode(): Element | null {
    const current = this.getCurrent()

    if (isDomNodeHandle(current)) return current.getDomNode()

    return current instanceof Element ? current : null
  }
}

type DomNodeHandle = {
  getDomNode(): Element | null
}

export function isDomNodeHandle(value: unknown): value is DomNodeHandle {
  if (
    typeof value === 'object' &&
    value !== null &&
    'getDomNode' in value &&
    typeof (value as { getDomNode: unknown }).getDomNode === 'function'
  ) {
    return true
  }

  return false
}
