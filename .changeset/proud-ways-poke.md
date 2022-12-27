---
'@makeswift/runtime': minor
---

Perf Boost #1: Removal of Styled Components dependency and efficient animations.

This change completely reworks how Makeswift handles CSS styles, resulting in improved performance. We've updated all components to use a lighter CSS runtime built on top of Emotion CSS' core utilities. On our benchmarks we've seen Total Blocking Time improve by ~25%. This change also reduces the amount of shipped JS by dropping the Styled Component depenency. There's still more work to do to get our CSS runtime even more lightweight: we want to completely drop the CSS runtime when serving live pages outside the Makeswift builder. But at this point we've squeezed as much performance as is reasonable from the CSS runtime and are hitting diminishing returns. We will return to the CSS runtime once we've addressed other areas where performance can be improved.

We've also improved the Box component by only using Framer Motion when the Box is animated. Now, when there's no animations in a Box component, we use plain ol' divs. This had a noticeable boost on Total Blocking Time as well.

The common thread in these improvements is reduced Total Blocking Time, which directly comes from React hydration. This is just the first of many performance boost updates we have planned, so stay tuned!
