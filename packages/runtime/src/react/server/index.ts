export {
  type ServerRenderContext,
  RenderElementPayload,
  RenderContext as MakeswiftRenderContext,
  setRenderContext,
  getRenderContext,
  ServerCSSCollector,
  ServerElement,
  RSCElementRenderer,
  Slot,
} from '../../runtimes/react/server'

// The other half of `ServerElementsCache` (exported from
// `unstable-framework-support`): builds the element-key -> rendered-node map an
// adapter passes to it, so a framework doesn't have to re-implement the tree walk,
// the `registerDocument` dispatch, and the API resource cache update.
export { collectServerElements } from '../../runtimes/react/server/collect-server-elements'
