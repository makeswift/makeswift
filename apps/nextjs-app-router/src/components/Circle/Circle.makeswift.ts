import { Style, Color, RichText, TextInput, List, Checkbox, Combobox } from "@makeswift/runtime/controls";

import { runtime } from "@/makeswift/runtime";

import { Circle } from "./Circle";

runtime.registerComponent(Circle, {
  type: 'SuperCircleTester',
  label: 'Custom / TestCircle',
  icon: 'chats',
  hidden: false,
  description: `
*This is awesome text:*  
![robot](https://plus.unsplash.com/premium_photo-1738614647383-0435fcb26a55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8fA%3D%3D)
<br/>
<AwesomeImageComponent src="https://images.unsplash.com/photo-1596276567596-8eb1b5994cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nJTIwbWVtZXxlbnwwfHwwfHx8MA%3D%3D" alt = "dog pizza"/>

<br/>

<button onClick={() => alert('Button clicked!')}>
  Suspicious text...
</button>

<br/>

[Important Docs](https://www.youtube.com/watch?v=dQw4w9WgXcQ)  
<AwesomeImageComponent src="https://images.unsplash.com/photo-1596276567596-8eb1b59994cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nJTIwbWVtZXxlbnwwfHwwfHx8MA%3D%3D" alt = "dog pizza"/>

<br>

<CustomLink link="https://www.youtube.com/watch?v=dQw4w9WgXcQ" other="Click me!" />
`,
  props: {
    className: Style({ properties: Style.All }),
    color: Color({
      description: 'The color of the circle.',
      label: 'MyCirCol',
      defaultValue: '#ff0000',
    }),
    check: Checkbox({
      label: 'CircCheck',
      description: 'This is a checkbox for the circle.',
    }),
    text: TextInput({
      label: 'CircText',
      description: 'This is a text input for the circle.',
      defaultValue: 'Hello, Circle!',
    }),
    menu: Combobox({
      label: 'CircMenu',
      description: 'This is a combobox for the circle.',
      getOptions() {
        return [
          { id:'1', label: 'Option 1', value: 'option1' },
          { id:'2', label: 'Option 2', value: 'option2' },
          { id:'3', label: 'Option 3', value: 'option3' },
        ];
      },
    })
  }
});