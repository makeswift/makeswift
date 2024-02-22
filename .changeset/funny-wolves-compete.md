---
'@makeswift/runtime': patch
---

Update the `http-proxy` within `/api/[...makeswift].tsx` to use `xfwd: true`. This enables forwarding of `x-` headers.