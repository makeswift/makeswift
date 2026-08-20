---
'@makeswift/runtime': patch
---

File fetching now goes through the Host API's `GET v1/files/:id` REST endpoint instead of the GraphQL `file` query.
