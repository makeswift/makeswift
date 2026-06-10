---
'@makeswift/hono-react': minor
---

fix: move `renderHtml` to a separate entry point so `hono-react/server` can be imported in environments where `react-dom/server` does not provide `renderToReadableStream`.
