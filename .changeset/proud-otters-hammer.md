---
'@makeswift/runtime': patch
---

Fix SSR hydration mismatch due to attempting to render ReactPlayer on the server.

See https://github.com/cookpete/react-player/issues/1428.
