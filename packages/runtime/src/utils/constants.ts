export const BuilderEditMode = {
  BUILD: 'build',
  CONTENT: 'content',
} as const

export type BuilderEditMode = typeof BuilderEditMode[keyof typeof BuilderEditMode]
