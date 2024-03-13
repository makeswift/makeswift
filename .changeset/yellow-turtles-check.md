---
'@makeswift/runtime': patch
---

Wraps the `RuntimeProvider` component in a `Suspense` boundary as it uses `React.lazy`. Not wrapping the component would cause a hydration mismatch between the server and client.
