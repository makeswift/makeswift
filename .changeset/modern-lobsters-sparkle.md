---
'@makeswift/runtime': patch
---

Prevent clicks from propagating in content mode. This issue affected for example when you have a Text on a Accordion: if you click the text in content mode, the click also triggered the accordion open/close state.
