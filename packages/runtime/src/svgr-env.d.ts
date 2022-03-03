declare module '*.svg' {
  const src: string
  export default src
  export const ReactComponent: () => JSX.Element
}
