---
'@makeswift/runtime': patch
---

The built-in Form component now creates table records via the Makeswift Host API REST endpoint (proxied through the host's `/api/makeswift` route) instead of the GraphQL API, so Form submissions no longer require hitting the GraphQL/Builder API.
