'use client'

import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { createUnifiedStylesheet, type StyleUpdater } from './css-engine'

// Client-side style updater adapter
class ClientStyleUpdater implements StyleUpdater {
  constructor(private onStyleUpdate: (elementKey: string, propName: string, css: string) => void) {}

  updateStyle(elementKey: string, propName: string, css: string): void {
    this.onStyleUpdate(elementKey, propName, css)
  }
}

export function createClientStylesheet(
  breakpoints: Breakpoints,
  elementKey: string,
  onStyleUpdate: (elementKey: string, propName: string, css: string) => void,
): Stylesheet {
  const updater = new ClientStyleUpdater(onStyleUpdate)
  return createUnifiedStylesheet(breakpoints, elementKey, { updater })
}
