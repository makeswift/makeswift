---
'@makeswift/runtime': patch
---

The runtime now fetches table schemas via the Makeswift Host API REST endpoint instead of the GraphQL API, continuing the migration away from GraphQL/Builder API dependencies.
