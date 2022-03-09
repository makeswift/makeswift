const coalesce = <T>(...args: Array<T>): T => {
  let i: number

  for (i = 0; i < args.length - 1; i += 1) {
    if (args[i] != null) return args[i]
  }

  return args[i]
}

export default coalesce
