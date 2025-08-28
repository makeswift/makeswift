type Params = { [key: string]: string | string[] }

export type Context = { params: Promise<Params> }
