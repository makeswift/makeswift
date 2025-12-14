import { type SerializableReplacementContext } from '@makeswift/controls'

import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

import { copyElementTree } from '../../state/ops/copy-element-tree'

import { getBreakpoints, type Element, type ElementData } from '../../state/read-only-state'
import { configureStore, type Store } from '../../state/react-page'

export class RuntimeCore {
  store: Store

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput }) {
    this.store = configureStore({
      name: 'Runtime store',
      preloadedState: null,
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
    })
  }

  copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.store.getState(), elementTree, replacementContext)
  }

  getBreakpoints(): Breakpoints {
    return getBreakpoints(this.store.getState())
  }
}
