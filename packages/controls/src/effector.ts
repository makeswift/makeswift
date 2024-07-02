import { type ResponsiveValue } from './common/types'

export const StyleControlProperty = {
  Width: 'makeswift::controls::style::property::width',
  Margin: 'makeswift::controls::style::property::margin',
  Padding: 'makeswift::controls::style::property::padding',
  Border: 'makeswift::controls::style::property::border',
  BorderRadius: 'makeswift::controls::style::property::border-radius',
  TextStyle: 'makeswift::controls::style::property::text-style',
} as const

export type StyleControlProperty =
  (typeof StyleControlProperty)[keyof typeof StyleControlProperty]

export interface Effector {
  defineStyle(
    name: string,
    properties: StyleControlProperty[],
    style: ResponsiveValue<any>,
  ): void
  defineStyle(
    name: string,
    properties: StyleControlProperty[],
    style: Record<string, ResponsiveValue<any>>,
  ): void
}

export const noOpEffector: Effector = {
  defineStyle: () => {},
}
