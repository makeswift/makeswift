# Markdown Feature Sampler

A tiny doc that hits most **basic** features of Markdown (GFM flavor).  
This line ends with two spaces → forces a line break.

## Table of Contents

- [Markdown Feature Sampler](#markdown-feature-sampler)
  - [Table of Contents](#table-of-contents)
  - [Headings](#headings)
- [H1](#h1)
  - [H2](#h2)
    - [H3](#h3)
      - [H4](#h4)
        - [H5](#h5)
          - [H6](#h6)
  - [Emphasis](#emphasis)
  - [Lists](#lists)
  - [Links \& Images](#links--images)
  - [Blockquotes](#blockquotes)
  - [Code](#code)
  - [Tables](#tables)
  - [Horizontal Rules](#horizontal-rules)
  - [Escapes](#escapes)
  - [Footnotes](#footnotes)

---

## Headings

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Emphasis

_Italic_ · _Italic_  
**Bold** · **Bold**  
**_Bold + Italic_**  
~~Strikethrough~~

## Lists

**Unordered**

- One
- Two
  - Two point one
    - Two point one point one
- Three

**Ordered**

1. First
2. Second
   1. Second sub-item
   2. Another sub-item
3. Third

**Task list (GFM)**

- [x] Do the thing
- [ ] Review the thing
- [ ] Ship the thing

## Links & Images

**Inline links**

- [Makeswift](https://makeswift.com 'Makeswift homepage')
- Autolink: <https://example.com>
- Email: <user@example.com>

**Reference-style link**

- See the [reference link][ref].

**Inline image**
![A placeholder banner](https://via.placeholder.com/600x200 'Sample Image')

**Reference-style image**
![Tiny logo][logo]

## Blockquotes

> “Markdown is a lightweight markup language for creating formatted text using a plain-text editor.”  
> — _Someone on the Internet_
>
> - You can put lists in quotes
> - And even nest quotes:
>   > Nested thoughts go here.

## Code

Inline `code` looks like this: `npm init -y`.

**Fenced code blocks** (using tildes here so this sample stays copyable):

```bash
# Shell
echo "Hello, Markdown!"
```

```js
// JavaScript
const greet = (name) => `Hello, ${name}!`
console.log(greet('World'))
```

```diff
diff --git a/file.txt b/file.txt
- old line
+ new line
```

## Tables

| Left align | Center align | Right align |
| :--------- | :----------: | ----------: |
| Apple      |    Banana    |           1 |
| Carrot     |    Donut     |         200 |
| Eggplant   |     Fig      |        3000 |

> Tip: use colons `:` to control alignment.

## Horizontal Rules

Three or more `-`, `*`, or `_` on a line by themselves:

---

---

---

## Escapes

Use backslashes to show literal Markdown characters:  
\*not italic\*, \_not italic\_, \`not code\`, \[not a link\]\( )

You can also write emoji shortcodes (GFM): :sparkles: :tada:

## Footnotes

Here’s a sentence with a footnote marker.[^note]

---

[ref]: https://example.com 'Example site'
[logo]: https://via.placeholder.com/120 'Placeholder Logo'

[^note]: This is the footnote text. It can contain **formatting**, links, and more.
