import { type HttpFetch } from './types'

export type TableRecordColumn = { columnId: string; data: unknown }

export class MakeswiftTableRecordClient {
  private readonly fetch: HttpFetch

  constructor({ fetch }: { fetch: HttpFetch }) {
    this.fetch = fetch
  }

  async createTableRecord(tableId: string, columns: TableRecordColumn[]): Promise<void> {
    const response = await this.fetch('/api/makeswift/table-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId, columns }),
    })

    if (!response.ok) {
      const message = await response
        .json()
        .then(body => (typeof body?.message === 'string' ? body.message : null))
        .catch(() => null)

      throw new Error(
        message ?? `Failed to create table record for table '${tableId}': ${response.status}`,
      )
    }
  }
}
