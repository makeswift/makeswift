const keys = <O extends { [key: string]: unknown }>(o: O): (keyof O)[] => Object.keys(o)

export default keys
