# @makeswift/jsx-to-makeswift

Bidirectional transformation between JSX with Tailwind CSS and Makeswift control schemas.

## Overview

This library provides two-way conversion:
- **JSX → Schema**: Parse JSX with Tailwind CSS classes and generate Makeswift control schemas
- **Schema → JSX**: Convert Makeswift control schemas back to JSX with Tailwind classes
- **Makeswift Runtime → JSX**: Convert actual Makeswift page data (runtime schema) to JSX

This enables round-trip workflows, code export from Makeswift, and AI agent integration.

## Installation

```bash
pnpm add @makeswift/jsx-to-makeswift
```

## Usage

### Basic Transform

```typescript
import { transformJSX } from '@makeswift/jsx-to-makeswift'

const jsx = `
  <div className="m-4 p-6 bg-blue-500 rounded-lg">
    <h1 className="text-2xl font-bold text-white">Welcome</h1>
    <p className="text-gray-100">This is a description</p>
  </div>
`

const result = transformJSX(jsx)

console.log(result.schemas[0])
// {
//   type: 'Container',
//   tagName: 'div',
//   controls: {
//     style: { type: 'Style', properties: ['margin', 'padding', 'borderRadius'], ... },
//     backgroundColor: { type: 'Color', property: 'backgroundColor', ... },
//     ...
//   },
//   children: { type: 'Slot', elements: [...] }
// }
```

### Get JSON Output

```typescript
import { transformJSXToJSON } from '@makeswift/jsx-to-makeswift'

const json = transformJSXToJSON(jsx)
console.log(json) // Pretty-printed JSON string
```

### Reverse Transform (Schema → JSX)

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
    backgroundColor: {
      type: 'Color',
      property: 'backgroundColor',
      value: [{ deviceId: 'mobile', value: { color: '#3b82f6', alpha: 1 } }]
    },
    content: { type: 'TextInput', value: 'Hello World' }
  }
}

const result = transformSchemaToJSX(schema)
console.log(result.jsx)
// <div className="p-4 bg-blue-500">Hello World</div>
```

### Round-Trip Conversion

```typescript
import { transformJSX, transformSchemaToJSX } from '@makeswift/jsx-to-makeswift'

// JSX → Schema
const jsx = '<div className="m-4 p-6 bg-blue-500">Hello</div>'
const { schemas } = transformJSX(jsx)

// Schema → JSX
const { jsx: regenerated } = transformSchemaToJSX(schemas[0])
console.log(regenerated)
// <div className="m-4 p-6 bg-blue-500">Hello</div>
```

### Makeswift Runtime Schema → JSX

Convert actual Makeswift page data (the format stored in the database) to JSX:

```typescript
import { transformRuntimeToJSX } from '@makeswift/jsx-to-makeswift'

const runtimeSchema = {
  key: "abc123",
  type: "./components/Box/index.js",
  props: {
    padding: [{ deviceId: "desktop", value: { paddingTop: { value: 20, unit: "px" }, ... } }],
    children: { elements: [...] }
  }
}

const result = transformRuntimeToJSX(runtimeSchema)
console.log(result.jsx)
// <div className="lg:p-5">...</div>
```

The CLI auto-detects the schema format:

```bash
# Works with both ElementSchema and Makeswift Runtime formats
npx jsx-to-makeswift reverse makeswift-page.json
```

### Options

```typescript
const result = transformJSX(jsx, {
  // Include original Tailwind classes in metadata
  preserveOriginalClasses: true,

  // Include hover:, focus:, etc. variants in metadata
  includeStateVariants: true,

  // Infer content control types (TextInput, TextArea, RichText)
  inferContentControls: true,
})
```

## Features

### Tailwind Class Resolution

Maps Tailwind utility classes to CSS properties:

- **Spacing**: `m-*`, `p-*`, `gap-*` → Style control (margin, padding, gap)
- **Sizing**: `w-*`, `h-*`, `min-*`, `max-*` → Style control
- **Colors**: `text-*`, `bg-*`, `border-*` → Color control
- **Typography**: `font-*`, `text-*`, `leading-*` → Typography control
- **Layout**: `flex`, `grid`, `block`, position utilities → Style control
- **Borders**: `border-*`, `rounded-*`, `shadow-*` → Style control

### Responsive Support

Handles Tailwind responsive prefixes and maps them to Makeswift's three-device model:

| Tailwind | Makeswift Device |
|----------|------------------|
| (base)   | `mobile`         |
| `sm:`    | `tablet`         |
| `md:`, `lg:`, `xl:`, `2xl:` | `desktop` |

When multiple breakpoints map to the same device (e.g., `md:` and `lg:` both → `desktop`), the largest breakpoint takes precedence.

```jsx
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
```

Maps to:
- `mobile` → padding: 1rem
- `tablet` → padding: 1.5rem
- `desktop` → padding: 3rem (lg: wins over md:)

### Content Type Inference

Automatically infers appropriate content control types:

- `<h1>Short title</h1>` → TextInput
- `<p>Longer paragraph content...</p>` → TextArea
- `<p>Text with <strong>formatting</strong></p>` → RichText

### Arbitrary Values

Supports Tailwind arbitrary value syntax:

```jsx
<div className="w-[300px] bg-[#ff0000]">
```

### Image Detection

Automatically detects `<img>` elements and extracts image attributes:

```jsx
<img src="/hero.jpg" alt="Hero image" width={800} height={600} className="rounded-lg" />
```

Generates:
- `image` control with `src`, `alt`, `width`, `height`
- `style` control for Tailwind classes

### Link Detection

Detects `<a>` elements and extracts link attributes:

```jsx
<a href="/about" target="_blank" className="text-blue-500">About Us</a>
```

Generates:
- `link` control with `href`, `target`
- `content` control for link text
- `textColor` control for Tailwind color classes

### Button Detection

Handles `<button>` elements with optional link attributes:

```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Click Me</button>
```

Generates:
- `content` control for button text
- `style`, `backgroundColor`, `textColor` controls for styling
- `link` control if `href` attribute is present

### Video Detection

Extracts video source and poster from `<video>` elements:

```jsx
<video src="/intro.mp4" poster="/thumbnail.jpg" className="w-full" />
```

Generates:
- `video` control with source URL
- `poster` control (Image type) for thumbnail

## API Reference

### `transformJSX(source, options?)`

Parses JSX source and returns transform results.

**Parameters:**
- `source: string` - JSX source code
- `options?: TransformJSXOptions` - Transform options

**Returns:** `TransformJSXResult`
- `schemas: ElementSchema[]` - Generated schemas
- `errors: string[]` - Parse errors
- `warnings: string[]` - Transform warnings
- `unmappedClasses: string[]` - Tailwind classes that couldn't be mapped

### `transformJSXToJSON(source, options?)`

Same as `transformJSX` but returns a JSON string.

### `transformSchemaToJSX(input, options?)`

Transforms a Makeswift control schema back to JSX with Tailwind classes.

- `input` - Schema object, array of schemas, or JSON string
- `options.preferShorthand` - Use shorthand classes (e.g., `p-4` vs `pt-4 pr-4 pb-4 pl-4`)
- `options.selfClosingTags` - Use self-closing tags for empty elements
- Returns `{ jsx: string, warnings: string[], unmappedValues: string[] }`

### `schemaToJSXString(input, options?)`

Same as `transformSchemaToJSX` but returns just the JSX string.

### `transformRuntimeToJSX(input, options?)`

Transforms a Makeswift runtime schema (actual page data) to JSX with Tailwind.

- `input` - Makeswift runtime schema object or JSON string
- `options.indent` - Indentation string (default: 2 spaces)
- `options.includeKeys` - Include `data-key` attributes for debugging
- Returns `{ jsx: string, warnings: string[] }`

Auto-detects the format: works with both ElementSchema and Makeswift runtime formats.

### `parseJSX(source)`

Low-level JSX parsing using Babel.

### `tokenizeTailwindClasses(className)`

Tokenizes Tailwind class string into structured tokens.

### `buildSchema(elements, options?)`

Builds control schemas from parsed JSX elements.

## Output Schema

```typescript
type ElementSchema = {
  type: string           // Inferred element type (Container, Heading, Button, etc.)
  tagName: string        // Original HTML tag name
  controls: Record<string, ControlValue>
  children?: SlotControlValue
  metadata?: {
    originalClassName?: string
    stateVariants?: Record<string, string[]>
  }
}
```

## Control Types

| Control | Description |
|---------|-------------|
| `Style` | CSS styling properties (margin, padding, layout, etc.) |
| `Color` | Color values with swatch support |
| `Typography` | Font properties (size, weight, family, etc.) |
| `TextInput` | Single-line text content |
| `TextArea` | Multi-line text content |
| `RichText` | Formatted text with inline elements |
| `Image` | Image with src, alt, width, height |
| `Link` | Link with href, target |
| `Slot` | Container for child elements |

## CLI Usage

The package includes a CLI tool for bidirectional conversion:

### Convert JSX to Schema

```bash
# Convert a single file
npx jsx-to-makeswift convert src/components/Hero.tsx

# Convert multiple files
npx jsx-to-makeswift convert src/components/*.tsx

# Read from stdin
echo '<div className="p-4">Hello</div>' | npx jsx-to-makeswift convert --stdin

# Compact output (no pretty-printing)
npx jsx-to-makeswift convert --compact src/components/Card.tsx
```

### Convert Schema to JSX (Reverse)

```bash
# Convert a JSON schema file to JSX
npx jsx-to-makeswift reverse schema.json

# Read schema from stdin
cat schema.json | npx jsx-to-makeswift reverse --stdin

# Round-trip: JSX → Schema → JSX
echo '<div className="p-4 bg-blue-500">Hello</div>' | \
  npx jsx-to-makeswift convert --stdin | \
  npx jsx-to-makeswift reverse --stdin
```

### Help

```bash
npx jsx-to-makeswift --help
```

### CLI Options

| Option | Description |
|--------|-------------|
| `--help, -h` | Show help message |
| `--version, -v` | Show version number |
| `--stdin` | Read input from stdin |
| `--pretty` | Pretty-print JSON output (default) |
| `--compact` | Compact JSON output |
| `--fragment` | Treat input as JSX fragment |

### Exit Codes

- `0` - Success
- `1` - Error (parse error, file not found, etc.)

## Documentation

For detailed documentation, see:

- [Mapping Reference](./docs/mapping-reference.md) - Complete Tailwind to Control mapping
- [Examples](./docs/examples.md) - Common component patterns and usage examples

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Development mode
pnpm dev
```

### Local CLI Setup with pnpm link

To test the CLI locally as if it were installed globally:

```bash
# 1. Build the package
pnpm build

# 2. Link globally
pnpm link --global

# 3. Now use the CLI from anywhere
jsx-to-makeswift --help
jsx-to-makeswift convert path/to/component.tsx
echo '<div className="p-4">Hello</div>' | jsx-to-makeswift convert --stdin

# To unlink later
pnpm unlink --global @makeswift/jsx-to-makeswift
```

Alternatively, run without linking:

```bash
# Using pnpm exec within the package directory
pnpm exec jsx-to-makeswift --help

# Or run the built file directly
node dist/cli.js convert path/to/file.tsx
```

## License

MIT
