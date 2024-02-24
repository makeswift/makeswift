import Error from 'next/error'

// See note in `pages/_error.tsx` for why this is required
export default function UnknownPage() {
  return <Error statusCode={404} />
}
