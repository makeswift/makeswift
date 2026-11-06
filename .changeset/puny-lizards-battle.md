---
'@makeswift/runtime': patch
---

Fix "Scroll to element" link resolution when the scroll target element lives in a different document that shares the runtime's store. Element ID lookups for links now search every document registered with the runtime.
