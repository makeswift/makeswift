type Props<H extends (...args: any[]) => any> = {
  /**
   * `<RenderHook>` requires key that changes whenever the `hook` prop changes to ensure the rules of
   * hooks are followed.
   */
  key: string

  hook: H
  parameters: Parameters<H>
  children(result: ReturnType<H>): JSX.Element
}

export function RenderHook<H extends (...args: any[]) => any>({
  hook: useHook,
  parameters,
  children,
}: Props<H>) {
  return children(useHook(...parameters))
}
