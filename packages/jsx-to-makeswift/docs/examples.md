# JSX to Makeswift Controls - Examples

This document provides examples of common component patterns and their transformed output.

## Basic Container

**Input:**

```jsx
<div className="m-4 p-6 bg-blue-500 rounded-lg">
  Hello World
</div>
```

**Output:**

```json
{
  "type": "Container",
  "tagName": "div",
  "controls": {
    "style": {
      "type": "Style",
      "properties": ["margin", "padding", "borderRadius"],
      "value": [
        {
          "deviceId": "mobile",
          "value": {
            "margin": "1rem",
            "padding": "1.5rem",
            "borderRadius": "0.5rem"
          }
        }
      ]
    },
    "backgroundColor": {
      "type": "Color",
      "property": "backgroundColor",
      "value": [
        {
          "deviceId": "mobile",
          "value": { "color": "#3b82f6", "alpha": 1 }
        }
      ]
    },
    "content": {
      "type": "TextInput",
      "value": "Hello World"
    }
  }
}
```

---

## Hero Section

**Input:**

```jsx
<section className="bg-gray-100 p-8 md:p-16">
  <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
    Welcome to Our Site
  </h1>
  <p className="text-xl text-gray-600 mt-4">
    The best place to find what you need.
  </p>
  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6">
    Get Started
  </button>
</section>
```

**Output:**

```json
{
  "type": "Container",
  "tagName": "section",
  "controls": {
    "style": {
      "type": "Style",
      "properties": ["padding"],
      "value": [
        { "deviceId": "mobile", "value": { "padding": "2rem" } },
        { "deviceId": "desktop", "value": { "padding": "4rem" } }
      ]
    },
    "backgroundColor": {
      "type": "Color",
      "property": "backgroundColor",
      "value": [
        { "deviceId": "mobile", "value": { "color": "#f3f4f6", "alpha": 1 } }
      ]
    }
  },
  "children": {
    "type": "Slot",
    "elements": [
      {
        "type": "Heading",
        "tagName": "h1",
        "controls": {
          "typography": {
            "type": "Typography",
            "value": [
              { "deviceId": "mobile", "value": { "fontSize": "2.25rem", "fontWeight": 700 } },
              { "deviceId": "desktop", "value": { "fontSize": "3.75rem" } }
            ]
          },
          "textColor": {
            "type": "Color",
            "property": "textColor",
            "value": [
              { "deviceId": "mobile", "value": { "color": "#111827", "alpha": 1 } }
            ]
          },
          "content": { "type": "TextInput", "value": "Welcome to Our Site" }
        }
      },
      {
        "type": "Paragraph",
        "tagName": "p",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["marginTop"],
            "value": [
              { "deviceId": "mobile", "value": { "marginTop": "1rem" } }
            ]
          },
          "typography": {
            "type": "Typography",
            "value": [
              { "deviceId": "mobile", "value": { "fontSize": "1.25rem" } }
            ]
          },
          "textColor": {
            "type": "Color",
            "property": "textColor",
            "value": [
              { "deviceId": "mobile", "value": { "color": "#4b5563", "alpha": 1 } }
            ]
          },
          "content": { "type": "TextInput", "value": "The best place to find what you need." }
        }
      },
      {
        "type": "Button",
        "tagName": "button",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "borderRadius", "marginTop"],
            "value": [
              {
                "deviceId": "mobile",
                "value": {
                  "paddingLeft": "1.5rem",
                  "paddingRight": "1.5rem",
                  "paddingTop": "0.75rem",
                  "paddingBottom": "0.75rem",
                  "borderRadius": "0.5rem",
                  "marginTop": "1.5rem"
                }
              }
            ]
          },
          "backgroundColor": {
            "type": "Color",
            "property": "backgroundColor",
            "value": [
              { "deviceId": "mobile", "value": { "color": "#3b82f6", "alpha": 1 } }
            ]
          },
          "textColor": {
            "type": "Color",
            "property": "textColor",
            "value": [
              { "deviceId": "mobile", "value": { "color": "#ffffff", "alpha": 1 } }
            ]
          },
          "content": { "type": "TextInput", "value": "Get Started" }
        }
      }
    ]
  }
}
```

---

## Card Component

**Input:**

```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <img src="/card-image.jpg" alt="Card" className="w-full rounded-t-lg" />
  <h2 className="text-xl font-bold mt-4">Card Title</h2>
  <p className="text-gray-600 mt-2">Card description goes here.</p>
  <a href="/read-more" className="text-blue-500 mt-4 inline-block">Read More</a>
</div>
```

**Output:**

```json
{
  "type": "Container",
  "tagName": "div",
  "controls": {
    "style": {
      "type": "Style",
      "properties": ["padding", "borderRadius", "boxShadow"],
      "value": [
        {
          "deviceId": "mobile",
          "value": {
            "padding": "1.5rem",
            "borderRadius": "0.5rem",
            "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }
        }
      ]
    },
    "backgroundColor": {
      "type": "Color",
      "property": "backgroundColor",
      "value": [
        { "deviceId": "mobile", "value": { "color": "#ffffff", "alpha": 1 } }
      ]
    }
  },
  "children": {
    "type": "Slot",
    "elements": [
      {
        "type": "Image",
        "tagName": "img",
        "controls": {
          "image": {
            "type": "Image",
            "value": { "src": "/card-image.jpg", "alt": "Card" }
          },
          "style": {
            "type": "Style",
            "properties": ["width", "borderRadius"],
            "value": [
              { "deviceId": "mobile", "value": { "width": "100%", "borderRadius": "0.5rem 0.5rem 0 0" } }
            ]
          }
        }
      },
      {
        "type": "Heading",
        "tagName": "h2",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["marginTop"],
            "value": [{ "deviceId": "mobile", "value": { "marginTop": "1rem" } }]
          },
          "typography": {
            "type": "Typography",
            "value": [
              { "deviceId": "mobile", "value": { "fontSize": "1.25rem", "fontWeight": 700 } }
            ]
          },
          "content": { "type": "TextInput", "value": "Card Title" }
        }
      },
      {
        "type": "Paragraph",
        "tagName": "p",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["marginTop"],
            "value": [{ "deviceId": "mobile", "value": { "marginTop": "0.5rem" } }]
          },
          "textColor": {
            "type": "Color",
            "property": "textColor",
            "value": [{ "deviceId": "mobile", "value": { "color": "#4b5563", "alpha": 1 } }]
          },
          "content": { "type": "TextInput", "value": "Card description goes here." }
        }
      },
      {
        "type": "Link",
        "tagName": "a",
        "controls": {
          "link": { "type": "Link", "value": { "href": "/read-more" } },
          "style": {
            "type": "Style",
            "properties": ["marginTop", "display"],
            "value": [{ "deviceId": "mobile", "value": { "marginTop": "1rem", "display": "inline-block" } }]
          },
          "textColor": {
            "type": "Color",
            "property": "textColor",
            "value": [{ "deviceId": "mobile", "value": { "color": "#3b82f6", "alpha": 1 } }]
          },
          "content": { "type": "TextInput", "value": "Read More" }
        }
      }
    ]
  }
}
```

---

## Navigation Bar

**Input:**

```jsx
<nav className="flex justify-between items-center p-4 bg-white shadow">
  <a href="/" className="text-xl font-bold">Logo</a>
  <div className="flex gap-6">
    <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
    <a href="/services" className="text-gray-600 hover:text-gray-900">Services</a>
    <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
  </div>
</nav>
```

**Output:**

```json
{
  "type": "Nav",
  "tagName": "nav",
  "controls": {
    "style": {
      "type": "Style",
      "properties": ["display", "justifyContent", "alignItems", "padding", "boxShadow"],
      "value": [
        {
          "deviceId": "mobile",
          "value": {
            "display": "flex",
            "justifyContent": "space-between",
            "alignItems": "center",
            "padding": "1rem"
          }
        }
      ]
    },
    "backgroundColor": {
      "type": "Color",
      "property": "backgroundColor",
      "value": [{ "deviceId": "mobile", "value": { "color": "#ffffff", "alpha": 1 } }]
    }
  },
  "children": {
    "type": "Slot",
    "elements": [
      {
        "type": "Link",
        "tagName": "a",
        "controls": {
          "link": { "type": "Link", "value": { "href": "/" } },
          "typography": {
            "type": "Typography",
            "value": [{ "deviceId": "mobile", "value": { "fontSize": "1.25rem", "fontWeight": 700 } }]
          },
          "content": { "type": "TextInput", "value": "Logo" }
        }
      },
      {
        "type": "Container",
        "tagName": "div",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["display", "gap"],
            "value": [{ "deviceId": "mobile", "value": { "display": "flex", "gap": "1.5rem" } }]
          }
        },
        "children": {
          "type": "Slot",
          "elements": [
            {
              "type": "Link",
              "tagName": "a",
              "controls": {
                "link": { "type": "Link", "value": { "href": "/about" } },
                "textColor": {
                  "type": "Color",
                  "property": "textColor",
                  "value": [{ "deviceId": "mobile", "value": { "color": "#4b5563", "alpha": 1 } }]
                },
                "content": { "type": "TextInput", "value": "About" }
              }
            },
            {
              "type": "Link",
              "tagName": "a",
              "controls": {
                "link": { "type": "Link", "value": { "href": "/services" } },
                "textColor": {
                  "type": "Color",
                  "property": "textColor",
                  "value": [{ "deviceId": "mobile", "value": { "color": "#4b5563", "alpha": 1 } }]
                },
                "content": { "type": "TextInput", "value": "Services" }
              }
            },
            {
              "type": "Link",
              "tagName": "a",
              "controls": {
                "link": { "type": "Link", "value": { "href": "/contact" } },
                "textColor": {
                  "type": "Color",
                  "property": "textColor",
                  "value": [{ "deviceId": "mobile", "value": { "color": "#4b5563", "alpha": 1 } }]
                },
                "content": { "type": "TextInput", "value": "Contact" }
              }
            }
          ]
        }
      }
    ]
  }
}
```

---

## Responsive Layout

**Input:**

```jsx
<div className="flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-8">
  <div className="w-full md:w-1/2">Left Column</div>
  <div className="w-full md:w-1/2">Right Column</div>
</div>
```

**Output:**

```json
{
  "type": "Container",
  "tagName": "div",
  "controls": {
    "style": {
      "type": "Style",
      "properties": ["display", "flexDirection", "gap", "padding"],
      "value": [
        {
          "deviceId": "mobile",
          "value": {
            "display": "flex",
            "flexDirection": "column",
            "gap": "1rem",
            "padding": "1rem"
          }
        },
        {
          "deviceId": "desktop",
          "value": {
            "flexDirection": "row",
            "gap": "2rem",
            "padding": "2rem"
          }
        }
      ]
    }
  },
  "children": {
    "type": "Slot",
    "elements": [
      {
        "type": "Container",
        "tagName": "div",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["width"],
            "value": [
              { "deviceId": "mobile", "value": { "width": "100%" } },
              { "deviceId": "desktop", "value": { "width": "50%" } }
            ]
          },
          "content": { "type": "TextInput", "value": "Left Column" }
        }
      },
      {
        "type": "Container",
        "tagName": "div",
        "controls": {
          "style": {
            "type": "Style",
            "properties": ["width"],
            "value": [
              { "deviceId": "mobile", "value": { "width": "100%" } },
              { "deviceId": "desktop", "value": { "width": "50%" } }
            ]
          },
          "content": { "type": "TextInput", "value": "Right Column" }
        }
      }
    ]
  }
}
```

---

## CLI Usage Examples

### Convert a single file

```bash
npx jsx-to-makeswift convert src/components/Hero.tsx
```

### Convert from stdin

```bash
echo '<div className="p-4 bg-blue-500">Hello</div>' | npx jsx-to-makeswift convert --stdin
```

### Convert with compact output

```bash
npx jsx-to-makeswift convert --compact src/components/Card.tsx
```

### Convert multiple files

```bash
npx jsx-to-makeswift convert src/components/*.tsx
```

### Use in a pipeline

```bash
cat Hero.jsx | npx jsx-to-makeswift convert --stdin | jq '.controls'
```

---

## Programmatic Usage

### Basic transformation

```typescript
import { transformJSX } from '@makeswift/jsx-to-makeswift'

const jsx = `<div className="p-4 bg-blue-500">Hello</div>`
const result = transformJSX(jsx)

console.log(result.schemas[0])
```

### Handle errors

```typescript
import { transformJSX } from '@makeswift/jsx-to-makeswift'

const result = transformJSX(invalidJsx)

if (result.errors.length > 0) {
  console.error('Parse errors:', result.errors)
} else {
  console.log('Schemas:', result.schemas)
}
```

### Get JSON output

```typescript
import { transformJSXToJSON } from '@makeswift/jsx-to-makeswift'

const json = transformJSXToJSON(`<div className="p-4">Hello</div>`)
console.log(json) // Pretty-printed JSON string
```

### Transform a single element

```typescript
import { transformJSXElement } from '@makeswift/jsx-to-makeswift'

const result = transformJSXElement(`<h1 className="text-2xl">Title</h1>`)

if (result) {
  console.log(result.schema.type) // 'Heading'
  console.log(result.schema.controls.content.value) // 'Title'
}
```

---

## Reverse Transformation (Schema → JSX)

### Basic reverse transformation

```typescript
import { transformSchemaToJSX } from '@makeswift/jsx-to-makeswift'

const schema = {
  type: 'Container',
  tagName: 'div',
  controls: {
    style: {
      type: 'Style',
      properties: ['padding'],
      value: [{ deviceId: 'mobile', value: { padding: '1rem' } }]
    },
    content: { type: 'TextInput', value: 'Hello' }
  }
}

const result = transformSchemaToJSX(schema)
console.log(result.jsx)
// <div className="p-4">Hello</div>
```

### Reverse with responsive values

```typescript
const schema = {
  type: 'Container',
  tagName: 'div',
  controls: {
    style: {
      type: 'Style',
      properties: ['padding'],
      value: [
        { deviceId: 'mobile', value: { padding: '1rem' } },
        { deviceId: 'tablet', value: { padding: '1.5rem' } },
        { deviceId: 'desktop', value: { padding: '2rem' } }
      ]
    }
  }
}

const result = transformSchemaToJSX(schema)
console.log(result.jsx)
// <div className="p-4 sm:p-6 lg:p-8" />
```

### CLI reverse command

```bash
# Convert schema file to JSX
npx jsx-to-makeswift reverse schema.json

# Read schema from stdin
cat schema.json | npx jsx-to-makeswift reverse --stdin
```

### Round-trip conversion

```bash
# JSX → Schema → JSX
echo '<div className="m-4 p-6 bg-blue-500 text-white">Hello</div>' | \
  npx jsx-to-makeswift convert --stdin | \
  npx jsx-to-makeswift reverse --stdin

# Output: <div className="m-4 p-6 bg-blue-500 text-white">Hello</div>
```

### Get just the JSX string

```typescript
import { schemaToJSXString } from '@makeswift/jsx-to-makeswift'

const jsx = schemaToJSXString(schema)
console.log(jsx) // Just the JSX string, no metadata
```
