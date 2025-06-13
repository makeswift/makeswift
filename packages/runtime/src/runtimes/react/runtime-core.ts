import { type SerializableReplacementContext } from '@makeswift/controls'

import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

import {
  configureStore,
  copyElementTree,
  getBreakpoints,
  getElementTreeTranslatableData,
  mergeElementTreeTranslatedData,
  type Store,
  type Data,
  type Element,
  type ElementData,
} from '../../state/react-page'
import { Middleware } from 'redux';

export class RuntimeCore {
  store: Store

  constructor({ breakpoints, middleware }: { breakpoints?: BreakpointsInput; middleware?: Middleware[] }) {
    this.store = configureStore({
      name: 'Runtime store',
      preloadedState: null,
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
      middleware,
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

  getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return mergeElementTreeTranslatedData(this.store.getState(), elementTree, translatedData)
  }
}
