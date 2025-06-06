import { Style } from "@makeswift/runtime/controls";

import { runtime } from "@/makeswift/runtime";

import { Circle } from "./Circle";

runtime.registerComponent(Circle, {
  type: 'SuperCircleTester',
  label: 'Custom / TestCircle',
  icon: 'chats',
  hidden: false,
  description: `
This is awesome text
<h1>This is header</h1>

*This is an awesome image:*

![robot](https://plus.unsplash.com/premium_photo-1738614647383-0435fcb26a55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8fA%3D%3D)
<AwesomeImageComponent src="https://images.unsplash.com/photo-1596276567596-8eb1b5994cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nJTIwbWVtZXxlbnwwfHwwfHx8MA%3D%3D" alt = "dog pizza"/>
<button onClick={() => alert('Button clicked!')}>
  Suspicious text...
</button>
[Important Docs](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
<CustomLink link="https://www.youtube.com/watch?v=dQw4w9WgXcQ" other="Click me!" />
`,
  props: {
    className: Style({ properties: Style.All }),
  },
});