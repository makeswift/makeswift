---
'@makeswift/runtime': patch
---

Fix incorrect typography override behavior.

Let's say you have a `Text` component with styling set on "Desktop" and "Mobile". If you add an override on "Desktop", then this should not impact "Mobile" typography, since the override is only for the "Desktop" breakpoint. This change ensures overrides do not clobber typography values in descending breakpoints.
