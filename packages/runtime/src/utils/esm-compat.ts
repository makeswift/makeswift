// see https://www.npmjs.com/package/vite-plugin-cjs-interop
export const esmCompat = <T>(x: T): T => (x as any).default ?? x
