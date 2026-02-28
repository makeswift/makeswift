# Tailwind to Makeswift Controls Mapping Reference

This document provides a complete reference of how Tailwind CSS classes map to Makeswift controls.

## Control Types

| Control | Description | Example Tailwind Classes |
|---------|-------------|--------------------------|
| `Style` | CSS layout, spacing, sizing, borders | `m-4`, `p-6`, `flex`, `rounded-lg` |
| `Color` | Color values (text, background, border) | `text-blue-500`, `bg-gray-100` |
| `Typography` | Font properties | `text-xl`, `font-bold`, `leading-relaxed` |
| `TextInput` | Single-line text content | (inferred from short text) |
| `TextArea` | Multi-line text content | (inferred from long text) |
| `RichText` | Formatted text content | (inferred from nested inline elements) |
| `Image` | Image with src/alt/dimensions | (from `<img>` elements) |
| `Link` | URL with href/target | (from `<a>` elements) |
| `Slot` | Container for nested elements | (from child elements) |

---

## Spacing Classes

### Margin

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `m-0` | margin | 0 |
| `m-1` | margin | 0.25rem |
| `m-2` | margin | 0.5rem |
| `m-3` | margin | 0.75rem |
| `m-4` | margin | 1rem |
| `m-5` | margin | 1.25rem |
| `m-6` | margin | 1.5rem |
| `m-8` | margin | 2rem |
| `m-10` | margin | 2.5rem |
| `m-12` | margin | 3rem |
| `m-16` | margin | 4rem |
| `m-20` | margin | 5rem |
| `m-24` | margin | 6rem |
| `m-auto` | margin | auto |

**Directional variants:** `mt-*`, `mr-*`, `mb-*`, `ml-*`, `mx-*`, `my-*`

### Padding

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `p-0` | padding | 0 |
| `p-1` | padding | 0.25rem |
| `p-2` | padding | 0.5rem |
| `p-3` | padding | 0.75rem |
| `p-4` | padding | 1rem |
| `p-5` | padding | 1.25rem |
| `p-6` | padding | 1.5rem |
| `p-8` | padding | 2rem |
| `p-10` | padding | 2.5rem |
| `p-12` | padding | 3rem |
| `p-16` | padding | 4rem |

**Directional variants:** `pt-*`, `pr-*`, `pb-*`, `pl-*`, `px-*`, `py-*`

### Gap

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `gap-0` | gap | 0 |
| `gap-1` | gap | 0.25rem |
| `gap-2` | gap | 0.5rem |
| `gap-4` | gap | 1rem |
| `gap-6` | gap | 1.5rem |
| `gap-8` | gap | 2rem |

**Directional variants:** `gap-x-*`, `gap-y-*`

---

## Sizing Classes

### Width

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `w-0` | width | 0 |
| `w-1` | width | 0.25rem |
| `w-2` | width | 0.5rem |
| `w-4` | width | 1rem |
| `w-8` | width | 2rem |
| `w-16` | width | 4rem |
| `w-32` | width | 8rem |
| `w-64` | width | 16rem |
| `w-auto` | width | auto |
| `w-full` | width | 100% |
| `w-screen` | width | 100vw |
| `w-1/2` | width | 50% |
| `w-1/3` | width | 33.333333% |
| `w-2/3` | width | 66.666667% |
| `w-1/4` | width | 25% |
| `w-3/4` | width | 75% |

### Height

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `h-0` | height | 0 |
| `h-1` | height | 0.25rem |
| `h-4` | height | 1rem |
| `h-8` | height | 2rem |
| `h-16` | height | 4rem |
| `h-auto` | height | auto |
| `h-full` | height | 100% |
| `h-screen` | height | 100vh |

### Max Width

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `max-w-xs` | maxWidth | 20rem |
| `max-w-sm` | maxWidth | 24rem |
| `max-w-md` | maxWidth | 28rem |
| `max-w-lg` | maxWidth | 32rem |
| `max-w-xl` | maxWidth | 36rem |
| `max-w-2xl` | maxWidth | 42rem |
| `max-w-4xl` | maxWidth | 56rem |
| `max-w-6xl` | maxWidth | 72rem |
| `max-w-full` | maxWidth | 100% |

---

## Color Classes

### Text Colors

| Tailwind Class | CSS Property | Hex Value |
|----------------|--------------|-----------|
| `text-black` | color | #000000 |
| `text-white` | color | #ffffff |
| `text-gray-50` | color | #f9fafb |
| `text-gray-100` | color | #f3f4f6 |
| `text-gray-200` | color | #e5e7eb |
| `text-gray-300` | color | #d1d5db |
| `text-gray-400` | color | #9ca3af |
| `text-gray-500` | color | #6b7280 |
| `text-gray-600` | color | #4b5563 |
| `text-gray-700` | color | #374151 |
| `text-gray-800` | color | #1f2937 |
| `text-gray-900` | color | #111827 |
| `text-blue-500` | color | #3b82f6 |
| `text-red-500` | color | #ef4444 |
| `text-green-500` | color | #22c55e |

### Background Colors

| Tailwind Class | CSS Property | Hex Value |
|----------------|--------------|-----------|
| `bg-white` | backgroundColor | #ffffff |
| `bg-black` | backgroundColor | #000000 |
| `bg-gray-50` | backgroundColor | #f9fafb |
| `bg-gray-100` | backgroundColor | #f3f4f6 |
| `bg-gray-200` | backgroundColor | #e5e7eb |
| `bg-blue-500` | backgroundColor | #3b82f6 |
| `bg-blue-600` | backgroundColor | #2563eb |
| `bg-red-500` | backgroundColor | #ef4444 |
| `bg-green-500` | backgroundColor | #22c55e |

---

## Typography Classes

### Font Size

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `text-xs` | fontSize | 0.75rem |
| `text-sm` | fontSize | 0.875rem |
| `text-base` | fontSize | 1rem |
| `text-lg` | fontSize | 1.125rem |
| `text-xl` | fontSize | 1.25rem |
| `text-2xl` | fontSize | 1.5rem |
| `text-3xl` | fontSize | 1.875rem |
| `text-4xl` | fontSize | 2.25rem |
| `text-5xl` | fontSize | 3rem |
| `text-6xl` | fontSize | 3.75rem |

### Font Weight

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `font-thin` | fontWeight | 100 |
| `font-extralight` | fontWeight | 200 |
| `font-light` | fontWeight | 300 |
| `font-normal` | fontWeight | 400 |
| `font-medium` | fontWeight | 500 |
| `font-semibold` | fontWeight | 600 |
| `font-bold` | fontWeight | 700 |
| `font-extrabold` | fontWeight | 800 |
| `font-black` | fontWeight | 900 |

### Line Height

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `leading-none` | lineHeight | 1 |
| `leading-tight` | lineHeight | 1.25 |
| `leading-snug` | lineHeight | 1.375 |
| `leading-normal` | lineHeight | 1.5 |
| `leading-relaxed` | lineHeight | 1.625 |
| `leading-loose` | lineHeight | 2 |

### Text Align

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `text-left` | textAlign | left |
| `text-center` | textAlign | center |
| `text-right` | textAlign | right |
| `text-justify` | textAlign | justify |

---

## Layout Classes

### Display

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `block` | display | block |
| `inline-block` | display | inline-block |
| `inline` | display | inline |
| `flex` | display | flex |
| `inline-flex` | display | inline-flex |
| `grid` | display | grid |
| `hidden` | display | none |

### Flex Direction

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `flex-row` | flexDirection | row |
| `flex-row-reverse` | flexDirection | row-reverse |
| `flex-col` | flexDirection | column |
| `flex-col-reverse` | flexDirection | column-reverse |

### Justify Content

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `justify-start` | justifyContent | flex-start |
| `justify-end` | justifyContent | flex-end |
| `justify-center` | justifyContent | center |
| `justify-between` | justifyContent | space-between |
| `justify-around` | justifyContent | space-around |
| `justify-evenly` | justifyContent | space-evenly |

### Align Items

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `items-start` | alignItems | flex-start |
| `items-end` | alignItems | flex-end |
| `items-center` | alignItems | center |
| `items-baseline` | alignItems | baseline |
| `items-stretch` | alignItems | stretch |

### Position

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `static` | position | static |
| `fixed` | position | fixed |
| `absolute` | position | absolute |
| `relative` | position | relative |
| `sticky` | position | sticky |

---

## Border Classes

### Border Radius

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `rounded-none` | borderRadius | 0 |
| `rounded-sm` | borderRadius | 0.125rem |
| `rounded` | borderRadius | 0.25rem |
| `rounded-md` | borderRadius | 0.375rem |
| `rounded-lg` | borderRadius | 0.5rem |
| `rounded-xl` | borderRadius | 0.75rem |
| `rounded-2xl` | borderRadius | 1rem |
| `rounded-3xl` | borderRadius | 1.5rem |
| `rounded-full` | borderRadius | 9999px |

### Border Width

| Tailwind Class | CSS Property | Value |
|----------------|--------------|-------|
| `border-0` | borderWidth | 0 |
| `border` | borderWidth | 1px |
| `border-2` | borderWidth | 2px |
| `border-4` | borderWidth | 4px |
| `border-8` | borderWidth | 8px |

---

## Responsive Breakpoints

| Tailwind Prefix | Makeswift Device | Min Width |
|-----------------|------------------|-----------|
| (none) | `mobile` | 0px |
| `sm:` | `tablet` | 640px |
| `md:` | `desktop` | 768px |
| `lg:` | `desktop` | 1024px |
| `xl:` | `desktop` | 1280px |
| `2xl:` | `desktop` | 1536px |

When multiple Tailwind breakpoints map to `desktop` (md, lg, xl, 2xl), the largest breakpoint takes precedence.

**Example:**

```jsx
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
```

Maps to:

```json
{
  "style": {
    "type": "Style",
    "properties": ["padding"],
    "value": [
      { "deviceId": "mobile", "value": { "padding": "1rem" } },
      { "deviceId": "tablet", "value": { "padding": "1.5rem" } },
      { "deviceId": "desktop", "value": { "padding": "3rem" } }
    ]
  }
}
```

---

## Element Type Inference

| HTML Tag | Inferred Type | Suggested Controls |
|----------|---------------|-------------------|
| `div`, `section`, `article` | Container | Style, Slot |
| `h1`-`h6` | Heading | TextInput, Typography, Style |
| `p` | Paragraph | TextArea, Typography, Style |
| `span` | Text | TextInput, Typography, Style |
| `a` | Link | Link, TextInput, Style |
| `button` | Button | TextInput, Link, Style, Color |
| `img` | Image | Image, Style |
| `video` | Video | TextInput (src), Image (poster), Style |
| `nav`, `header`, `footer` | Nav/Header/Footer | Style, Slot |
| `ul`, `ol` | List | List, Style |

---

## Content Control Inference

| Condition | Inferred Control |
|-----------|------------------|
| Short text (≤50 chars) | TextInput |
| Medium text (51-200 chars) | TextArea |
| Long text (>200 chars) | TextArea |
| Text with newlines | TextArea |
| Contains inline HTML (`<strong>`, `<em>`, etc.) | RichText |
| Heading tags (`h1`-`h6`) with short text | TextInput |
| Button or label elements | TextInput |
