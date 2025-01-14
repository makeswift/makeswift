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

export class RuntimeCore {
  store: Store

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput }) {
    this.store = configureStore({
      name: 'Runtime store',
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

  getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return mergeElementTreeTranslatedData(this.store.getState(), elementTree, translatedData)
  }
}
