export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
