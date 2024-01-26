declare module 'ot-json0' {
  type JSONData = null | boolean | number | string | Array<JSONData> | { [ey: string]: JSONData }

  type ReadOnlyJSONData =
    | null
    | boolean
    | number
    | string
    | ReadonlyArray<ReadOnlyJSONData>
    | { readonly [key: string]: ReadOnlyJSONData }

  export type Snapshot = JSONData

  export type ReadOnlySnapshot = ReadOnlyJSONData

  type Path = Array<string | number>

  type OperationComponent =
    | { p: Path; li: ReadOnlySnapshot }
    | { p: Path; ld: ReadOnlySnapshot }
    | { p: Path; ld: ReadOnlySnapshot; li: ReadOnlySnapshot }
    | { p: Path; oi: ReadOnlySnapshot }
    | { p: Path; od: ReadOnlySnapshot }
    | { p: Path; od: ReadOnlySnapshot; oi: ReadOnlySnapshot }

  export type Operation = ReadonlyArray<OperationComponent>

  type Type = {
    apply(snapshot: Snapshot, op: Operation): Snapshot
    invert(op: Operation): Operation
    compose(op1: Operation, op2: Operation): Operation
  }

  export const type: Type
}
