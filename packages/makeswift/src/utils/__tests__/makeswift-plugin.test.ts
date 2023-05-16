import { isAlreadyIntegrated, manipulateNextConfig } from '../manipulate-next-config'

test('exporting config object', () => {
  // Arrange
  const input = `/**
  * @type {import('next').NextConfig}
  */
 const nextConfig = {
   /* config options here */
 }

 module.exports = nextConfig
 `

  /*
   * There are a couple "problems" with this:
   * 1. It adds semi-colons
   * 2. It removes whitespace
   *
   * I'm going to ignore those things because I don't see clear ways to prevent that —
   * none of that information (whether or not semi-colons existed, newlines at the end, etc.)
   * goes into the AST, so Babel has to follow some standard. I'm going to go with the defaults.
   */
  const expected = `const withMakeswift = require("@makeswift/runtime/next/plugin")();

/**
  * @type {import('next').NextConfig}
  */
const nextConfig = {
  /* config options here */
};
module.exports = withMakeswift(nextConfig);`

  // Act
  const output = manipulateNextConfig(input)

  // Assert
  expect(output).toBe(expected)
})

test('exporting config object directly', () => {
  // Arrange
  const input = `module.exports = {
  /* config options here */
}
`

  const expected = `const withMakeswift = require("@makeswift/runtime/next/plugin")();

module.exports = withMakeswift({});`

  // Act
  const output = manipulateNextConfig(input)

  // Assert
  expect(output).toBe(expected)
})

test('exporting a call expression', () => {
  // Arrange
  const input = `const withFoo = require('foo')

  module.exports = withFoo({})
  `
  const expected = `const withMakeswift = require("@makeswift/runtime/next/plugin")();

const withFoo = require('foo');

module.exports = withMakeswift(withFoo({}));`

  // Act
  const output = manipulateNextConfig(input)

  // Assert
  expect(output).toBe(expected)
})

test('exporting a complicated call expression', () => {
  // Arrange
  const input = `const withFoo = require('foo');

  module.exports = withFoo(withCSS({
    hello: "world",
    more: "things"
  }));`
  const expected = `const withMakeswift = require("@makeswift/runtime/next/plugin")();

const withFoo = require('foo');

module.exports = withMakeswift(withFoo(withCSS({
  hello: "world",
  more: "things"
})));`

  // Act
  const output = manipulateNextConfig(input)

  // Assert
  expect(output).toBe(expected)
})

test('already integrated, should not reintegrate', () => {
  // Arrange
  const alreadyIntegrated = `const withMakeswift = require("@makeswift/runtime/next/plugin")();

const withFoo = require('foo');

module.exports = withMakeswift(withFoo(withCSS({
  hello: "world",
  more: "things"
})));`

  // Act
  const output = isAlreadyIntegrated(alreadyIntegrated)

  // Assert
  expect(output).toBe(true)
})
