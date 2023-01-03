import Error, { ErrorProps } from 'next/error'
import { useLayoutEffect } from 'react'
import OfflinePage from './_offline'

export default function ErrorPage({ statusCode }: ErrorProps) {
  useLayoutEffect(() => {
    if (statusCode == null && window.navigator.onLine === false) {
      window.location.reload()
    }
  }, [statusCode])

  // Returning the offline page prevents a flicker of the error page in the offline case
  return statusCode == null &&
    typeof window !== 'undefined' &&
    window.navigator.onLine === false ? (
    <OfflinePage />
  ) : (
    <Error statusCode={statusCode} />
  )
}
