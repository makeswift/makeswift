import { Style } from "@makeswift/runtime/controls";

import { runtime } from "@/makeswift/runtime";

import { Box } from "./Box";

runtime.registerComponent(Box, {
  type: 'MegaTestBox',
  label: 'Custom / TestBox',
  icon: 'cube',
  hidden: false,
  description: `
  
**This is an awesome image:**

<AwesomeImageComponent src="https://plus.unsplash.com/premium_photo-1738614647383-0435fcb26a55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8fA%3D%3D" />
<br></br>
<AwesomeImageComponent src="https://images.unsplash.com/photo-1596276567596-8eb1b5994cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nJTIwbWVtZXxlbnwwfHwwfHx8MA%3D%3D" />
<br></br>
<button onClick={() => alert('This is a test script from MDX!')}>
  Suspicious text...
</button>
<br></br>
[Important Docs](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
`,
  props: {
    className: Style({ properties: Style.All }),
  },
});