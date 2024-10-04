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
  // TODO: the static methods here are deprecated and only keep here for backward-compatibility purpose.
  // We will remove them when we release a new breaking change.
  // ------------------ Deprecated API ------------------ //
  static store = configureStore({ name: 'Runtime store (static)' })

  static copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.store.getState(), elementTree, replacementContext)
  }

  static getBreakpoints(): Breakpoints {
    return getBreakpoints(this.store.getState())
  }

  static getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  static mergeTranslatedData(
    elementTree: ElementData,
    translatedData: Record<string, Data>,
  ): Element {
    return mergeElementTreeTranslatedData(this.store.getState(), elementTree, translatedData)
  }

  // ------------------ Deprecated API ends here ------------------ //

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
