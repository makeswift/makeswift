import type { RootStyleProps } from '@makeswift/runtime/unstable-framework-support'

// Note the importance of passing the same custom class name prefix (if a custom
// prefix is actually being used) to all the different locations that will generate
// class names. These locations will include RootStyleRegistry usages as well as
// the RSC render context.
export const rootStyleProps: RootStyleProps = {
  classNamePrefix: 'mswft',
}
