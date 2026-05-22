---
'@makeswift/controls': patch
'@makeswift/prop-controllers': patch
---

Text and number primitives now read shared markers across `@makeswift/controls` and `@makeswift/prop-controllers`, so swapping a prop's control type — or overriding a built-in component and reverting — preserves the saved value. Modern controls write the canonical `'text'` / `'number'` marker on next edit.
