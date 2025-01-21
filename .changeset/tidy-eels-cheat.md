---
"@makeswift/runtime": patch
---

Prevent default styles from overriding resolved props styles based on injection
order. Default styles are now conditionally applied if resolved styles are not
provided.
