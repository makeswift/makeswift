import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { BaseStylesheet } from './css-engine'

// Server-side stylesheet creation
export function createServerStylesheet(
  breakpoints: Breakpoints,
  elementKey?: string,
  onStyleGenerated?: (className: string, css: string, elementKey?: string, propName?: string) => void
): Stylesheet {
  return new BaseStylesheet(breakpoints, elementKey, onStyleGenerated)
}

// Client-side stylesheet creation
export function createClientStylesheet(
  breakpoints: Breakpoints,
  elementKey: string,
  onStyleUpdate: (elementKey: string, propName: string, css: string) => void
): Stylesheet {
  const handleStyleGenerated = (_className: string, css: string, elementKey?: string, propName?: string) => {
    if (elementKey && propName) {
      onStyleUpdate(elementKey, propName, css)
    }
  }

  return new BaseStylesheet(breakpoints, elementKey, handleStyleGenerated)
}