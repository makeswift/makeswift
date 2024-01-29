const originalError = console.error
let patched = false

/**
 * @see https://github.com/facebook/react/blob/a2505792ed17fd4d7ddc69561053c3ac90899491/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1814-L1890
 */
export function suppressRefWarning(ownerName: string): void {
  if (patched === false) {
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Function components cannot be given refs.') &&
        args[0].includes(`Check the render method of \`${ownerName}\`.`)
      ) {
        return
      }

      return originalError(...args)
    }

    patched = true
  }
}
