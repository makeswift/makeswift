/**
 * This error type represents expected situations
 * where we want the program to simply exit.
 */
export default class MakeswiftError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
  }
}
