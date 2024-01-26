import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-col h-screen w-screen">
      <div className="prose w-96">
        <h1>Test URLs</h1>
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Pages URL</th>
              <th>App URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>hello-world</td>
              <td>
                <Link href="/hello-world-page">pages</Link>
              </td>
              <td>
                <Link href="/hello-world-app">app</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
