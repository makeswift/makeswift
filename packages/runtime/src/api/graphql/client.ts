export class GraphQLClient {
  private endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async request<TData, TVariables = Record<string, never>>(
    query: string,
    variables: TVariables = {} as TVariables,
  ): Promise<TData> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok && response.status !== 400) {
      throw new Error(`${response.status} ${response.statusText}`)
    }

    const body = await response.json()

    if (body.errors != null) {
      console.error(body)

      throw new Error('GraphQL response contains errors, check the console.')
    }

    return body.data
  }
}
